"""
Task endpoints: getTasks, getMyTasks, getTask, createTask, updateTask, deleteTask, getFounderTasks, getAssignedTasks, getUnassignedTasks, getBeautifiedMessages
"""
from fastapi import APIRouter, Depends
from utils.jwt import get_current_user
from services.task_service import TaskService
from services.ai_service import AIService

router = APIRouter()

@router.get("/")
async def get_tasks(user=Depends(get_current_user), status: str = None, assigned_to: int = None, category: str = None, priority: str = None):
    """Get all tasks for workspace."""
    return await TaskService.get_tasks(user, status, assigned_to, category, priority)

@router.get("/my-tasks")
async def get_my_tasks(user=Depends(get_current_user)):
    """Get tasks assigned to current user."""
    return await TaskService.get_my_tasks(user)

@router.get("/founder-tasks")
async def get_founder_tasks(user=Depends(get_current_user)):
    """Get tasks for founder."""
    return await TaskService.get_founder_tasks(user)

@router.get("/assigned-tasks")
async def get_assigned_tasks(user=Depends(get_current_user)):
    """Get assigned tasks."""
    return await TaskService.get_assigned_tasks(user)

@router.get("/unassigned-tasks")
async def get_unassigned_tasks(user=Depends(get_current_user)):
    """Get unassigned tasks."""
    return await TaskService.get_unassigned_tasks(user)

@router.get("/team-member-tasks")
async def get_team_member_tasks(user=Depends(get_current_user)):
    """Get tasks assigned to team members."""
    return await TaskService.get_team_member_tasks(user)

@router.get("/beautified-status-messages")
async def get_beautified_messages(user=Depends(get_current_user)):
    """Get beautified status messages (AI)."""
    return await AIService.get_beautified_messages(user)

@router.get("/{id}")
async def get_task(id: int, user=Depends(get_current_user)):
    """Get single task by ID."""
    return await TaskService.get_task(id, user)

@router.post("/")
async def create_task(data: dict, user=Depends(get_current_user)):
    """Create a new task."""
    return await TaskService.create_task(data, user)

@router.put("/{id}")
async def update_task(id: int, data: dict, user=Depends(get_current_user)):
    """Update task by ID."""
    return await TaskService.update_task(id, data, user)

@router.delete("/{id}")
async def delete_task(id: int, user=Depends(get_current_user)):
    """Delete task by ID."""
    return await TaskService.delete_task(id, user)
