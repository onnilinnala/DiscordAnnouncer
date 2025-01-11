from functools import wraps
import discord
from flask import Flask, jsonify, request
from flask_cors import CORS
from util.db import DBUtil
from util.auth import is_auth, get_user_id, is_authorised_for_guild, get_user_guilds
from shared.tasks import schedule_announcement, remove_scheduled_announcement


def auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not is_auth(token):
            return jsonify({"error": "Unauthorized access"}), 401
        return f(*args, **kwargs)

    return decorated_function


def guild_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "Unauthorized access"}), 401
        guild_id = kwargs.get("guild_id")
        if not guild_id:
            return jsonify({"error": "Bad Request"}), 400
        if guild_id and not is_authorised_for_guild(token, guild_id):
            return jsonify({"error": "Forbidden"}), 403
        return f(*args, **kwargs)

    return decorated_function


def create_app(bot, loop, scheduler):
    app = Flask(__name__)
    CORS(app, supports_credentials=True)
    db = DBUtil()

    @app.route('/guilds', methods=['GET'])
    @auth
    def get_guilds():
        try:
            token = request.headers.get('Authorization')
            guild_ids = [guild['guild_id'] for guild in db.get_guilds()]
            user_guilds = get_user_guilds(token)
            user_guild_ids = [guild['id'] for guild in user_guilds]
            authorized_guild_ids = list(set(guild_ids) & set(user_guild_ids))
            guilds = list(filter(lambda x: x['id'] in authorized_guild_ids, user_guilds))
            parsed_guilds = []
            for guild in guilds:
                parsed_guilds.append({"id": guild["id"], "name": guild["name"], "icon": guild["icon"],
                                      "permissions": guild["permissions"]})
            return jsonify(parsed_guilds), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds', methods=['POST'])
    @auth
    def add_guild():
        try:
            guild_id = request.json['guild_id']
            db.add_guild(guild_id)
            return jsonify({"message": "success"}), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>', methods=['GET'])
    @guild_auth
    def get_guild(guild_id: str):
        if guild_id in [guild["guild_id"] for guild in db.get_guilds()]:
            guild = [guild for guild in bot.guilds if str(guild.id) == guild_id][0]
            name = str(guild.name)
            guild_id = guild_id
            icon = str(guild.icon)
            announcements = db.get_announcements(guild_id)
            return jsonify({"name": name, "id": guild_id, "icon": icon, "scheduledAnnouncements": announcements})

    @app.route('/guilds/<guild_id>/announcements', methods=['GET'])
    @guild_auth
    def get_announcements(guild_id: str):
        try:
            return jsonify(db.get_announcements(guild_id)), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/announcements/<announcement_id>', methods=['GET'])
    @guild_auth
    def get_announcement(guild_id: str, announcement_id: int):
        try:
            print("TEST")
            return jsonify(db.get_announcement(guild_id, announcement_id)), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/announcements', methods=['POST'])
    @guild_auth
    def add_announcements(guild_id: str):
        try:
            user_id = get_user_id(request.headers.get('Authorization'))
            channel_id = request.json['channel_id']
            message = request.json['message']
            name = request.json['name']
            timestamp = request.json['timestamp']
            period = request.json['period']
            announcement_id = db.add_announcement(guild_id, user_id, channel_id, name, message, timestamp, period)
            schedule_announcement(bot, scheduler, loop, announcement_id, guild_id, channel_id, message, timestamp,
                                  period)
            return jsonify({"message": "success"}), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/announcements/<announcement_id>', methods=['PATCH'])
    @guild_auth
    def edit_announcement(guild_id: str, announcement_id: int):
        try:
            if announcement_id in [announcement["id"] for announcement in db.get_announcements(guild_id)]:
                user_id = get_user_id(request.headers.get('Authorization'))
                channel_id, message, timestamp, period = None, None, None, None
                if request.json['channel_id']:
                    channel_id = request.json['channel_id']
                if request.json['message']:
                    message = request.json['message']
                if request.json['timestamp']:
                    timestamp = request.json['timestamp']
                if request.json['period']:
                    period = request.json['period']
                db.update_announcement(announcement_id, user_id, channel_id, message, timestamp, period)
                return jsonify({"message": "success"}), 200
            else:
                return jsonify({"error": "Forbidden"}), 403
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/announcements/<announcement_id>', methods=['DELETE'])
    @guild_auth
    def delete_announcement(guild_id: str, announcement_id: int):
        try:
            if announcement_id in [str(announcement["id"]) for announcement in db.get_announcements(guild_id)]:
                db.remove_announcement(announcement_id)
                remove_scheduled_announcement(scheduler, announcement_id)
                return jsonify({"message": "success"}), 200
            else:
                return jsonify({"error": "Forbidden"}), 403
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/admins', methods=['GET'])
    @guild_auth
    def get_admins(guild_id: str):
        try:
            return jsonify(db.get_admins(guild_id)), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/admins', methods=['POST'])
    @guild_auth
    def add_admin(guild_id: str):
        try:
            user_id = request.json['user_id']
            db.add_admin(guild_id, user_id)
            return jsonify({"message": "success"}), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/admins', methods=['PATCH'])
    @guild_auth
    def edit_admin(guild_id: str):
        return

    @app.route('/guilds/<guild_id>/admins', methods=['DELETE'])
    @guild_auth
    def remove_admin(guild_id: str):
        try:
            user_id = request.json['user_id']
            if user_id in [admins["user_id"] for admins in db.get_admins(guild_id)]:
                db.remove_admin(guild_id, user_id)
                return jsonify({"message": "success"}), 200
            else:
                return jsonify({"error": "Forbidden"}), 403
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/admin_roles', methods=['GET'])
    @guild_auth
    def get_admin_roles(guild_id: str):
        try:
            return jsonify(db.get_admin_roles(guild_id)), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/admin_roles', methods=['POST'])
    @guild_auth
    def add_admin_role(guild_id: str):
        try:
            role_id = request.json['role_id']
            db.add_admin_role(guild_id, role_id)
            return jsonify({"message": "success"}), 200
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/admin_roles', methods=['PATCH'])
    @guild_auth
    def edit_admin_role(guild_id: str):
        return

    @app.route('/guilds/<guild_id>/admin_roles', methods=['DELETE'])
    @guild_auth
    def remove_admin_role(guild_id: str):
        try:
            role_id = request.json['role_id']
            if role_id in [admin_roles["role_id"] for admin_roles in db.get_admin_roles(guild_id)]:
                db.remove_admin(guild_id, role_id)
                return jsonify({"message": "success"}), 200
            else:
                return jsonify({"error": "Forbidden"}), 403
        except Exception as e:
            return jsonify({"error": e}), 500

    @app.route('/guilds/<guild_id>/roles', methods=['GET'])
    @guild_auth
    def get_roles(guild_id: str):
        for guild in bot.guilds:
            if str(guild.id) == guild_id:
                # Evil function to map Seq to dict as following
                # {
                #     "name": "@everyone",
                #     "id": 1147839218379399208,
                #     "color": "(0, 0, 0)"
                # }
                return jsonify({"roles": [
                    {"name": role.name, "id": role.id, "color": f"{role.color.r, role.color.g, role.color.b}"} for role
                    in guild.roles]})
        return jsonify({"error": "Guild not found"}), 404

    @app.route('/guilds/<guild_id>/channels', methods=['GET'])
    @guild_auth
    def get_channels(guild_id: str):
        for guild in bot.guilds:
            if str(guild.id) == guild_id:
                return jsonify([{"name": channel.name, "id": channel.id} for channel in guild.text_channels])
        return jsonify({"error": "Guild not found"}), 404

    @app.route('/healthcheck', methods=['GET'])
    def healthcheck():
        return jsonify({"message": "success"}), 200

    @app.route('/test', methods=['GET'])
    def test_announcement():
        return jsonify({"message": [item.id for item in scheduler.get_jobs()]})

    return app
