from flask import session
from datetime import datetime, timedelta


def _is_granted():
    user = session.get('USER', None)
    if user:
        if user[3] == "admin" or user[3] == "user":
            today_date = datetime.now()
            exp_datetime = user[2] + timedelta(minutes=300)
            if today_date > exp_datetime:
                return False
            return True
    return False