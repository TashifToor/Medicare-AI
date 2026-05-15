from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from models.database import Base

class ChatHistory(Base):
    __tablename__="chat_history"
    id= Column(Integer, primary_key=True, index=True)
    user_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    query=Column(Text, nullable=False)
    answer=Column(Text, nullable=False)
    created_at=Column(DateTime, default=datetime.utcnow)
    
    user=relationship("User",back_populates="chats")
    
    

