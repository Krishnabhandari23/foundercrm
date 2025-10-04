"""
WebSocket manager for real-time communication.
"""
from typing import Dict, Set
from fastapi import WebSocket
from db.enums import UserRole

class ConnectionManager:
    def __init__(self):
        # All active connections: {workspace_id: {user_id: websocket}}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        # User roles for permission checks: {user_id: role}
        self.user_roles: Dict[str, UserRole] = {}
        
    async def connect(self, websocket: WebSocket, workspace_id: str, user_id: str, role: str):
        """
        Connect a new client and store their workspace, user info and role.
        """
        print(f"Starting WebSocket connection for user {user_id} with role {role} in workspace {workspace_id}")
        try:
            # Accept the WebSocket connection first
            await websocket.accept()
            print(f"WebSocket connection accepted for user {user_id}")
            
            # Clean up any existing connection for this user
            self.disconnect(workspace_id, user_id)
            print(f"Cleaned up any existing connections for user {user_id}")
            
            # Initialize workspace dict if needed
            if workspace_id not in self.active_connections:
                print(f"Creating new workspace connections dict for workspace {workspace_id}")
                self.active_connections[workspace_id] = {}
            
            # Store the new connection and role
            self.active_connections[workspace_id][user_id] = websocket
            self.user_roles[user_id] = role.lower() if isinstance(role, str) else str(role).lower()
            print(f"Stored connection for user {user_id} with role {self.user_roles[user_id]}")
            
            # Send initial connection confirmation
            await websocket.send_json({
                "type": "connection_established",
                "payload": {
                    "user_id": user_id,
                    "workspace_id": workspace_id,
                    "role": self.user_roles[user_id]
                }
            })
            print(f"Sent connection confirmation to user {user_id}")
            
        except Exception as e:
            print(f"Error in WebSocket connection for user {user_id}: {str(e)}")
            try:
                await websocket.close(code=1011, reason=str(e))
            except:
                pass
            raise
        except Exception as e:
            print(f"WebSocket connection error: {str(e)}")
            if websocket.client_state.CONNECTED:
                await websocket.close(code=1011, reason="Internal server error")
        
    def disconnect(self, workspace_id: str, user_id: str):
        """
        Remove a client connection.
        """
        print(f"Disconnecting user {user_id} from workspace {workspace_id}")
        try:
            if workspace_id in self.active_connections:
                # Remove user from workspace
                if user_id in self.active_connections[workspace_id]:
                    self.active_connections[workspace_id].pop(user_id)
                    print(f"Removed user {user_id} from workspace {workspace_id}")
                else:
                    print(f"User {user_id} not found in workspace {workspace_id}")
                
                # Clean up empty workspace
                if not self.active_connections[workspace_id]:
                    self.active_connections.pop(workspace_id)
                    print(f"Removed empty workspace {workspace_id}")
            else:
                print(f"Workspace {workspace_id} not found")
            
            # Remove user role
            if user_id in self.user_roles:
                self.user_roles.pop(user_id)
                print(f"Removed role for user {user_id}")
            else:
                print(f"No role found for user {user_id}")
                
        except Exception as e:
            print(f"Error disconnecting user {user_id}: {str(e)}")
        
    async def broadcast_to_workspace(self, workspace_id: str, message: dict):
        """
        Send a message to all connections in a workspace.
        """
        print(f"Broadcasting message to workspace {workspace_id}")
        try:
            if workspace_id not in self.active_connections:
                print(f"No connections found for workspace {workspace_id}")
                return
                
            # Track failed connections for cleanup
            failed_connections = []
            
            # Send to all users in workspace
            for user_id, websocket in self.active_connections[workspace_id].items():
                try:
                    print(f"Sending message to user {user_id}")
                    await websocket.send_json(message)
                    print(f"Successfully sent message to user {user_id}")
                except Exception as e:
                    print(f"Failed to send message to user {user_id}: {str(e)}")
                    failed_connections.append((workspace_id, user_id))
            
            # Clean up failed connections
            for workspace_id, user_id in failed_connections:
                print(f"Cleaning up failed connection for user {user_id}")
                self.disconnect(workspace_id, user_id)
                
            print(f"Completed broadcasting to workspace {workspace_id}")
            
        except Exception as e:
            print(f"Error in broadcast_to_workspace: {str(e)}")
                
    async def send_to_user(self, workspace_id: str, user_id: str, message: dict):
        """
        Send a message to a specific user.
        """
        print(f"Attempting to send message to user {user_id} in workspace {workspace_id}")
        try:
            if workspace_id not in self.active_connections:
                print(f"Workspace {workspace_id} not found")
                return False
                
            if user_id not in self.active_connections[workspace_id]:
                print(f"User {user_id} not found in workspace {workspace_id}")
                return False
                
            websocket = self.active_connections[workspace_id][user_id]
            try:
                await websocket.send_json(message)
                print(f"Successfully sent message to user {user_id}")
                return True
            except Exception as e:
                print(f"Failed to send message to user {user_id}: {str(e)}")
                # Connection seems broken, clean it up
                self.disconnect(workspace_id, user_id)
                return False
                
        except Exception as e:
            print(f"Error in send_to_user: {str(e)}")
            return False
            
    async def broadcast_to_role(self, workspace_id: str, role: UserRole, message: dict):
        """
        Send a message to all users with a specific role in a workspace.
        """
        print(f"Broadcasting to role {role} in workspace {workspace_id}")
        try:
            if workspace_id not in self.active_connections:
                print(f"No connections found for workspace {workspace_id}")
                return
                
            # Track failed connections for cleanup
            failed_connections = []
            
            # Iterate through users and broadcast
            for user_id, websocket in self.active_connections[workspace_id].items():
                if self.user_roles.get(user_id) == role:
                    try:
                        print(f"Sending message to user {user_id}")
                        await websocket.send_json(message)
                        print(f"Successfully sent message to user {user_id}")
                    except Exception as e:
                        print(f"Failed to send message to user {user_id}: {str(e)}")
                        failed_connections.append((workspace_id, user_id))
            
            # Clean up failed connections
            for workspace_id, user_id in failed_connections:
                print(f"Cleaning up failed connection for user {user_id}")
                self.disconnect(workspace_id, user_id)
                
        except Exception as e:
            print(f"Error in broadcast_to_role: {str(e)}")

# Global connection manager instance
manager = ConnectionManager()