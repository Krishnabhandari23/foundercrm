"""
Contact service with specialized contact-related database operations.
"""
from typing import Optional, Dict, Any, List
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from db.models import Contact, Tag, Interaction, Note
from .base import CRUDBase

class ContactService(CRUDBase[Contact]):
    def __init__(self):
        super().__init__(Contact)

    async def get_with_relations(
        self,
        db: AsyncSession,
        contact_id: int,
        workspace_id: int
    ) -> Optional[Contact]:
        """
        Get contact with all related data.
        Args:
            db: AsyncSession
            contact_id: Contact ID
            workspace_id: Workspace ID for security check
        Returns:
            Optional[Contact]: Found contact with relations or None
        """
        query = (
            select(Contact)
            .options(
                joinedload(Contact.tags),
                joinedload(Contact.interactions),
                joinedload(Contact.notes),
                joinedload(Contact.tasks),
                joinedload(Contact.deals)
            )
            .where(
                and_(
                    Contact.id == contact_id,
                    Contact.workspace_id == workspace_id
                )
            )
        )
        result = await db.execute(query)
        return result.unique().scalar_one_or_none()

    async def get_contacts_by_type(
        self,
        db: AsyncSession,
        workspace_id: int,
        contact_type: str
    ) -> List[Contact]:
        """
        Get contacts filtered by type.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            contact_type: Type of contacts to filter by
        Returns:
            List[Contact]: List of found contacts
        """
        query = select(Contact).where(
            and_(
                Contact.workspace_id == workspace_id,
                Contact.type == contact_type
            )
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def search_contacts(
        self,
        db: AsyncSession,
        workspace_id: int,
        search_term: str
    ) -> List[Contact]:
        """
        Search contacts by name, email, or company.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            search_term: Term to search for
        Returns:
            List[Contact]: List of matching contacts
        """
        search = f"%{search_term}%"
        query = select(Contact).where(
            and_(
                Contact.workspace_id == workspace_id,
                (
                    Contact.name.ilike(search) |
                    Contact.email.ilike(search) |
                    Contact.company.ilike(search)
                )
            )
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def add_interaction(
        self,
        db: AsyncSession,
        *,
        contact_id: int,
        interaction_data: Dict[str, Any]
    ) -> Interaction:
        """
        Add interaction to contact.
        Args:
            db: AsyncSession
            contact_id: Contact ID
            interaction_data: Interaction details
        Returns:
            Interaction: Created interaction
        """
        interaction = Interaction(contact_id=contact_id, **interaction_data)
        db.add(interaction)
        await db.commit()
        await db.refresh(interaction)
        return interaction

    async def add_note(
        self,
        db: AsyncSession,
        *,
        contact_id: int,
        note_data: Dict[str, Any]
    ) -> Note:
        """
        Add note to contact.
        Args:
            db: AsyncSession
            contact_id: Contact ID
            note_data: Note details
        Returns:
            Note: Created note
        """
        note = Note(contact_id=contact_id, **note_data)
        db.add(note)
        await db.commit()
        await db.refresh(note)
        return note

    async def update_tags(
        self,
        db: AsyncSession,
        *,
        contact_id: int,
        tags: List[str]
    ) -> Contact:
        """
        Update contact tags.
        Args:
            db: AsyncSession
            contact_id: Contact ID
            tags: List of tag names
        Returns:
            Contact: Updated contact
        """
        contact = await self.get(db, contact_id)
        if not contact:
            return None

        # Clear existing tags
        contact.tags = []

        # Add new tags
        for tag_name in tags:
            tag = await db.execute(
                select(Tag).where(Tag.name == tag_name)
            )
            tag = tag.scalar_one_or_none()
            if not tag:
                tag = Tag(name=tag_name, workspace_id=contact.workspace_id)
                db.add(tag)
            contact.tags.append(tag)

        await db.commit()
        await db.refresh(contact)
        return contact

contact_service = ContactService()