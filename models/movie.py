from pydantic import BaseModel


class Movie(BaseModel):
    title: str
    desc: str
    rating: int | None = None  # Initialize as None
  
    class Settings:
        name = "movies"



class MovieRequest(BaseModel):
    title: str
    desc: str
    rating: int | None = None  # Initialize as None
