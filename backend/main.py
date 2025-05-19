from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import document, chat  # Your routers

app = FastAPI()

# Allow frontend to call backend locally (adjust in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://docubot-nu.vercel.app/","https://docubot-ai.vercel.app/"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your routers
app.include_router(document.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "Smart Doc QnA API is running!"}