# DocuBot AI

## 🤖 Document Q&A Assistant

A smart web application that allows users to upload documents and ask questions about their content. DocuBot AI leverages Large Language Models to provide contextually relevant answers based on the uploaded documents.

**Live Demo:**
[https://docubot-ai.vercel.app/](https://docubot-ai.vercel.app/)

## 📋 Features

- **Document Upload**: Support for PDF and TXT files
- **Intelligent Q&A**: Ask questions about your document's content
- **Chat Interface**: Maintain conversation context for follow-up questions
- **Real-time Responses**: Fast processing using Azure OpenAI GPT-4o


## 🏗️ Architecture

```text
Frontend (React + TypeScript)
|
|---> [1] Upload Document (PDF / TXT)
|           |
|           V
|     POST /upload
|
|---> [2] Ask Question (via input)
|
V
POST /ask
|
V
------------------------
|                      |
|      Backend         |
|  (FastAPI + Python)  |
------------------------
|
┌───────┴──────────────────────────────────────────────┐
|                                                      |
|  [a] Parse document (if uploaded)                    |
|     └──> Extract text using PyMuPDF / pdfplumber     |
|     └──> Store parsed text in memory (e.g. global)   |
|                                                      |
|  [b] Maintain in-memory chat_history list:           |
|     └──> [system, user, assistant, user, ...]        |
|     └──> Trims old entries if token limit exceeded   |
|                                                      |
|  [c] Append new question to chat_history             |
|                                                      |
|  [d] Call Azure OpenAI API:                          |
|     └──> Deployment: gpt-4o                          |
|     └──> API-Version: 2025-01-01-preview             |
|                                                      |
|  [e] Receive LLM Response                            |
|     └──> Append to chat_history                      |
|     └──> Return to frontend                          |
└──────────────────────────────────────────────────────┘
|
V
Display Answer in UI
```

![image](https://github.com/user-attachments/assets/4c1c614d-c7d2-46f3-8ad9-2543c92bd38f)


## 🛠️ Technical Implementation

### Frontend (React + TypeScript)

- Built with React and TypeScript for type safety
- Simple and intuitive UI for document upload and question asking
- API services to communicate with backend:
  - `uploadDocument(file)`: Sends document to server for processing
  - `askQuestion(question, context)`: Submits questions and receives answers

### Backend (FastAPI + Python)

- RESTful API built with FastAPI
- Document parsing capabilities for extracting text
- Integration with Azure OpenAI API (GPT-4o)
- In-memory context management:
  - Maintains chat history for contextual follow-up questions
  - Automatically trims history to fit token limits

### LLM Integration

- Uses Azure OpenAI's GPT-4o model
- System prompt designed to focus the model on document analysis
- Context management to allow for follow-up questions

## 🚀 Deployment

- **Frontend**: Deployed on [Vercel](https://docubot-ai.vercel.app/)
- **Backend**: Hosted on [Render](https://docubot-ai.onrender.com)

## How It Works

1. **Upload a Document**  
   Supported formats: `.pdf`, `.txt`.

2. **Backend Parses the File**  
   The document is converted into text using `PyMuPDF` or standard file reading.

3. **User Asks a Question**  
   The question and previous chat history are sent to the GPT-4o model.

4. **Context is Trimmed if Needed**  
   A context window utility ensures the token limit isn't exceeded.

5. **Response is Generated**  
   Azure OpenAI returns a response which is shown in the chat interface.

## 📄 Assignment Requirements Met

- ✅ Full-stack implementation using React + FastAPI
- ✅ Integration with LLM provider (Azure OpenAI)
- ✅ Clean and functional user interface
- ✅ Bonus: Chat-style follow-up questions capability

---

Created by Vedas :)
