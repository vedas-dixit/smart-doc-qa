from fastapi import APIRouter, Request
from pydantic import BaseModel
from services.openai_service import ask_llm
from utils.context_window import add_to_history,get_context

router = APIRouter()

class ChatRequest(BaseModel):
    question: str
    context: str

@router.post("/ask")
def ask_question(payload: ChatRequest):
    # Build full context: past chat history + uploaded doc content
    context = get_context()
    full_context = f"{payload.context}\n\n{context}".strip()

    # Call the LLM
    response = ask_llm(payload.question, full_context)

    # Save to history
    add_to_history(payload.question, response)

    return {"answer": response}

