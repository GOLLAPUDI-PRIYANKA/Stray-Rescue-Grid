from pydantic import BaseModel, EmailStr, Field

from app.models.user import UserRole, UserStatus


class UserRegister(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=120,
    )
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )
    phone: str | None = Field(
        default=None,
        max_length=30,
    )
    role: UserRole = UserRole.CITIZEN


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None
    role: UserRole
    status: UserStatus

    model_config = {
        "from_attributes": True
    }


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=8,
        max_length=128,
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"