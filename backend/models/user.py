from sqlalchemy import Integer, String, Column,Boolean,DateTime
from models.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__="users"
    id=            Column(Integer,primary_key=True,index=True)
    name=          Column(String,nullable=False)
    email=         Column(String,unique=True,index=True)
    password_hash= Column(String,nullable=False,unique=True)
    is_active=     Column(Boolean,default=True)
    created_at    = Column(DateTime, default=datetime.utcnow)  # DateTime capital D
    
        # Relationship — user ke saare chats

    chats=relationship("ChatHistory",back_populates="user")
    
    
    
