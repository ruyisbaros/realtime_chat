from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .utils.database import get_db, engine
from .utils import models
from .routes import auth_routes, user_routes, message_routes

load_dotenv()


app = FastAPI()
get_db()  # run DB connection

models.Base.metadata.create_all(bind=engine)

# CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# SET ROUTES
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(message_routes.router)
# app.include_router(album_routes.router)
# app.include_router(stats_routes.router)
