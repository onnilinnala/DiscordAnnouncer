import sqlite3
import sqlite_utils
from typing import Optional


class DBUtil:
    def __init__(self):
        self.db_name: str = "demo_database.db"
        self.db: sqlite_utils.Database = sqlite_utils.Database(sqlite3.connect(self.db_name, check_same_thread=False))

    def db_setup(self) -> None:
        self.db["guilds"].create({
            "id": int,
            "guild_id": str,
        }, pk="id", if_not_exists=True)

        self.db["admins"].create({
            "id": int,
            "user_id": str,
            "guild_id": str,
        }, pk="id", if_not_exists=True)

        self.db["admin_roles"].create({
            "id": int,
            "role_id": str,
            "guild_id": str,
        }, pk="id", if_not_exists=True)

        self.db["announcements"].create({
            "id": int,
            "user_id": str,
            "guild_id": str,
            "name": str,
            "channel_id": str,
            "content": str,
            "timestamp": int,
            "period": str,
        }, pk="id", if_not_exists=True)

    def add_guild(self, guild_id: str) -> None:
        self.db["guilds"].insert({"guild_id": guild_id})

    def remove_guild(self, guild_id: str) -> None:
        where_str = f"guild_id = ?"
        where_values = [guild_id]
        with self.db.conn:
            self.db["guilds"].delete_where(where_str, where_values)
            self.db["admins"].delete_where(where_str, where_values)
            self.db["admin_roles"].delete_where(where_str, where_values)
            self.db["announcements"].delete_where(where_str, where_values)

    def get_guilds(self) -> list[dict[str, str]]:
        return list(self.db["guilds"].rows)

    def add_admin(self, guild_id: str, user_id: str) -> None:
        self.db["admins"].insert({"guild_id": guild_id, "user_id": user_id})

    def remove_admin(self, guild_id: str, user_id: str) -> None:
        where_str = f"guild_id = ? AND user_id = ?"
        where_values = [guild_id, user_id]
        with self.db.conn:
            self.db["admins"].delete_where(where_str, where_values)

    def get_admins(self, guild_id: str) -> list[dict[str, int]]:
        where_str = f"guild_id = ?"
        where_values = [guild_id]
        return list(self.db["admins"].rows_where(where_str, where_values))

    def add_admin_role(self, guild_id: str, role_id: str) -> None:
        self.db["admin_roles"].insert({"guild_id": guild_id, "role_id": role_id})

    def remove_admin_role(self, guild_id: str, role_id: str) -> None:
        where_str = f"guild_id = ? AND role_id = ?"
        where_values = [guild_id, role_id]
        with self.db.conn:
            self.db["admin_roles"].delete_where(where_str, where_values)

    def get_admin_roles(self, guild_id: str) -> list[dict[str, str]]:
        where_str = f"guild_id = ?"
        where_values = [guild_id]
        return list(self.db["admin_roles"].rows_where(where_str, where_values))

    def add_announcement(self, guild_id: str, user_id: str, channel_id: str, name: str, content: str, timestamp: int,
                         period: str) -> int:
        return self.db["announcements"].insert({
            "guild_id": guild_id,
            "user_id": user_id,
            "channel_id": channel_id,
            "name": name,
            "content": content,
            "timestamp": timestamp,
            "period": period,
        }).last_pk

    def remove_announcement(self, announcement_id: int) -> None:
        self.db["announcements"].delete(announcement_id)

    def get_announcement(self, guild_id: str, announcement_id: int) -> dict[str, int]:
        where_str = f"guild_id = ? AND id = ?"
        where_values = [guild_id, announcement_id]
        return list(self.db["announcements"].rows_where(where_str, where_values))[0]

    def get_announcements(self, guild_id: str) -> list[dict[str, int]]:
        where_str = f"guild_id = ?"
        where_values = [guild_id]
        return list(self.db["announcements"].rows_where(where_str, where_values))

    def get_all_announcements(self) -> list[dict[str, int]]:
        return list(self.db["announcements"].rows)

    def update_announcement(self, announcement_id: int,
                            user_id: str,
                            channel_id: Optional[str] = None,
                            content: Optional[str] = None,
                            timestamp: Optional[int] = None,
                            period: Optional[str] = None) -> None:
        if not (channel_id or content or timestamp or period):
            return
        update_data: dict[str, Optional[str | int]] = {"user_id": user_id}
        if channel_id:
            update_data["channel_id"] = channel_id
        if content:
            update_data["content"] = content
        if timestamp:
            update_data["timestamp"] = timestamp
        if period:
            update_data["period"] = period
        self.db["announcements"].update(announcement_id, update_data)
