from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext

from auth.jwt_auth import (
    Token,
    TokenData,
    create_access_token,
    decode_jwt_token,
)
from models.user import User

pwd_context = CryptContext(schemes=["bcrypt"])

def get_password_hash(password):
    return pwd_context.hash(password)

class HashPassword:
    def create_hash(self, password: str):
        return pwd_context.hash(password)

    def verify_hash(self, input_password: str, hashed_password: str):
        return pwd_context.verify(input_password, hashed_password)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/sign-in")
hash_password = HashPassword()


def get_user(token: Annotated[str, Depends(oauth2_scheme)]) -> TokenData:
    print(token)
    return decode_jwt_token(token)


user_router = APIRouter()

@user_router.post("/sign-in")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    ## Authenticate user by verifying the user in DB
    username = form_data.username
    existing_user = await User.find_one(User.username == username)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    authenticated = hash_password.verify_hash(
        form_data.password, existing_user.password
    )
    if authenticated:
        access_token = create_access_token(
            {"username": username}
        )
        return Token(access_token=access_token)

    raise HTTPException(status_code=401, detail="Invalid username or password")

@user_router.post("/register")
async def register_user(username: str, password: str):
    # Check if user already exists
    existing_user = await User.find_one(User.username == username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Hash the password
    hashed_password = hash_password.create_hash(password)
    
    # Create and save the new user
    new_user = User(username=username, password=hashed_password)
    await new_user.insert()
    
    return {"message": "User registered successfully"}