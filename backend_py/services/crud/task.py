"""
Task service with specialized task-related database operations.
"""
from typing import Optional, List, Dict, Any
from sqlalchemy import select, and_, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from datetime import datetime, date

from db.models import Task, TaskStatus, TaskPriority
from .base import CRUDBase

class TaskService(CRUDBase[Task]):
    def __init__(self):
        super().__init__(Task)

    async def get_with_relations(
        self,
        db: AsyncSession,
        task_id: int,
        workspace_id: int
    ) -> Optional[Task]:
        """
        Get task with all related data.
        Args:
            db: AsyncSession
            task_id: Task ID
            workspace_id: Workspace ID for security check
        Returns:
            Optional[Task]: Found task with relations or None
        """
        query = (
            select(Task)
            .options(
                joinedload(Task.assigned_to),
                joinedload(Task.contact),
                joinedload(Task.deal)
            )
            .where(
                and_(
                    Task.id == task_id,
                    Task.workspace_id == workspace_id
                )
            )
        )
        result = await db.execute(query)
        return result.unique().scalar_one_or_none()

    async def get_user_tasks(
        self,
        db: AsyncSession,
        user_id: int,
        workspace_id: int,
        status: Optional[TaskStatus] = None
    ) -> List[Task]:
        """
        Get tasks assigned to a specific user.
        Args:
            db: AsyncSession
            user_id: User ID
            workspace_id: Workspace ID
            status: Optional task status filter
        Returns:
            List[Task]: List of tasks
        """
        conditions = [
            Task.assigned_to_id == user_id,
            Task.workspace_id == workspace_id
        ]
        if status:
            conditions.append(Task.status == status)

        query = (
            select(Task)
            .options(
                joinedload(Task.contact),
                joinedload(Task.deal)
            )
            .where(and_(*conditions))
            .order_by(Task.due_date, desc(Task.priority))
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_overdue_tasks(
        self,
        db: AsyncSession,
        workspace_id: int,
        user_id: Optional[int] = None
    ) -> List[Task]:
        """
        Get overdue tasks.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            user_id: Optional user ID to filter by
        Returns:
            List[Task]: List of overdue tasks
        """
        conditions = [
            Task.workspace_id == workspace_id,
            Task.status != TaskStatus.COMPLETED,
            Task.due_date < date.today()
        ]
        if user_id:
            conditions.append(Task.assigned_to_id == user_id)

        query = (
            select(Task)
            .options(
                joinedload(Task.contact),
                joinedload(Task.deal)
            )
            .where(and_(*conditions))
            .order_by(Task.due_date)
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def update_status(
        self,
        db: AsyncSession,
        *,
        task_id: int,
        status: TaskStatus,
        workspace_id: int
    ) -> Optional[Task]:
        """
        Update task status.
        Args:
            db: AsyncSession
            task_id: Task ID
            status: New status
            workspace_id: Workspace ID for security check
        Returns:
            Optional[Task]: Updated task or None
        """
        task = await self.get(db, task_id)
        if not task or task.workspace_id != workspace_id:
            return None

        task.status = status
        task.updated_at = datetime.utcnow()
        if status == TaskStatus.COMPLETED:
            task.completed_at = datetime.utcnow()
        await db.commit()
        await db.refresh(task)
        return task

    async def update_priority(
        self,
        db: AsyncSession,
        *,
        task_id: int,
        priority: TaskPriority,
        workspace_id: int
    ) -> Optional[Task]:
        """
        Update task priority.
        Args:
            db: AsyncSession
            task_id: Task ID
            priority: New priority
            workspace_id: Workspace ID for security check
        Returns:
            Optional[Task]: Updated task or None
        """
        task = await self.get(db, task_id)
        if not task or task.workspace_id != workspace_id:
            return None

        task.priority = priority
        task.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(task)
        return task

    async def get_tasks_by_entity(
        self,
        db: AsyncSession,
        workspace_id: int,
        *,
        contact_id: Optional[int] = None,
        deal_id: Optional[int] = None
    ) -> List[Task]:
        """
        Get tasks related to a contact or deal.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            contact_id: Optional contact ID
            deal_id: Optional deal ID
        Returns:
            List[Task]: List of related tasks
        """
        conditions = [Task.workspace_id == workspace_id]
        if contact_id:
            conditions.append(Task.contact_id == contact_id)
        if deal_id:
            conditions.append(Task.deal_id == deal_id)

        query = (
            select(Task)
            .where(and_(*conditions))
            .order_by(Task.due_date, desc(Task.priority))
        )
        result = await db.execute(query)
        return result.scalars().all()

    async def get_upcoming_tasks(
        self,
        db: AsyncSession,
        workspace_id: int,
        user_id: Optional[int] = None,
        days: int = 7
    ) -> List[Task]:
        """
        Get upcoming tasks due in the next X days.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
            user_id: Optional user ID to filter by
            days: Number of days to look ahead
        Returns:
            List[Task]: List of upcoming tasks
        """
        from datetime import timedelta
        
        today = date.today()
        future = today + timedelta(days=days)
        
        conditions = [
            Task.workspace_id == workspace_id,
            Task.status != TaskStatus.COMPLETED,
            Task.due_date >= today,
            Task.due_date <= future
        ]
        if user_id:
            conditions.append(Task.assigned_to_id == user_id)

        query = (
            select(Task)
            .options(
                joinedload(Task.contact),
                joinedload(Task.deal)
            )
            .where(and_(*conditions))
            .order_by(Task.due_date, desc(Task.priority))
        )
        result = await db.execute(query)
        return result.scalars().all()

task_service = TaskService()