import time
from api.user_manager import bp
from flask import request, jsonify, url_for, session
from api.models import Task, Customer, Device, Image, User, HashToken
import re
import hashlib
from datetime import datetime


@bp.route('/api/userlist', methods=['POST', 'GET'])
def userlist():
    resp = {}
    resp_json = ""

    if request.method == "POST":
        userlist = User.query.all()
        resp["userlist"] = [{
            "userID":item.usr_id,
            "userName":item.usr_name,
            "userEmail":item.usr_email,
            "userRole":item.usr_role,
            } for item in userlist]
        
    else:
        resp["state": "error"]
        resp["msg": "Not a POST request"]

    resp_json = jsonify(resp)

    return resp_json
