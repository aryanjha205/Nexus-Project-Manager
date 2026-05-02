from fastapi import APIRouter, Depends, HTTPException, status
from models import UserCreate, UserInDB, OTPVerify, LoginRequest, Token
from database import users_collection, otps_collection
from utils.auth import get_password_hash, verify_password, create_access_token
from utils.email import send_otp_email
import random
import string
from datetime import datetime
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_password
    user_dict["is_active"] = False
    
    await users_collection.insert_one(user_dict)
    
    # Generate OTP
    otp = generate_otp()
    await otps_collection.insert_one({
        "email": user.email,
        "otp": otp,
        "createdAt": datetime.utcnow()
    })
    
    # Send email
    await send_otp_email(user.email, otp)
    
    return {"message": "User registered. Please check your email for OTP."}

@router.post("/verify-otp")
async def verify_otp(otp_data: OTPVerify):
    record = await otps_collection.find_one({"email": otp_data.email, "otp": otp_data.otp})
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    await users_collection.update_one({"email": otp_data.email}, {"$set": {"is_active": True}})
    await otps_collection.delete_many({"email": otp_data.email})
    
    return {"message": "Account activated successfully"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.get("is_active"):
        raise HTTPException(status_code=400, detail="Inactive user. Please verify OTP.")
        
    access_token = create_access_token(data={"sub": user["email"], "role": user.get("role", "Member")})
    return {"access_token": access_token, "token_type": "bearer"}
