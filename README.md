# Cellula Chat – AI-Powered Context-Aware Chat System

## Cellula Chat is a professional, modular AI chat application that with multi-turn conversation experience. It is designed with context-aware ## reasoning, tool-based AI workflows, and a modern, responsive frontend. The system uses FastAPI backend, React frontend, and Docker for easy deployment.

# Project Features

Multi-turn conversations per user.

Context-aware AI responses using modular tools.

Real-time tool usage tracking.

Secure authentication with JWT.

Beautiful, animated UI with structured chat bubbles.

Responsive layout with message alignment.

Dockerized backend and frontend for seamless deployment.**

# Frontend

## The frontend is built with React and styled for a modern chat experience.

# Key Features:

 User Authentication: Login and Signup with secure token-based sessions.

 Dynamic Chat Layout:

User messages aligned right, AI responses aligned left.

Shows the tool used by the AI for each response.

Typing Indicator: Animated “Agent is typing...” for realism.

Interactive Buttons

Animated Background: Smooth, gradient background 

Responsive Design: Works on desktop and tablets.

# Frontend Stack:

React 18+

Axios for API requests

React Icons for UI elements

CSS animations for particles and typing effects

Vite as the build tool

# Backend

The backend is built with FastAPI & Mongo DB for high-performance, async API handling. It serves as the brains of the system, coordinating AI responses and tool-based workflows.

# Key Responsibilities:

Authentication & Security

JWT token authentication

Hashed passwords storage

/signup, /login, /logout endpoints

# Conversation Management

Stores multi-turn chat history per user

Returns previous history on login

# AI Integration

Uses ChatOllama for AI-generated responses

Supports multiple tools in a modular reasoning pipeline

Returns structured JSON:

{
  "response": "AI-generated answer",
  "tool_used": "Context Presence Judge",
  "timestamp": "..."
}

# Integrated Tools

The AI agent uses four modular tools for context-aware reasoning:

## 1. Context Presence Judge

Determines if the input has enough context.

Output: context_provided or context_missing

## 2. Web Search Tool

Performs web search to fetch additional context when needed.

Cleans and deduplicates data.

Returns structured JSON array of results.

## 3. Context Relevance Checker

Evaluates if retrieved context is relevant to the query.

Output: relevant or irrelevant

## 4. Context Splitter

Separates background context from the actual question for precise AI response.

Returns JSON:

{
  "background_context": "...",
  "actual_question": "..."
}

# Workflow:

User sends query → backend /chat

Context Presence Judge checks input

Web Search Tool fetches data if needed

Context Relevance Checker validates

Context Splitter cleans input

ChatOllama generates AI response

Backend stores answer in MongoDB

JSON response sent to frontend

# **Technology Stack**
Component	Purpose
Python 3.11+	Backend programming
FastAPI	High-performance API
Uvicorn	ASGI server
Pydantic	Data validation
JWT	Authentication
ChatOllama	AI language model
React	Frontend UI
Vite	Frontend build tool
Docker & Docker-Compose	Containerized deployment
Docker Setup
Mongo DB

# **The project is fully dockerized for consistent deployment. It uses Docker Compose to orchestrate frontend and backend containers.**

docker-compose.yml 
version: '3.8'
services:
  mongo:
    image: mongo:latest
    container_name: pro_mongo
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    container_name: backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URI=mongodb://root:example@mongo:27017
      - JWT_SECRET=supersecret
    depends_on:
      - mongo

volumes:
  mongo_data:


# Benefits of Dockerization:

Run the entire app without worrying about dependencies

Easily deployable on cloud or local machines

Isolated environments prevent conflicts

Fast setup for testing and development

No need to install MongoDB locally

Backend automatically links to MongoDB

Persistent storage with volumes

Easy to deploy on any machine or server

# Installation & Running Locally

Clone the repository:

Start the backend and frontend using Docker Compose:

docker-compose up --build


# Access the app:

Frontend: http://localhost:5173

Backend API: http://localhost:8000

Signup, login, and start chatting with the AI.

# User Experience

interface: multi-turn chat, right-left alignment

Tool visibility: shows which AI tool was used per response

Typing indicators: real-time feedback for user

Structured messages: well-organized responses with timestamps

Responsive UI: works on different devices

# Key Advantages

Modular AI tools for context-aware reasoning

Scalable, secure backend with FastAPI

Clean, modern, interactive frontend

Dockerized setup for ease of deployment

Extensible: new tools or AI models can be added easily


# **Final Summary**
backend is a full autonomous AI system combining:

Component

FastAPI  
LangChainAgent   	   
Custom Tools	     
Ollama Model	    
MongoDB	Persistent        
Docker Compose	     
React Frontend	      
