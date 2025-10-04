"""
Auth endpoints: register, login, getMe, inviteTeamMember, acceptInvitation, registerTeamMember
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from utils.jwt import create_access_token, get_current_user
from services.auth_service import AuthService

router = APIRouter()

# Pydantic models for request bodies
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    workspaceName: str

class LoginRequest(BaseModel):
    email: str
    password: str

class InviteRequest(BaseModel):
    email: str
    name: str

class AcceptInvitationRequest(BaseModel):
    token: str
    password: str

class RegisterTeamMemberRequest(BaseModel):
    name: str
    email: str
    password: str
    workspaceCode: str

# Auth endpoints
@router.post("/register")
async def register(data: RegisterRequest):
    """Register new founder and create workspace."""
    try:
        result = await AuthService.register_founder(data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content=result
        )
    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error
        print(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/register-team-member")
async def register_team_member(data: RegisterTeamMemberRequest):
    """Register new team member."""
    return await AuthService.register_team_member(data)

@router.post("/login")
async def login(data: LoginRequest):
    """Login and return JWT token."""
    return await AuthService.login(data)

@router.post("/accept-invitation")
async def accept_invitation(data: AcceptInvitationRequest):
    """Accept invitation and set password."""
    return await AuthService.accept_invitation(data)

@router.get("/me")
async def get_me(user=Depends(get_current_user)):
    """Get current user info."""
    return {"success": True, "data": user}

@router.post("/invite")
async def invite_team_member(data: InviteRequest, user=Depends(get_current_user)):
    """Invite a new team member."""
    return await AuthService.invite_team_member(data, user)
