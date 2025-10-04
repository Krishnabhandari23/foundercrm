"""
TaskService: Implements getTasks, getMyTasks, getTask, createTask, updateTask, deleteTask, getFounderTasks, getAssignedTasks, getUnassignedTasks
"""
from fastapi import HTTPException, status
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from db import get_db
from db.models import Task, User
from db.enums import TaskStatus, UserRole

class TaskService:
    @staticmethod
    async def get_tasks(user, status=None, assigned_to=None, category=None, priority=None):
        """
        Get all tasks for workspace.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "data": []}

    @staticmethod
    async def get_my_tasks(user):
        """
        Get tasks assigned to current user.
        """
        async with get_db() as session:
            query = select(Task).where(
                Task.workspace_id == user.workspace_id,
                Task.assigned_to == user.id
            ).order_by(Task.created_at.desc())

            tasks = await session.execute(query)
            return {"success": True, "data": [dict(t._mapping) for t in tasks]}

    @staticmethod
    async def get_founder_tasks(user):
        """
        Get tasks for founder.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "data": []}

    @staticmethod
    async def get_assigned_tasks(user):
        """
        Get assigned tasks.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "data": []}

    @staticmethod
    async def get_unassigned_tasks(user):
        """
        Get unassigned tasks.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "data": []}

    @staticmethod
    async def get_task(id, user):
        """
        Get single task by ID.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "data": {}}

    @staticmethod
    async def create_task(data, user):
        """
        Create a new task.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "message": "Task created (stub)", "data": {}}

    @staticmethod
    async def update_task(id, data, user):
        """
        Update task by ID.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "message": "Task updated (stub)", "data": {}}

    @staticmethod
    async def delete_task(id, user):
        """
        Delete task by ID.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "message": "Task deleted (stub)"}

    @staticmethod
    async def get_team_member_tasks(user):
        """
        Get tasks assigned to team members.
        Uses SQLAlchemy async to query tasks where:
        1. Assigned to users with role 'team_member'
        2. In the same workspace as the requesting user
        """
        async with get_db() as session:
            # Get team members in the workspace
            team_query = select(User).where(
                User.workspace_id == user.workspace_id,
                User.role == UserRole.TEAM_MEMBER
            )
            team = await session.execute(team_query)
            team_member_ids = [member._mapping.id for member in team]

            # Get tasks assigned to team members
            query = select(Task).where(
                Task.workspace_id == user.workspace_id,
                Task.assigned_to.in_(team_member_ids)
            ).order_by(Task.created_at.desc())

            tasks = await session.execute(query)
            return {"success": True, "data": [dict(t._mapping) for t in tasks]}
        from sqlalchemy.ext.asyncio import AsyncSession
        from db.database import async_session_maker
        from db.models import Task, User
        from db.enums import UserRole

        async with async_session_maker() as session:
            # Query for tasks assigned to team members in the same workspace
            query = (
                select(Task)
                .join(User, Task.assigned_to == User.id)
                .where(
                    User.role == UserRole.TEAM_MEMBER,
                    Task.workspace_id == user.workspace_id
                )
            )

            try:
                result = await session.execute(query)
                tasks = result.scalars().all()
                return {
                    "success": True,
                    "data": [
                        {
                            "id": task.id,
                            "title": task.title,
                            "description": task.description,
                            "status": task.status,
                            "priority": task.priority,
                            "category": task.category,
                            "due_date": task.due_date,
                            "completed_at": task.completed_at,
                            "assigned_to": task.assigned_to,
                            "contact_id": task.contact_id,
                            "deal_id": task.deal_id,
                            "created_at": task.created_at,
                            "updated_at": task.updated_at,
                            "last_status_update": task.last_status_update,
                            "beautified_status_message": task.beautified_status_message
                        }
                        for task in tasks
                    ]
                }
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error retrieving team member tasks: {str(e)}"
                )
