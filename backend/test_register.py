import asyncio
import traceback
from routes.auth import register
from models import UserCreate

async def test():
    try:
        user = UserCreate(name="Test", email="test@test.com", password="password123")
        res = await register(user)
        print("Success:", res)
    except Exception as e:
        print("ERROR:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
