"""
Deal service with specialized deal-related database operations.
"""
from typing import Optional, List, Dict, Any
from sqlalchemy import select, and_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from datetime import datetime

from db.models import Deal, DealStage
from .base import CRUDBase

class DealService(CRUDBase[Deal]):
    def __init__(self):
        super().__init__(Deal)

    async def get_with_relations(
        self,
        db: AsyncSession,
        deal_id: int,
        workspace_id: int
    ) -> Optional[Deal]:
        """
        Get deal with all related data.
        Args:
            db: AsyncSession
            deal_id: Deal ID
            workspace_id: Workspace ID for security check
        Returns:
            Optional[Deal]: Found deal with relations or None
        """
        query = (
            select(Deal)
            .options(
                joinedload(Deal.contact),
                joinedload(Deal.notes),
                joinedload(Deal.tasks)
            )
            .where(
                and_(
                    Deal.id == deal_id,
                    Deal.workspace_id == workspace_id
                )
            )
        )
        result = await db.execute(query)
        return result.unique().scalar_one_or_none()

    async def get_deals_by_stage(
        self,
        db: AsyncSession,
        workspace_id: int,
        stage: DealStage
    ) -> List[Deal]:
        """
        Get deals filtered by stage.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            stage: Stage to filter by
        Returns:
            List[Deal]: List of found deals
        """
        query = (
            select(Deal)
            .where(
                and_(
                    Deal.workspace_id == workspace_id,
                    Deal.stage == stage
                )
            )
            .order_by(desc(Deal.updated_at))
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_deals_by_contact(
        self,
        db: AsyncSession,
        contact_id: int,
        workspace_id: int
    ) -> List[Deal]:
        """
        Get all deals for a specific contact.
        Args:
            db: AsyncSession
            contact_id: Contact ID
            workspace_id: Workspace ID for security check
        Returns:
            List[Deal]: List of deals
        """
        query = (
            select(Deal)
            .where(
                and_(
                    Deal.contact_id == contact_id,
                    Deal.workspace_id == workspace_id
                )
            )
            .order_by(desc(Deal.updated_at))
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def update_stage(
        self,
        db: AsyncSession,
        *,
        deal_id: int,
        stage: DealStage,
        workspace_id: int
    ) -> Optional[Deal]:
        """
        Update deal stage.
        Args:
            db: AsyncSession
            deal_id: Deal ID
            stage: New stage
            workspace_id: Workspace ID for security check
        Returns:
            Optional[Deal]: Updated deal or None
        """
        deal = await self.get(db, deal_id)
        if not deal or deal.workspace_id != workspace_id:
            return None

        deal.stage = stage
        deal.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(deal)
        return deal

    async def get_pipeline_summary(
        self,
        db: AsyncSession,
        workspace_id: int
    ) -> Dict[str, Any]:
        """
        Get deal pipeline summary with counts and values by stage.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
        Returns:
            Dict[str, Any]: Pipeline summary
        """
        stages = {}
        for stage in DealStage:
            deals = await self.get_deals_by_stage(db, workspace_id, stage)
            stages[stage.value] = {
                "count": len(deals),
                "value": sum(deal.value for deal in deals if deal.value),
                "deals": deals
            }

        return {
            "total_count": sum(data["count"] for data in stages.values()),
            "total_value": sum(data["value"] for data in stages.values()),
            "stages": stages
        }

    async def get_recent_won_deals(
        self,
        db: AsyncSession,
        workspace_id: int,
        limit: int = 5
    ) -> List[Deal]:
        """
        Get recently won deals.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            limit: Number of deals to return
        Returns:
            List[Deal]: List of recently won deals
        """
        query = (
            select(Deal)
            .where(
                and_(
                    Deal.workspace_id == workspace_id,
                    Deal.stage == DealStage.WON
                )
            )
            .order_by(desc(Deal.updated_at))
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

deal_service = DealService()