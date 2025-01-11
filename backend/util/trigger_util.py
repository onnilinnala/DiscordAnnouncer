from apscheduler.triggers.cron import CronTrigger
from datetime import datetime


def get_trigger(timestamp, period):
    td = datetime.fromtimestamp(timestamp)
    # td.weekday returns 0 for monday and 6 for sunday but cron uses 1 for monday and 7 for sunday, so we add 1
    year, month, day_of_week, day, hour, minute = td.year, td.month, td.weekday() + 1, td.day, td.hour, td.minute
    match period:
        case "YEARLY":
            trigger = CronTrigger(month=month, day=day, hour=hour, minute=minute, start_date=td)
        case "MONTHLY":
            trigger = CronTrigger(day=day, hour=hour, minute=minute, start_date=td)
        case "WEEKLY":
            trigger = CronTrigger(day_of_week=day_of_week, hour=hour, minute=minute, start_date=td)
        case "DAILY":
            trigger = CronTrigger(hour=hour, minute=minute, start_date=td)
        case "HOURLY":
            trigger = CronTrigger(minute=minute, start_date=td)
        case "MINUTELY":
            trigger = CronTrigger(second=0, start_date=td)
        case "ONCE":
            trigger = CronTrigger(year=year, month=month, day=day, hour=hour, minute=minute)
    return trigger
