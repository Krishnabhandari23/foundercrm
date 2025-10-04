"""
AuthService: Implements register, login, getMe, inviteTeamMember, acceptInvitation, registerTeamMember
"""
from config import settings
from utils.jwt import create_access_token
from fastapi import HTTPException, status
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    @staticmethod
    async def register_founder(data):
        """
        Register new founder and create workspace.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        # Validate input
        # Hash password
        # Create user and workspace in DB
        # Return JWT token and user info
        return {"success": True, "message": "Founder registered (stub)", "data": {}}

    @staticmethod
    async def register_team_member(data):
        """
        Register new team member.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "message": "Team member registered (stub)", "data": {}}

    # Mock users for development
    MOCK_USERS = {
        "founder@example.com": {
            "id": "1",
            "email": "founder@example.com",
            "password": "founder123",  # In real app, this would be hashed
            "name": "John Founder",
            "role": "founder",
            "workspace": {
                "id": "1",
                "name": "Founder's Workspace"
            }
        },
        "team@example.com": {
            "id": "2",
            "email": "team@example.com",
            "password": "team123",  # In real app, this would be hashed
            "name": "Sarah Team",
            "role": "team_member",
            "workspace": {
                "id": "1",
                "name": "Founder's Workspace"
            }
        }
    }

    @staticmethod
    async def login(data):
        """
        Login and return JWT token.
        Using mock data for development.
        """
        email = data.email.lower()
        password = data.password

        # Check if user exists in mock data
        user = AuthService.MOCK_USERS.get(email)
        if not user or user["password"] != password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Create access token
        token_data = {
            "sub": str(user["id"]),  # Ensure id is string
            "id": str(user["id"]),   # Ensure id is string
            "email": user["email"],
            "role": user["role"],
            "workspace_id": str(user["workspace"]["id"])  # Ensure workspace_id is string
        }
        token = create_access_token(token_data)

        return {
            "success": True,
            "data": {
                "access_token": token,
                "token_type": "bearer",
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "name": user["name"],
                    "role": user["role"],
                    "workspace": user["workspace"]
                }
            }
        }

    @staticmethod
    async def accept_invitation(data):
        """
        Accept invitation and set password.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "message": "Invitation accepted (stub)", "data": {}}

    @staticmethod
    async def invite_team_member(data, user):
        """
        Invite a new team member.
        TODO: Implement DB logic using SQLAlchemy async.
        """
        return {"success": True, "message": "Team member invited (stub)", "data": {}}
