import PyPDF2
import io
from typing import Optional

# Add import for docx
try:
    import docx
except ImportError:
    docx = None

def extract_text_from_pdf(file_bytes: bytes) -> str:
    pdf = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in pdf.pages:
        text += page.extract_text()
    return text

def extract_text_from_txt(file_bytes: bytes) -> str:
    return file_bytes.decode(errors="ignore")

def extract_text_from_docx(file_bytes: bytes) -> str:
    if docx is None:
        raise ImportError("python-docx is required for .docx support")
    file_stream = io.BytesIO(file_bytes)
    document = docx.Document(file_stream)
    text = "\n".join([para.text for para in document.paragraphs])
    return text

def extract_text_from_file(filename: str, file_bytes: bytes) -> str:
    ext = filename.lower().split('.')[-1]
    if ext == "pdf":
        return extract_text_from_pdf(file_bytes)
    elif ext == "txt":
        return extract_text_from_txt(file_bytes)
    elif ext in ("docx", "doc"):
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
