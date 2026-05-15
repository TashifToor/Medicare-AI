from pydantic import BaseModel
from typing import Optional

from datetime import datetime

class ChatRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3
    
class ChatResponse(BaseModel):
    answer:str
    query:str
    created_at: datetime  
    model_config = {"arbitrary_types_allowed": True}  # ← yeh add karo


class ChatHistoryResponse(BaseModel):
    id: int
    query: str
    answer: str
    created_at: datetime
    # class Config:
    #     from_attributes = True
    model_config = {"arbitrary_types_allowed": True}  # ← yeh add karo


    

