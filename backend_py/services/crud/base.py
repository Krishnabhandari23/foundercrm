"""
Base CRUD service class for database operations.
"""
from typing import TypeVar, Generic, Type, Optional, List, Dict, Any
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from db.database import Base

ModelType = TypeVar("ModelType", bound=Base)

class CRUDBase(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        """
        Initialize service with SQLAlchemy model.
        Args:
            model: The SQLAlchemy model class
        """
        self.model = model

    async def get(self, db: AsyncSession, id: int) -> Optional[ModelType]:
        """
        Get a single record by ID.
        Args:
            db: AsyncSession
            id: Record ID
        Returns:
            Optional[ModelType]: Found record or None
        """
        query = select(self.model).where(self.model.id == id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        filters: Dict[str, Any] = None
    ) -> List[ModelType]:
        """
        Get multiple records with optional filtering.
        Args:
            db: AsyncSession
            skip: Number of records to skip
            limit: Maximum number of records to return
            filters: Optional dictionary of filter conditions
        Returns:
            List[ModelType]: List of found records
        """
        query = select(self.model)
        
        if filters:
            for field, value in filters.items():
                if hasattr(self.model, field):
                    query = query.where(getattr(self.model, field) == value)
        
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def create(self, db: AsyncSession, *, obj_in: Dict[str, Any]) -> ModelType:
        """
        Create a new record.
        Args:
            db: AsyncSession
            obj_in: Dictionary of fields and values
        Returns:
            ModelType: Created record
        """
        try:
            db_obj = self.model(**obj_in)
            db.add(db_obj)
            await db.commit()
            await db.refresh(db_obj)
            return db_obj
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    async def update(
        self,
        db: AsyncSession,
        *,
        id: int,
        obj_in: Dict[str, Any]
    ) -> Optional[ModelType]:
        """
        Update a record by ID.
        Args:
            db: AsyncSession
            id: Record ID
            obj_in: Dictionary of fields and values to update
        Returns:
            Optional[ModelType]: Updated record or None
        """
        try:
            query = update(self.model).where(self.model.id == id).values(**obj_in)
            await db.execute(query)
            await db.commit()
            
            # Fetch updated record
            return await self.get(db, id)
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    async def delete(self, db: AsyncSession, *, id: int) -> bool:
        """
        Delete a record by ID.
        Args:
            db: AsyncSession
            id: Record ID
        Returns:
            bool: True if deleted, False if not found
        """
        try:
            query = delete(self.model).where(self.model.id == id)
            result = await db.execute(query)
            await db.commit()
            return result.rowcount > 0
        except Exception as e:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )