from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.assignments import router as assignments_router
from app.api.auth import router as auth_router
from app.api.tickets import router as tickets_router


app = FastAPI(
    title="Stray Rescue API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(tickets_router)
app.include_router(auth_router)
app.include_router(assignments_router)


@app.get("/")
def root():
    return {
        "message": "Stray Rescue API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }