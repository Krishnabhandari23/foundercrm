"""
Dashboard endpoints: getFounderDashboard, getTeamMemberDashboard, getActivityLogs
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from utils.jwt import get_current_user
from db.database import get_db
from services.dashboard_service import DashboardService

router = APIRouter()

@router.get("/founder")
async def get_founder_dashboard(user=Depends(get_current_user)):
    """Get dashboard data for founder."""
    return await DashboardService.get_founder_dashboard(user)

@router.get("/team-member")
async def get_team_member_dashboard(user=Depends(get_current_user)):
    """Get dashboard data for team member."""
    return await DashboardService.get_team_member_dashboard(user)

@router.get("/activity")
async def get_activity_logs(user=Depends(get_current_user)):
    """Get activity logs."""
    return await DashboardService.get_activity_logs(user)

@router.get("/founder/tasks", response_model=dict)
async def get_founder_tasks(
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get tasks for founder dashboard."""
    try:
        dashboard_service = DashboardService()
        return await dashboard_service.get_founder_tasks(user, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error retrieving tasks: {str(e)}"
        )

@router.get("/team-member/tasks", response_model=dict)
async def get_team_member_tasks(
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get tasks for team member dashboard."""
    try:
        dashboard_service = DashboardService()
        return await dashboard_service.get_team_member_tasks(user, db)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error retrieving tasks: {str(e)}"
        )
