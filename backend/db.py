from pymongo import MongoClient
import os

MONGO_URL = os.getenv("MONGO_URI", "mongodb://root:example@localhost:27017")
client = MongoClient(MONGO_URL)
db = client["cellula_week6"]

users_collection = db["users"]
conversations_collection = db["conversations"]
