import discord
from discord.ext import commands
from util.db import DBUtil

db = DBUtil()

intents = discord.Intents.all()

bot = discord.Client(intents=intents)


@bot.event
async def on_ready():
    print(f"Bot is ready as {bot.user}")


@bot.event
async def on_guild_join(guild):
    db.add_guild(guild.id)
    db.add_admin(guild.id, guild.owner_id)


@bot.event
async def on_guild_remove(guild):
    print(guild.name)
    db.remove_guild(guild.id)


def get_bot_instance():
    return bot
