from fastapi import APIRouter, UploadFile, File
from services.pdf_parser import extract_text_from_file

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    extracted_text = extract_text_from_file(file.filename, content)
    return {"text": extracted_text}
