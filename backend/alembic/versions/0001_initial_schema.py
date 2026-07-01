"""initial schema

Revision ID: 0001
Revises:
Create Date: 2026-07-01
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(), unique=True, nullable=False),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("equipment_ids", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("goals", postgresql.JSONB, default=dict),
        sa.Column("preferences", postgresql.JSONB, default=dict),
        sa.Column("user_level", sa.String(), default="intermediate"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "equipment",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("category", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("aliases", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("requires", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("paired_with", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("movements", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("icon", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_equipment_category", "equipment", ["category"])

    op.create_table(
        "movements",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("aliases", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("equipment_required", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("muscle_groups", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("movement_pattern", sa.String(), nullable=True),
        sa.Column("difficulty", sa.String(), default="intermediate"),
        sa.Column("tempo_default", sa.String(), nullable=True),
        sa.Column("alternatives", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("contraindications", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "finishers",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("format", sa.String(), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=True),
        sa.Column("rounds", sa.Integer(), nullable=True),
        sa.Column("rest_between_rounds", sa.Integer(), nullable=True),
        sa.Column("reps_scheme", sa.String(), nullable=True),
        sa.Column("movements", postgresql.JSONB, default=list),
        sa.Column("equipment_required", postgresql.ARRAY(sa.String()), default=list),
        sa.Column("type", sa.String(), nullable=True),
        sa.Column("difficulty", sa.String(), default="intermediate"),
        sa.Column("notes", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "programs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("goal_tag", sa.String(), nullable=True),
        sa.Column("difficulty", sa.String(), nullable=True),
        sa.Column("split", sa.String(), nullable=True),
        sa.Column("user_level", sa.String(), nullable=True),
        sa.Column("design_view", postgresql.JSONB, nullable=False),
        sa.Column("execution_view", sa.String(), nullable=False),
        sa.Column("version", sa.Integer(), default=1),
        sa.Column("is_active", sa.Boolean(), default=False),
        sa.Column("is_example", sa.Boolean(), default=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_programs_user_id", "programs", ["user_id"])
    op.create_index("ix_programs_is_example", "programs", ["is_example"])


def downgrade() -> None:
    op.drop_index("ix_programs_is_example", table_name="programs")
    op.drop_index("ix_programs_user_id", table_name="programs")
    op.drop_table("programs")
    op.drop_table("finishers")
    op.drop_table("movements")
    op.drop_index("ix_equipment_category", table_name="equipment")
    op.drop_table("equipment")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")