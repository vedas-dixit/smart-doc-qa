from fastapi import APIRouter, Request
from pydantic import BaseModel
from utils.context_window import reset_history

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    context: str

@router.get("/resetHistory")
async def reset_history_endpoint():
    reset_history()
    return {"status": "success", "message": "History has been reset"}
