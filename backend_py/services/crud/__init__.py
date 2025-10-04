from .base import CRUDBase
from .contact import contact_service
from .deal import deal_service
from .note import note_service
from .task import task_service
from .user import user_service

__all__ = [
    "CRUDBase",
    "contact_service",
    "deal_service",
    "note_service",
    "task_service",
    "user_service"
]