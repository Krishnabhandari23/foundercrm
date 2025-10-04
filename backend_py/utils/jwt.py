"""
JWT utility functions and FastAPI dependencies for HTTP and WebSocket authentication.
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings
from db.enums import UserRole

security = HTTPBearer()

class User:
    """User class with role information."""
    def __init__(self, id: str, email: str, role: str, workspace_id: str, **kwargs):
        self.id = id
        self.email = email
        self.role = role
        self.workspace_id = workspace_id
        self.__dict__.update(kwargs)

def decode_token(token: str) -> Dict[str, Any]:
    """Decode and validate JWT token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if not payload.get("sub"):  # sub is the user ID
            raise ValueError("Invalid token payload")
        return payload
    except (JWTError, ValueError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )

async def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current authenticated user from HTTP request."""
    payload = decode_token(credentials.credentials)
    return User(**payload)

async def get_token_from_query(query_string: str) -> Optional[str]:
    """Extract token from WebSocket query string."""
    if not query_string:
        return None
    
    # Handle URL-encoded parameters
    from urllib.parse import parse_qs, unquote
    params = parse_qs(query_string)
    
    # Get token and handle potential encoding
    token = params.get('token', [None])[0]
    if token:
        return unquote(token)
    return None

async def get_websocket_user(token: str) -> Optional[User]:
    """Get user from WebSocket token."""
    if not token:
        return None
    try:
        payload = decode_token(token)
        if not payload:
            return None
            
        # Create User object with required fields
        return User(
            id=str(payload["sub"]),  # Ensure sub (user ID) is string
            email=payload.get("email", ""),
            role=payload.get("role", ""),
            workspace_id=payload.get("workspace_id", ""),
        )
    except (HTTPException, Exception) as e:
        print(f"Error getting websocket user: {str(e)}")
        return None

async def create_token(user_data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a new JWT token for a user."""
    if not expires_delta:
        expires_delta = timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    
    expire = datetime.utcnow() + expires_delta
    to_encode = {
        "exp": expire,
        "sub": str(user_data["id"]),  # Ensure id is string
        "email": user_data["email"],
        "role": user_data["role"],
        "workspace_id": user_data.get("workspace_id"),
        "iat": datetime.utcnow()
    }
    
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def validate_token_format(token: str) -> bool:
    """Validate token format without verifying signature."""
    if not token:
        return False
    try:
        parts = token.split('.')
        return len(parts) == 3  # JWT should have 3 parts: header.payload.signature
    except Exception:
        return False

def is_token_expired(token: str) -> bool:
    """Check if token is expired."""
    try:
        payload = decode_token(token)
        exp = payload.get("exp")
        if not exp:
            return True
        return datetime.utcnow() > datetime.fromtimestamp(exp)
    except HTTPException:
        return True
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def create_access_token(data: dict, expires_delta=None):
    """
    Create JWT access token.
    """
    import datetime
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(days=7))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm="HS256")
    return encoded_jwt
