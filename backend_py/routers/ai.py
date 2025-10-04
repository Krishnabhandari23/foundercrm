"""
AI feature endpoints using Perplexity API for various CRM operations.
"""
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Path
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_db
from db.models import User
from db.enums import TaskStatus, TaskPriority
from services.ai import ai_service
from services.crud import contact_service, deal_service, task_service, note_service
from app.utils.deps import get_current_user, get_current_workspace_id

router = APIRouter(prefix="/api")

class EmailRequest(BaseModel):
    """Email generation request model."""
    purpose: str
    key_points: List[str]
    template: str = "default"
    tone: str = "professional"

@router.post("/ai/analyze-note/{note_id}")
async def analyze_note(
    note_id: int,
    mode: str = Query("insights", enum=["insights", "sentiment", "action-items"]),
    current_user: User = Depends(get_current_user),
    workspace_id: int = Depends(get_current_workspace_id),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Analyze a note using AI to extract insights, sentiment, or action items.
    """
    note_data = await note_service.analyze_note(db, note_id, workspace_id)
    if not note_data:
        raise HTTPException(status_code=404, detail="Note not found")

    try:
        analysis = await ai_service.analyze_contact_note(note_data, mode=mode)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

@router.post("/ai/prioritize-tasks")
async def prioritize_tasks(
    status: Optional[TaskStatus] = None,
    limit: int = Query(10, ge=1, le=20),
    current_user: User = Depends(get_current_user),
    workspace_id: int = Depends(get_current_workspace_id),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Analyze and prioritize user's tasks using AI.
    """
    tasks = await task_service.get_user_tasks(db, current_user.id, workspace_id, status=status)
    if not tasks:
        raise HTTPException(status_code=404, detail="No tasks found")

    task_data = [
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "priority": task.priority.value if task.priority else None,
            "status": task.status.value if task.status else None,
            "contact": task.contact.name if task.contact else None,
            "deal": task.deal.name if task.deal else None
        }
        for task in tasks[:limit]
    ]

    try:
        analysis = await ai_service.prioritize_tasks(task_data)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Task prioritization failed: {str(e)}"
        )

@router.post("/ai/generate-email/{contact_id}")
async def generate_email(
    contact_id: int,
    request: EmailRequest,
    current_user: User = Depends(get_current_user),
    workspace_id: int = Depends(get_current_workspace_id),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Generate an email draft for a contact using AI.
    """
    contact = await contact_service.get_with_relations(db, contact_id, workspace_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    recent_notes = await note_service.get_entity_notes(
        db, workspace_id, contact_id=contact_id, limit=1
    )

    email_context = {
        "recipient_name": contact.name,
        "recipient_company": contact.company,
        "purpose": request.purpose,
        "key_points": request.key_points,
        "previous_interaction": recent_notes[0].content if recent_notes else None
    }

    try:
        email = await ai_service.generate_email(
            email_context,
            template=request.template,
            tone=request.tone
        )
        return email
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Email generation failed: {str(e)}"
        )

@router.post("/ai/summarize/{entity_type}/{entity_id}")
async def summarize_entity(
    entity_type: str = Path(..., pattern="^(contact|deal)$"),
    entity_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    workspace_id: int = Depends(get_current_workspace_id),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Generate an AI summary for a contact or deal.
    """
    entity = None
    if entity_type == "contact":
        entity = await contact_service.get_with_relations(db, entity_id, workspace_id)
    else:  # deal
        entity = await deal_service.get_with_relations(db, entity_id, workspace_id)

    if not entity:
        raise HTTPException(status_code=404, detail=f"{entity_type} not found")

    if entity_type == "contact":
        entity_data = {
            "id": entity.id,
            "name": entity.name,
            "company": entity.company,
            "type": entity.type,
            "notes": [
                {"content": note.content, "created_at": note.created_at}
                for note in entity.notes
            ],
            "deals": [
                {"name": deal.name, "stage": deal.stage, "value": deal.value}
                for deal in entity.deals
            ],
            "last_interaction": (
                entity.notes[-1].created_at.isoformat()
                if entity.notes else None
            )
        }
    else:  # deal
        entity_data = {
            "id": entity.id,
            "name": entity.name,
            "stage": entity.stage.value,
            "value": entity.value,
            "contact_name": entity.contact.name if entity.contact else None,
            "notes": [
                {"content": note.content, "created_at": note.created_at}
                for note in entity.notes
            ],
            "updated_at": entity.updated_at.isoformat()
        }

    try:
        summary = await ai_service.summarize_entity(entity_type, entity_data)
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Summary generation failed: {str(e)}"
        )
