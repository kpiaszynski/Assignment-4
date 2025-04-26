from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from router.user_router import user_router
from router.movie_router import movie_router

app = FastAPI(title="My Movie App")
app.include_router(movie_router, tags=["Movies"], prefix="/movies")
app.include_router(user_router, tags=["auth"], prefix="/auth")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])


@app.get("/")
async def welcome() -> dict:
    return FileResponse("./frontend/index.html")


app.mount("/", StaticFiles(directory="frontend"), name="static")