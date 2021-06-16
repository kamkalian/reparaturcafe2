from api.smart_qrcode import bp
from flask import jsonify, session
from datetime import datetime


@bp.route('/api/session_user', methods=['POST', 'GET'])
def session_user():
    resp = {}
    resp_json = ""
    
    session_user = session.get("USER", None)

    if session_user:
        today_date = datetime.now()
        print(session_user)
        if today_date.date() == session_user[2].date():
            resp = {
                "user_logged_in": True,
                "username": session_user[1],
                "user_role": session_user[3]
                }
        else:
            del session["USER"]
            resp = {
                "user_logged_in": False,
                "session_expired": True}
        
    else:
        resp = {"user_logged_in": False}

    resp_json = jsonify(resp)

    return resp_json
