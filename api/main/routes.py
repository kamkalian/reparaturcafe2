from api.main import bp
from flask import jsonify, session
from datetime import datetime, timedelta
from flask_wtf.csrf import generate_csrf


@bp.route('/api/session_user', methods=['POST', 'GET'])
def session_user():
    resp = {}
    resp_json = ""
    
    session_user = session.get("USER", None)

    token = generate_csrf()

    if session_user:
        today_date = datetime.now()
        exp_datetime = session_user[2] + timedelta(minutes=300)
        if today_date < exp_datetime:
            resp = {
                "user_logged_in": True,
                "username": session_user[1],
                "user_role": session_user[3],
                'csrf_token': token
                }
        else:
            del session["USER"]
            resp = {
                "user_logged_in": False,
                "session_expired": True,
                'csrf_token': token}
        
    else:
        resp = {"user_logged_in": False, 'csrf_token': token}

    resp_json = jsonify(resp)

    return resp_json


@bp.route('/api/csrf_token', methods=['GET'])
def csrf_token():
    token = generate_csrf()
    return {'csrf_token': token}


@bp.route('/api/logout', methods=['POST'])
def logout():
    session['USER'] = ""
    return {'success': 1}
