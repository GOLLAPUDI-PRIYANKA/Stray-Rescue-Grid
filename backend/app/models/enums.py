from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    RESCUER = "rescuer"
    VET = "vet"


class AnimalStatus(str, Enum):
    REPORTED = "reported"
    ASSIGNED = "assigned"
    RESCUED = "rescued"
    TREATED = "treated"
    RELEASED = "released"


class RescuePriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"