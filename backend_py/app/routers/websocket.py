"""
WebSocket endpoints and event handlers.
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, Query
from app.utils.websocket import manager
from app.utils.jwt import get_websocket_user, User
from app.schemas.websocket import WebSocketMessage, WebSocketMessageType
import json
import logging
from datetime import datetime

router = APIRouter()
logger = logging.getLogger(__name__)

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...),
):
    """WebSocket connection endpoint with JWT authentication."""
    # Authenticate user
    user = await get_websocket_user(f"token={token}")
    if not user:
        await websocket.close(code=4001, reason="Authentication failed")
        return
        
    try:
        # Connect to workspace
        await manager.connect(websocket, user.workspace_id, user.id)
        
        # Send initial state data
        await manager.send_personal_message({
            "type": WebSocketMessageType.CONNECT,
            "payload": {
                "user_id": user.id,
                "workspace_id": user.workspace_id,
                "timestamp": datetime.now().timestamp()
            }
        }, websocket)
        
        # Listen for messages
        try:
            while True:
                # Receive and parse message
                data = await websocket.receive_text()
                message = WebSocketMessage.parse_raw(data)
                
                # Handle different message types
                if message.type == WebSocketMessageType.STATE_UPDATE:
                    # Broadcast state updates to workspace
                    await manager.broadcast({
                        "type": message.type,
                        "payload": message.payload,
                        "sender_id": user.id,
                        "workspace_id": user.workspace_id,
                        "timestamp": datetime.now().timestamp()
                    }, user.workspace_id)
                    
                elif message.type == WebSocketMessageType.USER_TYPING:
                    # Broadcast typing status
                    await manager.broadcast({
                        "type": message.type,
                        "payload": {
                            "user_id": user.id,
                            **message.payload
                        },
                        "workspace_id": user.workspace_id,
                        "timestamp": datetime.now().timestamp()
                    }, user.workspace_id, exclude_user=user.id)
                    
        except WebSocketDisconnect:
            # Handle disconnection
            await manager.disconnect(websocket, user.workspace_id, user.id)
            
        except Exception as e:
            logger.error(f"WebSocket error for user {user.id}: {str(e)}")
            await manager.send_personal_message({
                "type": WebSocketMessageType.ERROR,
                "payload": {"message": "Internal server error"},
                "timestamp": datetime.now().timestamp()
            }, websocket)
            
    except Exception as e:
        logger.error(f"Connection error for user {user.id}: {str(e)}")
        await websocket.close(code=4000, reason="Connection failed")
        
    finally:
        # Ensure cleanup on any error
        try:
            await manager.disconnect(websocket, user.workspace_id, user.id)
        except:
            pass