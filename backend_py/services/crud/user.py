"""
User service with specialized user-related database operations.
"""
from typing import Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from fastapi import HTTPException, status

from db.models import User
from .base import CRUDBase

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService(CRUDBase[User]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        """
        Get user by email.
        Args:
            db: AsyncSession
            email: User's email
        Returns:
            Optional[User]: Found user or None
        """
        query = select(User).where(User.email == email)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def create(self, db: AsyncSession, *, obj_in: Dict[str, Any]) -> User:
        """
        Create new user with hashed password.
        Args:
            db: AsyncSession
            obj_in: User data including plain password
        Returns:
            User: Created user
        """
        # Hash password
        if 'password' in obj_in:
            obj_in['password'] = pwd_context.hash(obj_in['password'])

        return await super().create(db, obj_in=obj_in)

    async def update(
        self,
        db: AsyncSession,
        *,
        id: int,
        obj_in: Dict[str, Any]
    ) -> Optional[User]:
        """
        Update user, hashing password if provided.
        Args:
            db: AsyncSession
            id: User ID
            obj_in: Update data
        Returns:
            Optional[User]: Updated user or None
        """
        # Hash password if provided
        if 'password' in obj_in:
            obj_in['password'] = pwd_context.hash(obj_in['password'])

        return await super().update(db, id=id, obj_in=obj_in)

    async def authenticate(
        self,
        db: AsyncSession,
        *,
        email: str,
        password: str
    ) -> Optional[User]:
        """
        Authenticate user by email and password.
        Args:
            db: AsyncSession
            email: User's email
            password: Plain password
        Returns:
            Optional[User]: Authenticated user or None
        """
        user = await self.get_by_email(db, email)
        if not user:
            return None
        if not pwd_context.verify(password, user.password):
            return None
        return user

    async def is_active(self, user: User) -> bool:
        """
        Check if user is active.
        Args:
            user: User object
        Returns:
            bool: True if active, False otherwise
        """
        return user.is_active

    async def is_founder(self, user: User) -> bool:
        """
        Check if user is a founder.
        Args:
            user: User object
        Returns:
            bool: True if founder, False otherwise
        """
        return user.role == "founder"

    async def get_workspace_members(
        self,
        db: AsyncSession,
        workspace_id: int
    ) -> list[User]:
        """
        Get all members of a workspace.
        Args:
            db: AsyncSession
            workspace_id: Workspace ID
        Returns:
            list[User]: List of workspace members
        """
        query = select(User).where(User.workspace_id == workspace_id)
        result = await db.execute(query)
        return result.scalars().all()

user_service = UserService()