from typing import Annotated
from fastapi import APIRouter, HTTPException, Path, status

from models.movie import Movie, MovieRequest

max_id: int = 0

movie_router = APIRouter()

movie_list = []


@movie_router.get("")
async def get_movies() -> list[Movie]:
    return movie_list


@movie_router.post("", status_code=status.HTTP_201_CREATED)
async def add_movie(movie: MovieRequest) -> Movie:
    global max_id
    max_id += 1  # auto increment max_id
    newMovie = Movie(id=max_id, title=movie.title, desc=movie.desc, rating=movie.rating)
    movie_list.append(newMovie)
    return newMovie


@movie_router.get("/{id}")
async def get_movie_by_id(id: Annotated[int, Path(ge=0, le=1000)]) -> Movie:
    for movie in movie_list:
        if movie.id == id:
            return movie

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )


@movie_router.put("/{id}")
async def update_movie(movie: MovieRequest, id: int) -> dict:
    for i in movie_list:
        if i.id == id:
            i.title = movie.title
            i.desc = movie.desc
            if movie.rating is not None:
                i.rating = movie.rating
            return {"message": "Movie updated successfully"}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )


@movie_router.delete("/{id}")
async def delete_movie_by_id(id: Annotated[int, Path(ge=0, le=1000)]) -> dict:
    for i in range(len(movie_list)):
        movie = movie_list[i]
        if movie.id == id:
            movie_list.pop(i)
            return {"msg": f"The movie with ID={id} is removed."}

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail=f"Item with ID={id} is not found"
    )