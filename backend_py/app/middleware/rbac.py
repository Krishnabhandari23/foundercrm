"""
Application middleware for RBAC and request handling.
"""
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.utils.jwt import decode_token

class RoleMiddleware(BaseHTTPMiddleware):
    """Middleware to handle role-based access control."""
    
    async def dispatch(self, request: Request, call_next):
        # Skip middleware for authentication endpoints
        if request.url.path in ["/api/auth/login", "/api/auth/signup", "/api/health"]:
            return await call_next(request)
            
        # Get token from header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return await call_next(request)
            
        try:
            token = auth_header.split(" ")[1]
            payload = decode_token(token)
            
            # Add user and role info to request state
            request.state.user_id = payload.get("sub")
            request.state.user_role = payload.get("role")
            request.state.workspace_id = payload.get("workspace_id")
            
            # Continue with the request
            response = await call_next(request)
            
            # Add role info to response headers for debugging
            response.headers["X-User-Role"] = payload.get("role", "unknown")
            return response
            
        except Exception as e:
            # Don't block the request on middleware errors
            return await call_next(request)

class WorkspaceMiddleware(BaseHTTPMiddleware):
    """Middleware to handle workspace-specific requests."""
    
    async def dispatch(self, request: Request, call_next):
        # Skip middleware for non-workspace endpoints
        if not any(p in request.url.path for p in ["/api/workspace/", "/api/team/", "/api/projects/"]):
            return await call_next(request)
            
        workspace_id = request.path_params.get("workspace_id")
        if not workspace_id:
            return await call_next(request)
            
        # Check if user has access to workspace
        if hasattr(request.state, "workspace_id"):
            if request.state.workspace_id != workspace_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Access to this workspace denied"
                )
                
        return await call_next(request)