"""
DashboardService: Implements getFounderDashboard, getTeamMemberDashboard, getActivityLogs, getFounderTasks
"""
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import Task, User
from db.enums import TaskPriority, TaskStatus

class DashboardService:
    @staticmethod
    async def get_founder_dashboard(user):
        """
        Get dashboard data for founder.
        """
        return {"success": True, "data": {}}

    @staticmethod
    async def get_team_member_dashboard(user):
        """
        Get dashboard data for team member.
        """
        return {"success": True, "data": {}}

    @staticmethod
    async def get_activity_logs(user):
        """
        Get activity logs.
        """
        return {"success": True, "data": []}

    async def get_founder_tasks(self, user: User, db: AsyncSession):
        """
        Get tasks for founder dashboard.
        Returns high priority and urgent tasks in the workspace.
        """
        if not user or not user.workspace_id:
            raise HTTPException(
                status_code=400,
                detail="User or workspace not found"
            )

        try:
            # Query for high priority and urgent tasks that are not completed
            query = (
                select(Task)
                .where(
                    Task.workspace_id == user.workspace_id,
                    Task.status != TaskStatus.COMPLETED,
                    Task.priority.in_([TaskPriority.HIGH, TaskPriority.URGENT])
                )
                .order_by(Task.due_date)
            )

            result = await db.execute(query)
            tasks = result.scalars().all()
            
            # Convert Enum values to strings for JSON serialization
            task_list = [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "status": task.status.value if task.status else None,
                    "priority": task.priority.value if task.priority else None,
                    "category": task.category,
                    "due_date": task.due_date.isoformat() if task.due_date else None,
                    "assigned_to": task.assigned_to,
                    "contact_id": task.contact_id,
                    "deal_id": task.deal_id,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None,
                }
                for task in tasks
            ]

            return {
                "success": True,
                "data": {
                    "todaysTasks": task_list
                }
            }

        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error retrieving founder tasks: {str(e)}"
            )

    async def get_team_member_tasks(self, user: User, db: AsyncSession):
        """
        Get tasks for team member dashboard.
        Returns today's tasks assigned to the team member.
        """
        if not user or not user.workspace_id:
            raise HTTPException(
                status_code=400,
                detail="User or workspace not found"
            )

        try:
            # Query for tasks assigned to the team member that are not completed
            query = (
                select(Task)
                .where(
                    Task.workspace_id == user.workspace_id,
                    Task.assigned_to == user.id,
                    Task.status != TaskStatus.COMPLETED
                )
                .order_by(Task.due_date)
            )

            result = await db.execute(query)
            tasks = result.scalars().all()
            
            # Convert Enum values to strings for JSON serialization
            task_list = [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "status": task.status.value if task.status else None,
                    "priority": task.priority.value if task.priority else None,
                    "category": task.category,
                    "due_date": task.due_date.isoformat() if task.due_date else None,
                    "assigned_to": task.assigned_to,
                    "contact_id": task.contact_id,
                    "deal_id": task.deal_id,
                    "created_at": task.created_at.isoformat() if task.created_at else None,
                    "updated_at": task.updated_at.isoformat() if task.updated_at else None,
                }
                for task in tasks
            ]

            return {
                "success": True,
                "data": {
                    "todaysTasks": task_list
                }
            }

        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"Error retrieving team member tasks: {str(e)}"
            )
