from fastapi import APIRouter, Depends
from models import UserInDB
from dependencies import get_admin_user
from database import users_collection

router = APIRouter()

@router.get("/", response_model=list[UserInDB])
async def list_users(current_user: UserInDB = Depends(get_admin_user)):
    cursor = users_collection.find({"is_active": True})
    users = await cursor.to_list(length=100)
    return [UserInDB(**{**user, "_id": str(user["_id"])}) for user in users]
