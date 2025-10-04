"""
Permission management utilities and middleware for role-based access control.
"""
from functools import wraps
from typing import List, Optional, Set, Union
from fastapi import Depends, HTTPException, status, Request
from db.enums import UserRole, Permission
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
from utils.jwt import get_current_user

# Role permission mapping
ROLE_PERMISSIONS = {
    UserRole.FOUNDER: {Permission.ADMIN},
    UserRole.ADMIN: {Permission.ADMIN},
    UserRole.MANAGER: {Permission.WRITE},
    UserRole.TEAM_MEMBER: {Permission.READ, Permission.WRITE}
}

class RoleMiddleware(BaseHTTPMiddleware):
    """
    Middleware to enforce role-based access control.
    """
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        return await call_next(request)

class WorkspaceMiddleware(BaseHTTPMiddleware):
    """
    Middleware to enforce workspace-based access control.
    """
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        return await call_next(request)

def get_user_permissions(user_role: UserRole) -> Set[Permission]:
    """Get all permissions for a given user role."""
    return ROLE_PERMISSIONS.get(user_role, set())

def has_permission(user_role: UserRole, required_permission: Permission) -> bool:
    """Check if a role has a specific permission."""
    user_permissions = get_user_permissions(user_role)
    return required_permission in user_permissions

def requires_permissions(required_permissions: Union[Permission, List[Permission]]):
    """
    Decorator to protect routes with permission requirements.
    Usage:
        @router.get("/contacts")
        @requires_permissions(Permission.READ_CONTACTS)
        async def get_contacts():
            ...
    """
    if isinstance(required_permissions, Permission):
        required_permissions = [required_permissions]

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, user=Depends(get_current_user), **kwargs):
            user_permissions = get_user_permissions(user.role)
            
            # Check if user has all required permissions
            for permission in required_permissions:
                if permission not in user_permissions:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Permission denied: {permission.value} required"
                    )
            
            # Add user_id to kwargs for own-resource checks
            kwargs['user_id'] = user.id
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def check_resource_ownership(user_id: str, resource_user_id: str, user_role: UserRole, 
                           own_permission: Permission, all_permission: Permission) -> bool:
    """
    Check if a user has permission to access/modify a resource based on ownership.
    
    Args:
        user_id: ID of the requesting user
        resource_user_id: ID of the user who owns the resource
        user_role: Role of the requesting user
        own_permission: Permission required for own resources
        all_permission: Permission required for all resources
    
    Returns:
        bool: True if user has permission, False otherwise
    """
    user_permissions = get_user_permissions(user_role)
    
    # Users with all_permission can access any resource
    if all_permission in user_permissions:
        return True
        
    # Users with own_permission can only access their own resources
    if own_permission in user_permissions:
        return user_id == resource_user_id
        
    return False