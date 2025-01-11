import discord
from util.trigger_util import get_trigger
from util.db import DBUtil
import asyncio

db = DBUtil()


async def send_discord_message(bot, loop, announcement_id, guild_id, channel_id, message, timestamp, period):
    guild = bot.get_guild(int(guild_id))
    if not guild:
        return
    channel = guild.get_channel(int(channel_id))
    if not channel:
        return
    try:
        asyncio.run_coroutine_threadsafe(channel.send(message), loop)
        if period == "ONCE":
            db.remove_announcement(announcement_id)
    except Exception as e:
        print(f"Error sending message: {e}")


def schedule_announcement(bot, scheduler, loop, announcement_id, guild_id, channel_id, message, timestamp, period):
    trigger = get_trigger(timestamp, period)
    scheduler.add_job(lambda: asyncio.run(send_discord_message(bot, loop, announcement_id, guild_id, channel_id, message, timestamp, period)), trigger, id=str(announcement_id))
    print(f"Scheduled announcement for guild {guild_id}, channel {channel_id} at {timestamp} with period '{period}'.")


def remove_scheduled_announcement(scheduler, announcement_id):
    scheduler.remove_job(str(announcement_id))


def parse_announcement(message):
    return message


def load_announcements(bot, scheduler, loop):
    announcements = db.get_all_announcements()
    for announcement in announcements:
        announcement_id = announcement["id"]
        guild_id = announcement["guild_id"]
        channel_id = announcement["channel_id"]
        content = announcement["content"]
        timestamp = announcement["timestamp"]
        period = announcement["period"]
        schedule_announcement(bot, scheduler, loop, announcement_id, guild_id, channel_id, content, timestamp, period)
