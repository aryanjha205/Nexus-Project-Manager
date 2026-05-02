import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://kushalshah3017_db_user:nEwYq7yjYFcwuDFM@cluster0.ocmbizk.mongodb.net/")
client = AsyncIOMotorClient(MONGO_URL)
database = client.project_manager

# Collections
users_collection = database.get_collection("users")
projects_collection = database.get_collection("projects")
tasks_collection = database.get_collection("tasks")
otps_collection = database.get_collection("otps")

# Create Indexes
async def create_indexes():
    # otps collection: TTL index for expiry
    await otps_collection.create_index("createdAt", expireAfterSeconds=300)
    # unique emails
    await users_collection.create_index("email", unique=True)

