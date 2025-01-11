import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from bot.bot import get_bot_instance
from backend.api import create_app
from hypercorn.asyncio import serve
from hypercorn.config import Config
from util.db import DBUtil
from shared.tasks import load_announcements


async def run_discord_bot(bot):
    await bot.start(<BOT_TOKEN>)


async def run_flask_app(app):
    config = Config()
    config.bind = ["localhost:5000"]
    await serve(app, config)


async def main():
    db = DBUtil()
    db.db_setup()

    scheduler = BackgroundScheduler()

    bot = get_bot_instance()
    loop = asyncio.get_event_loop()
    scheduler.start(),
    app = create_app(bot, loop, scheduler)
    load_announcements(bot, scheduler, loop)

    await asyncio.gather(
        run_flask_app(app),
        run_discord_bot(bot)
    )


if __name__ == "__main__":
    asyncio.run(main())
