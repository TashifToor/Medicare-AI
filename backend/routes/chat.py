from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime
from models.database import get_db
from models.chat import ChatHistory
from middleware.auth import get_current_user
from models.user import User
from schemas.chat import ChatRequest, ChatResponse, ChatHistoryResponse
from typing import List

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat(
    body: ChatRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):  # ← colon add kiya
    """Query karo RAG pipeline se"""

    # pipeline lo app state se
    retriever = request.app.state.retriever  # ← seedha retriever lo
    rag = request.app.state.rag

    

    # answer lo rag se
    answer = rag.ask(body.query, retriever, top_l=body.top_k)

    # chat history me save karo
    chat_history = ChatHistory(
        user_id=current_user.id,
        query=body.query,
        answer=answer,
        created_at=datetime.utcnow()
    )
    db.add(chat_history)
    db.commit()
    db.refresh(chat_history)

    return ChatResponse(
        query=body.query,
        answer=answer,
        created_at=chat_history.created_at
    )

@router.get("/history", response_model=List[ChatHistoryResponse])
async def chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 20
):
    """apni chat history dekhne ke liye endpoint"""
    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())  # ← order_by fix kiya
        .limit(limit)
        .all()
    )
    return chats

@router.delete("/history", status_code=status.HTTP_204_NO_CONTENT)  # ← status_code fix kiya
async def delete_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).delete()
    db.commit()