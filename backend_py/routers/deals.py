"""
Deal endpoints: getDeals, getDealsByPipeline, getDeal, createDeal, updateDeal, updateDealStage, deleteDeal
"""
from fastapi import APIRouter, Depends
from utils.jwt import get_current_user
from services.deal_service import DealService

router = APIRouter()

@router.get("/")
async def get_deals(user=Depends(get_current_user), stage: str = None):
    """Get all deals for workspace."""
    return await DealService.get_deals(user, stage)

@router.get("/pipeline")
async def get_deals_by_pipeline(user=Depends(get_current_user)):
    """Get deals by pipeline stage (Kanban view)."""
    return await DealService.get_deals_by_pipeline(user)

@router.get("/{id}")
async def get_deal(id: int, user=Depends(get_current_user)):
    """Get single deal by ID."""
    return await DealService.get_deal(id, user)

@router.post("/")
async def create_deal(data: dict, user=Depends(get_current_user)):
    """Create a new deal."""
    return await DealService.create_deal(data, user)

@router.put("/{id}")
async def update_deal(id: int, data: dict, user=Depends(get_current_user)):
    """Update deal by ID."""
    return await DealService.update_deal(id, data, user)

@router.patch("/{id}/stage")
async def update_deal_stage(id: int, data: dict, user=Depends(get_current_user)):
    """Update deal stage."""
    return await DealService.update_deal_stage(id, data, user)

@router.delete("/{id}")
async def delete_deal(id: int, user=Depends(get_current_user)):
    """Delete deal by ID."""
    return await DealService.delete_deal(id, user)
