"""
Note service with specialized note-related database operations.
"""
from typing import Optional, List, Dict, Any
from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from datetime import datetime

from db.models import Note, NoteType
from .base import CRUDBase

class NoteService(CRUDBase[Note]):
    def __init__(self):
        super().__init__(Note)

    async def get_with_relations(
        self,
        db: AsyncSession,
        note_id: int,
        workspace_id: int
    ) -> Optional[Note]:
        """
        Get note with all related data.
        Args:
            db: AsyncSession
            note_id: Note ID
            workspace_id: Workspace ID for security check
        Returns:
            Optional[Note]: Found note with relations or None
        """
        query = (
            select(Note)
            .options(
                joinedload(Note.created_by),
                joinedload(Note.contact),
                joinedload(Note.deal)
            )
            .where(
                and_(
                    Note.id == note_id,
                    Note.workspace_id == workspace_id
                )
            )
        )
        result = await db.execute(query)
        return result.unique().scalar_one_or_none()

    async def get_entity_notes(
        self,
        db: AsyncSession,
        workspace_id: int,
        *,
        contact_id: Optional[int] = None,
        deal_id: Optional[int] = None,
        note_type: Optional[NoteType] = None
    ) -> List[Note]:
        """
        Get notes for a contact or deal with optional type filter.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            contact_id: Optional contact ID
            deal_id: Optional deal ID
            note_type: Optional note type filter
        Returns:
            List[Note]: List of notes
        """
        conditions = [Note.workspace_id == workspace_id]
        
        if contact_id:
            conditions.append(Note.contact_id == contact_id)
        if deal_id:
            conditions.append(Note.deal_id == deal_id)
        if note_type:
            conditions.append(Note.type == note_type)

        query = (
            select(Note)
            .options(
                joinedload(Note.created_by)
            )
            .where(and_(*conditions))
            .order_by(desc(Note.created_at))
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_user_notes(
        self,
        db: AsyncSession,
        user_id: int,
        workspace_id: int,
        *,
        note_type: Optional[NoteType] = None,
        limit: int = 10
    ) -> List[Note]:
        """
        Get notes created by a specific user.
        Args:
            db: AsyncSession
            user_id: User ID
            workspace_id: Workspace ID
            note_type: Optional note type filter
            limit: Maximum number of notes to return
        Returns:
            List[Note]: List of notes
        """
        conditions = [
            Note.created_by_id == user_id,
            Note.workspace_id == workspace_id
        ]
        if note_type:
            conditions.append(Note.type == note_type)

        query = (
            select(Note)
            .options(
                joinedload(Note.contact),
                joinedload(Note.deal)
            )
            .where(and_(*conditions))
            .order_by(desc(Note.created_at))
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def search_notes(
        self,
        db: AsyncSession,
        workspace_id: int,
        search_term: str,
        *,
        contact_id: Optional[int] = None,
        deal_id: Optional[int] = None
    ) -> List[Note]:
        """
        Search notes content.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            search_term: Term to search for
            contact_id: Optional contact ID filter
            deal_id: Optional deal ID filter
        Returns:
            List[Note]: List of matching notes
        """
        conditions = [
            Note.workspace_id == workspace_id,
            Note.content.ilike(f"%{search_term}%")
        ]
        
        if contact_id:
            conditions.append(Note.contact_id == contact_id)
        if deal_id:
            conditions.append(Note.deal_id == deal_id)

        query = (
            select(Note)
            .options(
                joinedload(Note.created_by),
                joinedload(Note.contact),
                joinedload(Note.deal)
            )
            .where(and_(*conditions))
            .order_by(desc(Note.created_at))
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_recent_notes(
        self,
        db: AsyncSession,
        workspace_id: int,
        *,
        note_type: Optional[NoteType] = None,
        limit: int = 5
    ) -> List[Note]:
        """
        Get recent notes with optional type filter.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            note_type: Optional note type filter
            limit: Maximum number of notes to return
        Returns:
            List[Note]: List of recent notes
        """
        conditions = [Note.workspace_id == workspace_id]
        if note_type:
            conditions.append(Note.type == note_type)

        query = (
            select(Note)
            .options(
                joinedload(Note.created_by),
                joinedload(Note.contact),
                joinedload(Note.deal)
            )
            .where(and_(*conditions))
            .order_by(desc(Note.created_at))
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def analyze_note(
        self,
        db: AsyncSession,
        note_id: int,
        workspace_id: int
    ) -> Optional[Dict[str, Any]]:
        """
        Prepare note data for AI analysis.
        This method fetches the note with all context needed for AI processing.
        Args:
            db: AsyncSession
            note_id: Note ID
            workspace_id: Workspace ID for security check
        Returns:
            Optional[Dict[str, Any]]: Note data with context or None
        """
        note = await self.get_with_relations(db, note_id, workspace_id)
        if not note:
            return None

        # Gather context for AI analysis
        context = {
            "note_id": note.id,
            "content": note.content,
            "type": note.type.value if note.type else None,
            "created_at": note.created_at.isoformat(),
            "context": {}
        }

        # Add contact context if available
        if note.contact:
            context["context"]["contact"] = {
                "id": note.contact.id,
                "name": note.contact.name,
                "email": note.contact.email,
                "company": note.contact.company,
                "type": note.contact.type
            }

        # Add deal context if available
        if note.deal:
            context["context"]["deal"] = {
                "id": note.deal.id,
                "name": note.deal.name,
                "stage": note.deal.stage.value,
                "value": note.deal.value
            }

        return context

note_service = NoteService()