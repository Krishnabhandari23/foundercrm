"""
WebSocket connection and state management utilities.
"""
from typing import Dict, Set, Optional, List
from fastapi import WebSocket
from datetime import datetime
import json
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # workspace_id -> {user_id -> set(WebSocket)}
        self.active_connections: Dict[str, Dict[str, Set[WebSocket]]] = defaultdict(lambda: defaultdict(set))
        # user_id -> last_seen timestamp
        self.user_presence: Dict[str, float] = {}
        
    async def connect(self, websocket: WebSocket, workspace_id: str, user_id: str):
        """Connect a user to a workspace."""
        await websocket.accept()
        self.active_connections[workspace_id][user_id].add(websocket)
        self.user_presence[user_id] = datetime.now().timestamp()
        await self.broadcast_presence(workspace_id, user_id, "online")
        
    async def disconnect(self, websocket: WebSocket, workspace_id: str, user_id: str):
        """Disconnect a user from a workspace."""
        self.active_connections[workspace_id][user_id].remove(websocket)
        if not self.active_connections[workspace_id][user_id]:
            del self.active_connections[workspace_id][user_id]
            if not self.active_connections[workspace_id]:
                del self.active_connections[workspace_id]
        await self.broadcast_presence(workspace_id, user_id, "offline")
        
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific WebSocket connection."""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            
    async def broadcast(self, message: dict, workspace_id: str, exclude_user: Optional[str] = None):
        """Broadcast a message to all users in a workspace."""
        if workspace_id not in self.active_connections:
            return
            
        for user_id, connections in self.active_connections[workspace_id].items():
            if exclude_user and user_id == exclude_user:
                continue
            for websocket in connections:
                try:
                    await websocket.send_json(message)
                except Exception as e:
                    logger.error(f"Error broadcasting to user {user_id}: {e}")
                    
    async def broadcast_to_users(self, message: dict, workspace_id: str, user_ids: List[str]):
        """Broadcast a message to specific users in a workspace."""
        if workspace_id not in self.active_connections:
            return
            
        for user_id in user_ids:
            if user_id in self.active_connections[workspace_id]:
                for websocket in self.active_connections[workspace_id][user_id]:
                    try:
                        await websocket.send_json(message)
                    except Exception as e:
                        logger.error(f"Error broadcasting to user {user_id}: {e}")
                        
    async def broadcast_presence(self, workspace_id: str, user_id: str, status: str):
        """Broadcast a user's presence status to all users in the workspace."""
        message = {
            "type": "user_presence",
            "payload": {
                "user_id": user_id,
                "workspace_id": workspace_id,
                "status": status,
                "last_seen": self.user_presence.get(user_id, datetime.now().timestamp())
            }
        }
        await self.broadcast(message, workspace_id, exclude_user=user_id)
        
    def get_active_users(self, workspace_id: str) -> List[str]:
        """Get a list of active user IDs in a workspace."""
        if workspace_id not in self.active_connections:
            return []
        return list(self.active_connections[workspace_id].keys())

# Global connection manager instance
manager = ConnectionManager()