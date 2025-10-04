"""
Enum definitions for database models.
"""
from enum import Enum, auto

class Permission(str, Enum):
    """Permission levels for actions."""
    READ = "read"
    WRITE = "write"
    ADMIN = "admin"

def get_role_permissions():
    """Get role permissions mapping."""
    return {
        UserRole.FOUNDER: {Permission.ADMIN},
        UserRole.ADMIN: {Permission.ADMIN},
        UserRole.MANAGER: {Permission.WRITE},
        UserRole.TEAM_MEMBER: {Permission.READ, Permission.WRITE}
    }

class UserRole(str, Enum):
    """User role enum."""
    FOUNDER = "founder"
    ADMIN = "admin"
    MANAGER = "manager"
    TEAM_MEMBER = "team_member"

class TaskStatus(str, Enum):
    """Task status enum."""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class TaskPriority(str, Enum):
    """Task priority enum."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class DealStage(str, Enum):
    """Deal stage enum."""
    NEW = "new"
    QUALIFIED = "qualified"
    MEETING = "meeting"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class ContactType(str, Enum):
    """Contact type enum."""
    LEAD = "lead"
    CUSTOMER = "customer"
    PARTNER = "partner"

class NoteType(str, Enum):
    """Note type enum."""
    GENERAL = "general"
    MEETING = "meeting"
    CALL = "call"
    EMAIL = "email"
    OTHER = "other"