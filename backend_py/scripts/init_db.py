"""Initialize SQLite database."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
from sqlalchemy import text
from db.database import engine, Base, AsyncSessionLocal
from db.models import User, Workspace, Task
from db.enums import TaskStatus, TaskPriority, UserRole

async def create_tables():
    """Create all database tables."""
    async with engine.begin() as conn:
        # Drop all tables first to start fresh
        await conn.run_sync(Base.metadata.drop_all)
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
        print("Tables created successfully")

    # Create initial workspace and admin user
    async with AsyncSessionLocal() as session:
        workspace = Workspace(name="Test Workspace", code="TST001")
        session.add(workspace)
        await session.commit()

        user = User(
            name="Admin User",
            email="admin@example.com",
            password="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrkjA7F6CZzMAr2",  # Test1234
            role=UserRole.FOUNDER,
            workspace_id=workspace.id
        )
        session.add(user)
        await session.commit()

        # Create some test tasks
        tasks = [
            Task(
                title="High Priority Task",
                description="This is a high priority task",
                status=TaskStatus.TODO,
                priority=TaskPriority.HIGH,
                workspace_id=workspace.id,
                assigned_to=user.id
            ),
            Task(
                title="Medium Priority Task",
                description="This is a medium priority task",
                status=TaskStatus.IN_PROGRESS,
                priority=TaskPriority.MEDIUM,
                workspace_id=workspace.id,
                assigned_to=user.id
            )
        ]
        session.add_all(tasks)
        await session.commit()

        print("Initial data created successfully")

if __name__ == "__main__":
    asyncio.run(create_tables())