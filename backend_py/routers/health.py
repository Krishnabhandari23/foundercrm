"""Health check endpoints for monitoring system status."""
from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text

from db.database import get_db

router = APIRouter()

@router.get("/health")
async def health_check() -> Dict[str, str]:
    """Basic health check endpoint."""
    return {"status": "healthy"}

@router.get("/health/db")
async def database_health(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """Check database connectivity and basic status."""
    try:
        # Try a simple query
        result = await db.execute(text("SELECT 1"))
        await result.scalar()
        
        # Get database metrics
        stats = await db.execute(
            text("""
                SELECT 
                    numbackends as active_connections,
                    xact_commit as transactions_committed,
                    xact_rollback as transactions_rolledback,
                    blks_read as blocks_read,
                    blks_hit as blocks_hit,
                    tup_returned as rows_returned,
                    tup_fetched as rows_fetched,
                    tup_inserted as rows_inserted,
                    tup_updated as rows_updated,
                    tup_deleted as rows_deleted
                FROM pg_stat_database 
                WHERE datname = current_database()
            """)
        )
        metrics = dict(await stats.fetchone())
        
        # Calculate cache hit ratio
        total_reads = metrics["blocks_read"] + metrics["blocks_hit"]
        cache_hit_ratio = metrics["blocks_hit"] / total_reads if total_reads > 0 else 0
        
        return {
            "status": "healthy",
            "metrics": {
                **metrics,
                "cache_hit_ratio": round(cache_hit_ratio * 100, 2)
            }
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }