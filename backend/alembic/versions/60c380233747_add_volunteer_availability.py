"""add volunteer availability

Revision ID: 60c380233747
Revises: 1aef5e030f06
Create Date: 2026-09-06
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "60c380233747"
down_revision: Union[str, Sequence[str], None] = "1aef5e030f06"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "is_available",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )

    op.alter_column(
        "users",
        "is_available",
        server_default=None,
    )


def downgrade() -> None:
    op.drop_column("users", "is_available")