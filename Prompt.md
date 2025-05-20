# AI Prompting Documentation - Smart Document Q&A App

## Project Overview

I was given an assignment to build a Smart Document Q&A application with the following requirements:
- Full-stack implementation with React frontend and FastAPI backend
- Document upload functionality
- Question-answering capability using LLM
- Simple and functional UI

This document captures my prompting journey through the development process, showing how I leveraged AI tools to build the application.

## Initial Project Understanding & Architecture

**My Prompt:**
```
Hi gpt let me share my assignment:

**Coding Assignment -- Smart Document Q&A App**

**Overview:** 

Build a simple full-stack web app where a user can upload a document and ask questions about its content. The app should use an LLM to answer the questions based on the uploaded content.

**Functional Requirements**

Frontend (React + TypeScript): A UI with an option to upload a document and an input field to ask a question. Also, a section to display the AI-generated answer.

Backend (FastAPI + Python): Receives the document and the question. Pass the document and the question to a LLM. The LLM should respond with a contextually right answer. Return the final answer to the frontend.

**Expectations**
-   Full stack implementation (React + FastAPI).
-   Use any LLM provider (OpenAI API, Azure OpenAI, etc.).
-   Clear and functional UI --- doesn't have to be fancy.
-   Using AI tools to writing code is okay. You'd have to show the prompts that you used to generate the code though. Kindly either be prepared with a document which shows how you used the prompts to write code. Fundamental understanding of code blocks is important.
```

**AI Response:**
The AI provided a comprehensive breakdown of what would be needed:

- Outlined a full-stack app structure for document upload and LLM-based question answering
- Described necessary frontend components in React+TypeScript (file upload, question input, answer display)
- Detailed backend requirements in FastAPI+Python (document receiving, LLM integration)
- Clarified that the app would need to integrate with Azure GPT-4o via their endpoint
- Recommended maintaining chat history for follow-up questions as a bonus feature

## Requirements Clarification

**My Prompt:**
```
ok so i have a few qustions: 
1. how do you propose we'savee context ok the chat-> backend inmeory of array text? like keep storing the request and response until the array exceeds the size of the limit of tokens and when hit follow up api, add that stored array tokens text wth the new qs 
2. and wne we add any document: text pdf we need to extract text from those ourselves and send the llm : this is a pdf: text.... and for the presistent storage send the whole conversation stored in the array with every qs and update the array based on the window so it wont exceed so newQsLength+contextarrlength <= limit of the llm api else slice context
```

**AI Response:**
The AI provided detailed answers to my questions about managing chat context and document handling:

1. For chat context:
   - Suggested maintaining an in-memory list structure for chat history
   - Showed how to structure messages in the format expected by Azure OpenAI
   - Explained context trimming to stay within token limits
   - Provided code structure for appending new messages and managing history

2. For document handling:
   - Explained how to extract text from PDFs using libraries like PyMuPDF/pdfplumber
   - Showed how to inject document content into the system prompt
   - Provided sample chat history structure that incorporated document text

## Project Architecture Planning

**My Prompt:**
```
Ok lets make a markdown document:
Frontend (React + TypeScript)
|
|---> [1] Upload Document (PDF / TXT)
| |
| V
| POST /upload
|
|---> [2] Ask Question (via input)
|
V
POST /ask
|
V
------------------------
| |
| Backend |
| (FastAPI + Python) |
------------------------
|
┌───────┴──────────────────────────────────────────────┐
| |
| [a] Parse document (if uploaded) |
| └──> Extract text using PyMuPDF / pdfplumber |
| └──> Store parsed text in memory (e.g. global) |
| |
| [b] Maintain in-memory chat_history list: |
| └──> [system, user, assistant, user, ...] |
| └──> Trims old entries if token limit exceeded |
| |
| [c] Append new question to chat_history |
| |
| [d] Call Azure OpenAI API: |
| └──> Endpoint: https://panta-code-challenge... |
| └──> Deployment: gpt-4o |
| └──> API-Version: 2025-01-01-preview |
| └──> Request: |
| { |
| "messages": chat_history, |
| "max_tokens": 500 |
| } |
| |
| [e] Receive LLM Response |
| └──> Append to chat_history |
| └──> Return to frontend |
└──────────────────────────────────────────────────────┘
|
V
Display Answer in UI
└──> Optionally render as chat
```

**AI Response:**
The AI confirmed my architecture diagram was excellent and accurately depicted the flow of the application.

## File Structure Planning

**My Prompt:**
```
OK gpt lets make the file structure
I'll be a mono Repo with frontend and backend folder + readme
```

**AI Response:**
The AI provided a comprehensive file structure for the monorepo:

**Project File Structure**
```
📁 SMART-DOC-QA
├── 📁 backend
│   ├── 📁 __pycache__
│   ├── 📁 api
│   │   ├── 📁 __pycache__
│   │   ├── 📄 chat.py
│   │   ├── 📄 document.py
│   │   └── 📄 resethistory.py
│   ├── 📁 services
│   │   ├── 📁 __pycache__
│   │   ├── 📄 openai_service.py
│   │   └── 📄 pdf_parser.py
│   ├── 📁 utils
│   │   ├── 📁 __pycache__
│   │   │   ├── 📄 __init__.cpython-311.pyc
│   │   │   └── 📄 context_window.cpython-311.pyc
│   │   └── 📄 context_window.py
│   ├── 📁 venv
│   ├── 📄 .env
│   ├── 📄 main.py
│   └── 📄 requirements.txt
└── 📁 frontend
    ├── 📁 components
    │   ├── 📄 HomeComponent.tsx
    │   └── 📄 TestInputComponent.tsx
    ├── 📁 node_modules
    ├── 📁 public
    ├── 📁 src
    │   └── 📁 app
    │       ├── 📄 favicon.ico
    │       ├── 📄 globals.css
    │       ├── 📄 layout.tsx
    │       └── 📄 page.tsx
    ├── 📁 utils
    │   ├── 📄 api.ts
    │   └── 📄 chat.ts
    ├── 📄 .env
    ├── 📄 .eslintrc.mjs
    ├── 📄 next-env.d.ts
    ├── 📄 next.config.js
    ├── 📄 package-lock.json
    ├── 📄 package.json
    ├── 📄 postcss.config.mjs
    ├── 📄 README.md
    ├── 📄 tsconfig.json
    ├── 📄 .gitignore
    └── 📄 README.md
```

## Backend Development

**My Prompt:**
```
HIGH LEVEL BASIC SETUP V1:
```

**AI Response:**
The AI outlined the backend setup process:

1. Python environment setup with virtualenv
   - Package installation: fastapi, uvicorn, python-multipart, python-dotenv, openai, PyPDF2

2. FastAPI entry point (main.py)
   - CORS middleware configuration
   - Router registration for document and chat endpoints
   - Root endpoint for API health check

3. Document upload route (api/document.py)
   - API router for document upload
   - Integration with PDF text extraction service

4. PDF parsing service (services/pdf_parser.py)
   - Function to extract text from uploaded PDFs using PyPDF2

5. Question-answering endpoint (api/chat.py)
   - API router for question handling
   - Integration with OpenAI service for LLM responses

6. OpenAI service (services/openai_service.py)
   - Azure OpenAI API configuration
   - Function to query LLM with document context and question

7. Environment variables setup (.env)
   - Secure storage for API keys and endpoints

8. Testing instructions for the API
   - How to verify endpoints are working

## Context Window Management

**My Prompt:**
```
"max_tokens": 50 should i set it to most upper limit as if i set oit small it might crop the message whenllp respond withthe full message?
```

**AI Response:**
The AI advised on token limits:

- Confirmed that setting max_tokens too low could cause response truncation
- Recommended a higher value (suggested 1000 tokens) to allow for complete answers
- Explained the total token limit for GPT-4o (~128k tokens) being shared between prompt and response
- Reiterated the importance of my approach to trim older messages when context gets too large

## CORS Configuration

**My Prompt:**
```
its fine as I discussed with the engineer:
```

**AI Response:**
The AI provided detailed CORS configuration advice:

- Explained that the current middleware configuration allows requests from any origin
- Warned about the invalid combination of `allow_origins=["*"]` with `allow_credentials=True`
- Provided correct configurations for different scenarios:
  - Public API without auth/cookies
  - APIs with auth/cookies requiring specific origins
- Recommended avoiding the invalid combination that could cause unexpected behavior

## Production Deployment CORS Configuration

**My Prompt:**
```
https://docubot-ai.vercel.app/ i want to allow this and loca host 3000
```

**AI Response:**
The AI provided the correct CORS configuration for my specific use case:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://docubot-ai.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This configuration properly allows both my production frontend (docubot-ai.vercel.app) and local development environment while maintaining security.

## Code Review

The AI provided a comprehensive review of my implementation:

**What Was Done Well:**
1. Architecture
   - Solid modern stack selection (Next.js + TypeScript for frontend, FastAPI for backend)
   - Logical separation of concerns with organized folders
   - Clear, RESTful API naming

2. LLM Integration
   - Well-encapsulated LLM interaction in the openai_service.py
   - Proper chat history management with token context handling

3. Azure OpenAI Integration
   - Correctly parameterized API calls to GPT-4o
   - Appropriate system role configuration
   - Good environment variable management

4. Frontend Integration
   - Clean handling of file uploads via FormData
   - Proper implementation of chat message handling with async fetches

**Suggestions for Improvement:**
1. Global chat_history poses a concurrency risk
   - Fine for demo/single-user but could cause issues with multiple users
   - Suggested solutions:
     - Client-generated session tokens
     - Server-side storage in Redis or database

2. max_tokens value was too high
   - Suggested a safer range (4,096-8,192) depending on the deployment

These suggestions were acknowledged but deemed acceptable for the scope of this assignment after discussion with the engineer.

## Conclusion

Throughout the development process, I used AI tools to:
1. Understand the requirements and create the application architecture
2. Design the file structure and implementation approach
3. Develop the key components for document handling and LLM integration
4. Configure proper API communication and security measures
5. Get feedback on potential improvements

The final application successfully meets all the requirements:
- Full-stack implementation with React frontend and FastAPI backend
- Document upload and text extraction functionality
- Question-answering using Azure OpenAI's GPT-4o
- Clean, functional UI with chat history support





# Raw Prompts(Semi-Structured):
Raw Prompts Used for Building Smart Document Q&A App
This file contains all the raw prompts I used while building the Smart Document Q&A application, showing my thought process and how I leveraged AI assistance.
Initial Requirements Analysis
Hi gpt let me share my assignment:

**Coding Assignment -- Smart Document Q&A App**

**Overview:** 

Build a simple full-stack web app where a user can upload a document and ask questions about its content. The app should use an LLM to answer the questions based on the uploaded content.

**Functional Requirements**

Frontend (React + TypeScript): A UI with an option to upload a document and an input field to ask a question. Also, a section to display the AI-generated answer.

Backend (FastAPI + Python): Receives the document and the question. Pass the document and the question to a LLM. The LLM should respond with a contextually right answer. Return the final answer to the frontend.

**Expectations**
-   Full stack implementation (React + FastAPI).
-   Use any LLM provider (OpenAI API, Azure OpenAI, etc.).
-   Clear and functional UI --- doesn't have to be fancy.
-   Using AI tools to writing code is okay. You'd have to show the prompts that you used to generate the code though. Kindly either be prepared with a document which shows how you used the prompts to write code. Fundamental understanding of code blocks is important.

clarifying questions + requirement with engineer on recruiter:
If yes, let me know. We can talk and I'll give you more details about the project that we can use for evaluation
Clarifying Requirements with Recruiter
I let the recruiter know I was up for the challenge and would build something to demonstrate how quickly I can learn and build. The recruiter shared more details about the project.

After receiving the details, I asked a few clarification questions:
- Could you please provide me with OpenAI key to use in my project
- Do we want Auth in our application?
- Do we want multiple chat functionality?
- Should chat history or uploaded documents be stored maybe in a storage bucket, or is everything ephemeral/in-memory for now(simplicity>)

The recruiter confirmed:
- They would send me an API key via email
- No auth needed
- No multiple chats needed
- No persistent storage required
- The goal is to integrate the app with an LLM and tweak for good quality responses
- As a bonus feature, I could make it like a chat with follow-up questions about the same document
Understanding Chat Context Management
ok so i have a few qustions: 
1. how do you propose we'savee context ok the chat-> backend inmeory of array text? like keep storing the request and response until the array exceeds the size of the limit of tokens and when hit follow up api, add that stored array tokens text wth the new qs 
2. and wne we add any document: text pdf we need to extract text from those ourselves and send the llm : this is a pdf: text.... and for the presistent storage send the whole conversation stored in the array with every qs and update the array based on the window so it wont exceed so newQsLength+contextarrlength <= limit of the llm api else slice context
Designing the Application Flow

Ok lets make a markdown document:
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


i want to allow this and loca host 3000
Implementing Frontend UI Components
Now let's implement the UI components for the frontend. I need:
1. A file upload component for PDFs
2. A chat interface with message history
3. A question input box
4. Display for LLM answers

Can you help me design the layout and structure?
Implementing Document Upload and Processing
For the file upload component we need to:
1. Allow PDF/TXT uploads
2. Extract text on backend
3. Store the document text in memory
4. Show confirmation to user when loaded

Let's implement this part first
Building Chat Interface
Now for the chat interface:
1. Need to show both user questions and AI responses
2. Scrollable message history
3. Typing indicator when waiting for LLM response
4. Question input at bottom with send button
5. Style it to look clean but no need for fancy UI

Show me how to implement this with React + TypeScript
Connecting Frontend to Backend
Let's connect the frontend to our FastAPI backend:
1. Need a service to handle API calls
2. Function to upload documents
3. Function to send questions
4. State management for chat history
5. Loading states for UI feedback

How should we structure this?
Implementing Token Management
For the token management to ensure we don't exceed context window:
1. We need to estimate token count based on text length
2. Implement trimming function when context gets too large
3. Keep most recent messages and always include document text
4. Remove oldest messages first when trimming

Let's implement this in the backend
Error Handling and Edge Cases
We should add proper error handling:
1. What happens if file upload fails
2. What if LLM request fails
3. Invalid file types
4. Empty questions
5. Network errors

Let's add this to both frontend and backend
Optimization and Testing
Let's optimize the app:
1. Add loading states for better UX
2. Make sure document processing is efficient
3. Add basic error boundaries
4. Test with various document sizes and types

What's the best approach?
Final Integration and Testing
Let's make sure everything works together:
1. Upload document flows to backend correctly
2. Questions and answers maintain context
3. Chat history displays properly
4. Token management works with large documents
5. UI is responsive and clean

What should we test to ensure it's all working?
Deployment Considerations
For deployment:
1. Setup CORS properly for production environment
2. Make sure env variables are configured
3. Check if FastAPI works on deployment platform
4. Can Vercel host both frontend and backend or need separate services?

What's the best deployment approach?
Azure OpenAI Integration
For integrating with Azure OpenAI:
1. Need to format API calls correctly
2. Handle response mapping
3. Make sure error handling is robust
4. Keep API key secure

How should we structure the Azure OpenAI integration?
Here's the Azure OpenAI endpoint and details:
- Endpoint: https://panta-code-challenge-openai.openai.azure.com/
- Deployment: gpt-4o
- API Version: 2025-01-01-preview
- Key: [REDACTED - will be in .env file]

Let's implement the service to talk to this API
Testing Document Parsing
Let's test document parsing with different file types:
1. PDF with text
2. PDF with images and text
3. TXT files
4. Larger documents (20+ pages)

How can we make sure parsing works well for all these?
Final Review and Optimization
Before final submission:
1. Cleanup any console logs
2. Make sure code is well-commented
3. Check for any bugs or edge cases
4. Optimize performance if possible
5. Document the code well for reviewers

Anything else I should consider?
Finalizing Documentation
Let's create good documentation:
1. README for how to run locally
2. Document the API endpoints
3. List technologies used
4. Architecture overview
5. Prompt documentation for AI usage

What should I include in these docs?