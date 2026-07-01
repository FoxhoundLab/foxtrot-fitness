"""Shared SQLAlchemy type decorators for cross-DB compatibility.

SQLite doesn't support PostgreSQL ARRAY or UUID types. These type decorators
provide portable equivalents that work on both PostgreSQL (production) and
SQLite (local dev/testing).
"""

import json
import uuid as uuid_lib
from sqlalchemy.types import TypeDecorator, String, CHAR
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


class StringList(TypeDecorator):
    """Stores a list of strings as JSON. Works on both PostgreSQL and SQLite."""

    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return json.dumps(list(value))

    def process_result_value(self, value, dialect):
        if value is None:
            return []
        if isinstance(value, list):
            return value
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return []


class GUID(TypeDecorator):
    """Platform-independent GUID. Uses native UUID on PostgreSQL, CHAR(36) on SQLite."""

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == "postgresql":
            return value
        if isinstance(value, uuid_lib.UUID):
            return str(value)
        return str(uuid_lib.UUID(value))

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, uuid_lib.UUID):
            return value
        return uuid_lib.UUID(str(value))