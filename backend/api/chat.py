from fastapi import APIRouter, Request
from pydantic import BaseModel
from services.openai_service import ask_llm

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    context: str

@router.post("/ask")
def ask_question(payload: ChatRequest):
    response = ask_llm(payload.question, payload.context)
    return {"answer": response}
