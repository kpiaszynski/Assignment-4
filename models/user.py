from beanie import Document


class User(Document):
    username: str
    password: str  # hash & salted password in the database

    class Settings:
        name = "users"

