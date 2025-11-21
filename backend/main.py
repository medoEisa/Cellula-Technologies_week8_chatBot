import os
import sys
import logging
from fastapi import FastAPI, Depends, HTTPException, Body, Header
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

sys.path.append(os.path.dirname(__file__))
from db import users_collection, conversations_collection
from models import UserCreate, UserOut
from auth import hash_password, verify_password, create_access_token, decode_access_token
from agent.agent_runner import run_agent, memory  
from pydantic import BaseModel
# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth 
@app.post("/signup", response_model=UserOut)
def signup(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(400, "Email already registered")
    hashed = hash_password(user.password)
    user_doc = {"username": user.username, "email": user.email, "password": hashed}
    res = users_collection.insert_one(user_doc)
    return UserOut(id=str(res.inserted_id), username=user.username, email=user.email)

@app.post("/login")
def login(email: str = Body(...), password: str = Body(...)):
    user = users_collection.find_one({"email": email})
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token(str(user["_id"]))
    return {"access_token": token, "username": user["username"], "user_id": str(user["_id"])}

def get_current_user(token: str = Header(None, alias="Authorization")):
    if not token:
        raise HTTPException(401, "Missing token")
    return decode_access_token(token)

# Chat -
from pydantic import BaseModel

class ChatRequest(BaseModel):
    user_input: str

@app.post("/chat")
async def chat(chat_req: ChatRequest, user_id: str = Depends(get_current_user)):
    user_input = chat_req.user_input
    logger.info(f"User {user_id} input: {user_input}")

    # Run agent
    response = await run_agent(user_input)

    # Save conversation 
    user_message = {"sender": "user", "content": user_input, "timestamp": datetime.utcnow()}
    agent_message = {"sender": "agent", "content": response, "timestamp": datetime.utcnow()}

    conv = conversations_collection.find_one({"user_id": user_id})
    if conv:
        conversations_collection.update_one(
            {"user_id": user_id},
            {"$push": {"messages": {"$each": [user_message, agent_message]}}}
        )
    else:
        conversations_collection.insert_one({"user_id": user_id, "messages": [user_message, agent_message]})

    return {"response": response}

@app.get("/history")
def history(user_id: str = Depends(get_current_user)):
    conv = conversations_collection.find_one({"user_id": user_id})
    return conv["messages"] if conv else []
