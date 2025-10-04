"""
Role-based access control decorators and middleware.
"""
from functools import wraps
from typing import List, Optional, Callable
from fastapi import HTTPException, status, Depends
from app.utils.jwt import get_current_user, User

def require_permission(permission: str):
    """Decorator to require a specific permission to access an endpoint."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated"
                )
            
            # Founders have all permissions
            if current_user.role == "founder":
                return await func(*args, current_user=current_user, **kwargs)
                
            user_permissions = await get_user_permissions(current_user)
            if permission not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Permission denied: {permission} required"
                )
                
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

def require_role(allowed_roles: List[str]):
    """Decorator to require specific roles to access an endpoint."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), **kwargs):
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated"
                )
                
            if current_user.role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Role {current_user.role} not allowed. Required: {', '.join(allowed_roles)}"
                )
                
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

def require_workspace_access(func: Callable):
    """Decorator to ensure user has access to the workspace."""
    @wraps(func)
    async def wrapper(*args, current_user: User = Depends(get_current_user), workspace_id: str, **kwargs):
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated"
            )
            
        if current_user.workspace_id != workspace_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access to this workspace denied"
            )
            
        return await func(*args, current_user=current_user, workspace_id=workspace_id, **kwargs)
    return wrapper

def require_resource_owner(resource_model: str):
    """Decorator to ensure user is the owner of a resource or has admin/founder role."""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, current_user: User = Depends(get_current_user), resource_id: str, **kwargs):
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated"
                )
                
            # Founders and admins can access any resource
            if current_user.role in ["founder", "admin"]:
                return await func(*args, current_user=current_user, resource_id=resource_id, **kwargs)
                
            # Check resource ownership
            is_owner = await check_resource_ownership(resource_model, resource_id, current_user.id)
            if not is_owner:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You don't have permission to access this resource"
                )
                
            return await func(*args, current_user=current_user, resource_id=resource_id, **kwargs)
        return wrapper
    return decorator

async def get_user_permissions(user: User) -> List[str]:
    """Get all permissions for a user based on their role."""
    # You can implement custom permission logic here or load from database
    role_permissions = {
        "founder": ["*"],  # Founder has all permissions
        "admin": [
            "view_dashboard", "manage_team", "view_reports",
            "manage_settings", "view_all_data"
        ],
        "manager": [
            "view_dashboard", "view_team", "manage_deals",
            "manage_contacts", "manage_tasks"
        ],
        "team_member": [
            "view_dashboard", "view_contacts", "view_deals",
            "manage_tasks", "view_team"
        ]
    }
    
    return role_permissions.get(user.role, [])

async def check_resource_ownership(resource_model: str, resource_id: str, user_id: str) -> bool:
    """Check if a user owns a specific resource."""
    # Implement resource ownership check based on your data model
    # Example:
    # resource = await get_resource(resource_model, resource_id)
    # return resource.user_id == user_id
    return True  # Placeholder - implement actual check