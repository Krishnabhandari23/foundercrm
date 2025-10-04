"""Script to create an initial admin user in the database."""
import asyncio
import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_async_session
from db.models import User, UserRole

async def create_admin_user():
    """Create an admin user if one doesn't exist."""
    session: AsyncSession = await anext(get_async_session())
    
    # Check if admin user exists
    admin = await session.query(User).filter(User.email == "admin@foundercrm.com").first()
    if admin:
        print("Admin user already exists")
        return
    
    # Generate password hash
    password = "admin123"  # Change this in production!
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    
    # Create admin user
    admin = User(
        email="admin@foundercrm.com",
        hashed_password=hashed.decode(),
        first_name="Admin",
        last_name="User",
        role=UserRole.ADMIN,
        is_active=True
    )
    
    session.add(admin)
    await session.commit()
    print("Admin user created successfully")

if __name__ == "__main__":
    asyncio.run(create_admin_user())