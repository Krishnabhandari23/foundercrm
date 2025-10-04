"""
WebSocket event types and serializable message models.
"""
from enum import Enum
from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class WebSocketMessageType(str, Enum):
    CONNECT = "connect"
    DISCONNECT = "disconnect"
    ERROR = "error"
    
    # State updates
    STATE_UPDATE = "state_update"
    STATE_SYNC = "state_sync"
    
    # Dashboard events
    DASHBOARD_STATE = "dashboard_state"
    DASHBOARD_UPDATE = "dashboard_update"
    DASHBOARD_FILTER = "dashboard_filter"
    DASHBOARD_SYNC = "dashboard_sync"
    
    # Resource events
    RESOURCE_CREATED = "resource_created"
    RESOURCE_UPDATED = "resource_updated"
    RESOURCE_DELETED = "resource_deleted"
    
    # User events
    USER_PRESENCE = "user_presence"
    USER_TYPING = "user_typing"
    
    # Notifications
    NOTIFICATION = "notification"

class WebSocketMessage(BaseModel):
    type: WebSocketMessageType
    payload: Dict[str, Any]
    workspace_id: Optional[str] = None
    sender_id: Optional[str] = None
    timestamp: float

class StateUpdateMessage(BaseModel):
    resource_type: str
    resource_id: str
    data: Dict[str, Any]
    action: str
    workspace_id: str

class DashboardStateMessage(BaseModel):
    dashboard_type: str
    user_id: str
    filters: Dict[str, Any]
    data: Dict[str, Any]
    workspace_id: str
    timestamp: float

class DashboardSyncMessage(BaseModel):
    source_user_id: str
    target_user_id: str
    workspace_id: str
    dashboard_type: str
    filters: Dict[str, Any]
    data: Dict[str, Any]
    timestamp: float
    
class UserPresenceMessage(BaseModel):
    user_id: str
    workspace_id: str
    status: str  # "online" | "offline" | "away"
    last_seen: float

class NotificationMessage(BaseModel):
    title: str
    message: str
    type: str  # "info" | "success" | "warning" | "error"
    workspace_id: str
    user_ids: Optional[List[str]] = None  # If None, send to all users in workspace