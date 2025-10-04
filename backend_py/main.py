"""
FastAPI application entry point with startup/shutdown events, CORS, JWT middleware, and error handlers.
"""
import logging
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

from app.core.config import settings
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# Import internal modules
from db.database import init_db
from db.enums import UserRole
from app.core.errors import add_error_handlers
from app.core.docs import setup_docs
from utils.permissions import RoleMiddleware, WorkspaceMiddleware
from routers import auth, contacts, tasks, deals, dashboard, ai, health, websocket

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handle startup and shutdown events.
    """
    # Startup
    logger.info("Initializing application...")
    await init_db()
    logger.info("Database initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")

# Create FastAPI application
app = FastAPI(
    title="FounderCRM API",
    version="1.0.0",
    description="CRM system with AI-powered features",
    lifespan=lifespan
)

# CORS setup
origins = settings.BACKEND_CORS_ORIGINS
if settings.NODE_ENV == "development":
    # In development, allow all localhost origins
    origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://localhost:5179",
        "http://localhost:8000",
        "ws://localhost:8000",
        "ws://localhost:5173",
        "ws://localhost:5174",
        "ws://localhost:5175",
        "ws://localhost:5176",
        "ws://localhost:5177",
        "ws://localhost:5178",
        "ws://localhost:5179"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Sec-WebSocket-Protocol",
        "Sec-WebSocket-Extensions",
        "Sec-WebSocket-Key",
        "Sec-WebSocket-Version"
    ],
    expose_headers=["*"],
    max_age=3600
)

# Security middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])  # Configure in production
app.add_middleware(RoleMiddleware)
app.add_middleware(WorkspaceMiddleware)

# Configure error handlers
add_error_handlers(app)

# Configure API documentation
setup_docs(app)

# Initialize metrics
from app.core.metrics import init_metrics
init_metrics(app)

# Mount routers
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["auth"],
)
app.include_router(
    websocket.router,
    tags=["websocket"],  # WebSocket endpoints should not have a prefix
)
app.include_router(
    contacts.router,
    prefix="/api/contacts",
    tags=["contacts"],
)
app.include_router(
    tasks.router,
    prefix="/api/tasks",
    tags=["tasks"],
)
app.include_router(
    deals.router,
    prefix="/api/deals",
    tags=["deals"],
)
app.include_router(
    dashboard.router,
    prefix="/api/dashboard",
    tags=["dashboard"],
)
app.include_router(
    ai.router,
    prefix="/api/ai",
    tags=["ai"],
)
app.include_router(
    health.router,
    prefix="/api",
    tags=["health"],
)

# Health check endpoints
@app.get("/health", tags=["health"])
async def health():
    """
    Basic health check endpoint.
    """
    return {
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": str(__import__('datetime').datetime.utcnow()),
        "environment": settings.NODE_ENV
    }

@app.get("/api/health", tags=["health"])
async def api_health():
    """
    Detailed API health check endpoint.
    """
    return {
        "status": "healthy",
        "database": "connected",  # We'd get here only if DB is working
        "ai_features": "enabled" if settings.ENABLE_AI_FEATURES else "disabled",
        "version": "1.0.0",
        "timestamp": str(__import__('datetime').datetime.utcnow()),
        "environment": settings.NODE_ENV
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.NODE_ENV == "development"
    )

# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "message": str(exc)}
    )

# Startup/shutdown events
@app.on_event("startup")
async def startup_event():
    print("Starting Founder CRM API...")
    # TODO: Initialize DB, websocket, etc.

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down Founder CRM API...")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
