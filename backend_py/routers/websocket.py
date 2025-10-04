"""
WebSocket routes for real-time updates.
"""
import json
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from utils.websocket import manager
from app.utils.jwt import get_websocket_user as get_current_user_ws, get_token_from_query
from typing import Optional

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: Optional[str] = None
):
    """
    WebSocket endpoint for real-time updates.
    Requires authentication via token query parameter.
    """
    user = None
    try:
        # Get token from query parameters if not passed directly
        if not token and websocket.scope.get("query_string"):
            from urllib.parse import parse_qs, unquote
            qs = websocket.scope["query_string"].decode()
            print(f"WebSocket query string: {qs}")
            params = parse_qs(qs)
            token = params.get('token', [None])[0]
            if token:
                token = unquote(token)
        
        # Authenticate user
        print(f"WebSocket token: {token}")
        if not token:
            print("No token provided")
            await websocket.close(code=4001, reason="No token provided")
            return
            
        user = await get_current_user_ws(token)
        print(f"WebSocket user: {user}")
        if not user:
            print("Invalid token")
            await websocket.close(code=4001, reason="Invalid token")
            return
        
        if not user.workspace_id:
            await websocket.close(code=4002, reason="No workspace associated with user")
            return

        try:
            print(f"Attempting WebSocket connection for user {user.id} in workspace {user.workspace_id}")
            # Connect to WebSocket manager
            await manager.connect(
                websocket=websocket,
                workspace_id=str(user.workspace_id),
                user_id=str(user.id),
                role=user.role
            )
        except Exception as e:
            print(f"Error connecting to WebSocket: {str(e)}")
            await websocket.close(code=1011, reason=str(e))
            return
        
        # Keep connection alive and handle messages
        while True:
            try:
                # Wait for message from client
                data = await websocket.receive_json()
                
                # Process message based on type
                message_type = data.get('type')
                if message_type == 'ping':
                    await websocket.send_json({
                        'type': 'pong',
                        'timestamp': datetime.utcnow().isoformat()
                    })
                elif message_type == 'error':
                    print(f"Client error: {data.get('payload', {}).get('message', 'Unknown error')}")
                
            except json.JSONDecodeError:
                # Invalid JSON received
                await websocket.send_json({
                    'type': 'error',
                    'payload': {'message': 'Invalid JSON message received'}
                })
                
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for user {user.id if user else 'unknown'}")
        if user:
            manager.disconnect(str(user.workspace_id), str(user.id))
            
    except Exception as e:
        print(f"WebSocket error: {str(e)}")
        if user:
            manager.disconnect(str(user.workspace_id), str(user.id))
        try:
            await websocket.send_json({
                'type': 'error',
                'payload': {'message': 'Internal server error'}
            })
        except:
            pass
        finally:
            if websocket.client_state.CONNECTED:
                await websocket.close(code=1011)