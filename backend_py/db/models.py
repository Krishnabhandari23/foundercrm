"""
SQLAlchemy models for all database tables.
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Float, Table, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
from .enums import TaskStatus, TaskPriority, DealStage, ContactType, NoteType

# Association tables
contact_tags = Table(
    'contact_tags',
    Base.metadata,
    Column('contact_id', Integer, ForeignKey('contacts.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # founder, team_member
    workspace_id = Column(Integer, ForeignKey('workspaces.id'))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    workspace = relationship("Workspace", back_populates="users")
    contacts = relationship("Contact", back_populates="created_by_user")
    tasks = relationship("Task", back_populates="assigned_to_user")

class Workspace(Base):
    __tablename__ = 'workspaces'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    code = Column(String(10), unique=True)
    created_at = Column(DateTime, server_default=func.now())

    users = relationship("User", back_populates="workspace")
    contacts = relationship("Contact", back_populates="workspace")
    tasks = relationship("Task", back_populates="workspace")
    deals = relationship("Deal", back_populates="workspace")

class Contact(Base):
    __tablename__ = 'contacts'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100))
    phone = Column(String(20))
    company = Column(String(100))
    position = Column(String(100))
    type = Column(Enum(ContactType), default=ContactType.LEAD)
    workspace_id = Column(Integer, ForeignKey('workspaces.id'))
    created_by = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    workspace = relationship("Workspace", back_populates="contacts")
    created_by_user = relationship("User", back_populates="contacts")
    tasks = relationship("Task", back_populates="contact")
    deals = relationship("Deal", back_populates="contact")
    interactions = relationship("Interaction", back_populates="contact")
    notes = relationship("Note", back_populates="contact")
    tags = relationship("Tag", secondary=contact_tags)

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.TODO)
    priority = Column(Enum(TaskPriority), default=TaskPriority.MEDIUM)
    category = Column(String(50))
    due_date = Column(DateTime)
    completed_at = Column(DateTime)
    workspace_id = Column(Integer, ForeignKey('workspaces.id'))
    assigned_to = Column(Integer, ForeignKey('users.id'))
    contact_id = Column(Integer, ForeignKey('contacts.id'))
    deal_id = Column(Integer, ForeignKey('deals.id'))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    beautified_status_message = Column(Text)
    last_status_update = Column(DateTime)

    workspace = relationship("Workspace", back_populates="tasks")
    assigned_to_user = relationship("User", back_populates="tasks")
    contact = relationship("Contact", back_populates="tasks")
    deal = relationship("Deal", back_populates="tasks")

class Deal(Base):
    __tablename__ = 'deals'

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    stage = Column(Enum(DealStage), default=DealStage.NEW)
    value = Column(Float)
    currency = Column(String(3), default='USD')
    workspace_id = Column(Integer, ForeignKey('workspaces.id'))
    contact_id = Column(Integer, ForeignKey('contacts.id'))
    assigned_to = Column(Integer, ForeignKey('users.id'))
    created_by = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    closed_at = Column(DateTime)
    probability = Column(Float)  # AI-predicted probability

    workspace = relationship("Workspace", back_populates="deals")
    contact = relationship("Contact", back_populates="deals")
    assigned_to_user = relationship("User", foreign_keys=[assigned_to])
    created_by_user = relationship("User", foreign_keys=[created_by])
    tasks = relationship("Task", back_populates="deal")
    notes = relationship("Note", back_populates="deal")

class Interaction(Base):
    __tablename__ = 'interactions'

    id = Column(Integer, primary_key=True)
    type = Column(String(50))  # email, call, meeting, note
    description = Column(Text)
    contact_id = Column(Integer, ForeignKey('contacts.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    interaction_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    contact = relationship("Contact", back_populates="interactions")
    user = relationship("User")

class Note(Base):
    __tablename__ = 'notes'

    id = Column(Integer, primary_key=True)
    content = Column(Text, nullable=False)
    type = Column(Enum(NoteType), default=NoteType.GENERAL)
    contact_id = Column(Integer, ForeignKey('contacts.id'))
    deal_id = Column(Integer, ForeignKey('deals.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    ai_summary = Column(Text)  # AI-generated summary
    sentiment = Column(String(20))  # AI-detected sentiment

    contact = relationship("Contact", back_populates="notes")
    deal = relationship("Deal", back_populates="notes")
    user = relationship("User")

class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    workspace_id = Column(Integer, ForeignKey('workspaces.id'))
    created_at = Column(DateTime, server_default=func.now())
    ai_generated = Column(Boolean, default=False)

class AISuggestion(Base):
    __tablename__ = 'ai_suggestions'

    id = Column(Integer, primary_key=True)
    type = Column(String(50))  # task, deal, contact
    content = Column(Text, nullable=False)
    workspace_id = Column(Integer, ForeignKey('workspaces.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, server_default=func.now())
    applied_at = Column(DateTime)
    is_applied = Column(Boolean, default=False)

    workspace = relationship("Workspace")
    user = relationship("User")