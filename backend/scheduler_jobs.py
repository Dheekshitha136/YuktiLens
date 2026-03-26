from apscheduler.schedulers.background import BackgroundScheduler
from collector import run_collector

scheduler = BackgroundScheduler()

def start_scheduler():
    if not scheduler.get_job("evidence_collector"):
        scheduler.add_job(
            run_collector,
            "interval",
            hours=6,
            id="evidence_collector",
            replace_existing=True,
        )
        scheduler.start()