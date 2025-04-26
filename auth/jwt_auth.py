from datetime import datetime, timedelta, timezone
import jwt
from pydantic import BaseModel
from passlib.context import CryptContext
from models.my_config import get_settings


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginResult(BaseModel):
    username: str

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: str
    exp_datetime: datetime


ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"])
class HashPassword:
    def create_hash(self, password: str):
        return pwd_context.hash(password)

    def verify_hash(self, input_password: str, hashed_password: str):
        return pwd_context.verify(input_password, hashed_password)  



def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    payload = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    payload.update({"exp": expire})
    key = get_settings().secret_key
    encoded = jwt.encode(payload, key, algorithm=ALGORITHM)
    return encoded


def decode_jwt_token(token: str) -> TokenData | None:
    try:
        key = get_settings().secret_key
        payload = jwt.decode(token, key, algorithms=[ALGORITHM])
        print(payload)
        username: str = payload.get("username")
        exp: int = payload.get("exp")
        return TokenData(
            username=username, exp_datetime=datetime.fromtimestamp(exp)
        )
    except jwt.InvalidTokenError:
        print("Invalid JWT token.")