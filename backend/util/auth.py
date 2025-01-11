import json
from util.db import DBUtil
import requests


db = DBUtil()


def is_auth(token):
    headers = {"Authorization": token}
    return requests.get("https://discord.com/api/v10/users/@me", headers=headers).status_code == 200


def get_user_id(token):
    try:
        headers = {"Authorization": token}
        response = json.loads(requests.get("https://discord.com/api/v10/users/@me", headers=headers).content)
        return response['id']
    except Exception as e:
        print(f"Exception occurred: {e}")
        return 0


def is_authorised_for_guild(token, guild_id):
    return get_user_id(token) in [admin['user_id'] for admin in db.get_admins(guild_id)]


def get_user_guilds(token):
    headers = {"Authorization": token}
    return json.loads(requests.get("https://discord.com/api/v10/users/@me/guilds", headers=headers).content)