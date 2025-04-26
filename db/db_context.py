from beanie import init_beanie
from models.movie import Movie
from models.my_config import get_settings
from motor.motor_asyncio import AsyncIOMotorClient
from models.user import User




async def init_database():
    my_config = get_settings()
    client = AsyncIOMotorClient(my_config.connection_string)
    db = client["cluster0"]
    await init_beanie(database=db, document_models=[User, Movie])