from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Any
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "Member" # Admin or Member

class UserInDB(BaseModel):
    id: Optional[Any] = Field(alias="_id")
    name: str
    email: EmailStr
    role: str
    is_active: bool = False

class Token(BaseModel):
    access_token: str
    token_type: str

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProjectBase(BaseModel):
    name: str
    description: str

class ProjectCreate(ProjectBase):
    members: List[str] = []

class ProjectInDB(ProjectBase):
    id: Optional[Any] = Field(alias="_id")
    created_by: str
    created_at: datetime
    members: List[str] = []

class TaskBase(BaseModel):
    title: str
    description: str
    status: str = "To Do"
    deadline: datetime

class TaskCreate(TaskBase):
    project_id: str
    assigned_to: Optional[str] = None

class TaskInDB(TaskBase):
    id: Optional[Any] = Field(alias="_id")
    project_id: str
    assigned_to: Optional[str]
    created_by: str
    created_at: datetime

class DashboardStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
