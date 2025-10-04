"""
Contact endpoints: getContacts, getContact, createContact, updateContact, deleteContact, addInteraction
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from utils.jwt import get_current_user
from services.contact_service import ContactService

router = APIRouter()

@router.get("/")
async def get_contacts(user=Depends(get_current_user), type: str = None, search: str = None):
    """Get all contacts for workspace."""
    return await ContactService.get_contacts(user, type, search)

@router.get("/{id}")
async def get_contact(id: int, user=Depends(get_current_user)):
    """Get single contact by ID."""
    return await ContactService.get_contact(id, user)

@router.post("/")
async def create_contact(data: dict, user=Depends(get_current_user)):
    """Create a new contact."""
    return await ContactService.create_contact(data, user)

@router.put("/{id}")
async def update_contact(id: int, data: dict, user=Depends(get_current_user)):
    """Update contact by ID."""
    return await ContactService.update_contact(id, data, user)

@router.delete("/{id}")
async def delete_contact(id: int, user=Depends(get_current_user)):
    """Delete contact by ID."""
    return await ContactService.delete_contact(id, user)

@router.post("/{contactId}/interactions")
async def add_interaction(contactId: int, data: dict, user=Depends(get_current_user)):
    """Add interaction to contact."""
    return await ContactService.add_interaction(contactId, data, user)
