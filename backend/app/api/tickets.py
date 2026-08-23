from fastapi import APIRouter


router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


@router.get("/health")
def tickets_health():
    return {
        "message": "Tickets API is working"
    }