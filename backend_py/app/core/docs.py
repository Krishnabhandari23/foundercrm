"""
API documentation and metadata configuration.
"""
from typing import Dict, Any
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

def custom_openapi_schema(app: FastAPI) -> Dict[str, Any]:
    """
    Customize OpenAPI schema for better documentation.
    """
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="FounderCRM API",
        version="1.0.0",
        description="""
        FounderCRM API provides a comprehensive suite of CRM features including:
        
        * Contact Management
        * Deal Pipeline
        * Task Management
        * AI-Powered Insights
        * Email Generation
        * Note Analysis
        
        For detailed documentation on each endpoint, see the specific route sections below.
        """,
        routes=app.routes,
    )

    # Add authentication information
    openapi_schema["components"]["securitySchemes"] = {
        "bearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    
    # Add security requirement to all endpoints
    openapi_schema["security"] = [{"bearerAuth": []}]

    # Add tags metadata
    openapi_schema["tags"] = [
        {
            "name": "auth",
            "description": "Authentication operations including login, refresh, and user management",
        },
        {
            "name": "contacts",
            "description": "Contact management operations",
        },
        {
            "name": "deals",
            "description": "Deal pipeline and management",
        },
        {
            "name": "tasks",
            "description": "Task tracking and management",
        },
        {
            "name": "ai",
            "description": "AI-powered features including note analysis and email generation",
        },
        {
            "name": "dashboard",
            "description": "Dashboard data and analytics",
        },
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

def setup_docs(app: FastAPI) -> None:
    """
    Configure API documentation.
    """
    app.openapi = lambda: custom_openapi_schema(app)