from fastapi import FastAPI

from app.api.auth import router as auth_router
from app.api.tickets import router as tickets_router


app = FastAPI(
    title="Stray Rescue API",
    version="1.0.0",
)


app.include_router(tickets_router)
app.include_router(auth_router)


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