import asyncio
from database import users_collection

async def main():
    try:
        doc = await users_collection.find_one({"email": "test@test.com"})
        print("MongoDB connection successful. Doc:", doc)
    except Exception as e:
        print("MongoDB connection failed:", e)

if __name__ == "__main__":
    asyncio.run(main())
