from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    username: str
    email: str

class Message(BaseModel):
    sender: str  
    content: str
    timestamp: datetime

class Conversation(BaseModel):
    user_id: str
    messages: List[Message] = []
