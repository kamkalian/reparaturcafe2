import time
from api.smart_qrcode import bp
from flask import request, jsonify, url_for, session
from api.models import Task, Customer, Device, Image, User, HashToken
import re
import hashlib
from datetime import datetime
from api import csrf


@bp.route('/api/qrcode', methods=['POST'])
@csrf.exempt
def qrcode():
    post_json = ""
    qrcode = ""
    pin = ""
    resp = {}
    resp_json = ""

    # QRCode ermitteln
    if request.method == "POST":
        post_json = request.get_json()
        if "qrcode" in post_json:
            qrcode = post_json["qrcode"]
        if "pin" in post_json:
            pin = post_json["pin"]
        
    # Prüfen ob der QR-Code valide ist
    # Der QR-Code muss am Anfang ein 'usr' oder 'tsk' haben.
    # usr = User
    # tsk = Task
    # Danach folgt der Hash-Code, 
    re_match = re.search("(usr|tsk)([a-zA-Z0-9_-]*)", qrcode)
    
    if re_match is None:
        resp["qrcode_valid"] = False
        resp_json = jsonify(resp)
    else:
        resp["qrcode_valid"] = True
        if re_match[1] == "usr":
            if pin:
                resp["type"] = "user"
                # Hash Token erstellen
                hash_token = hashlib.sha256(re_match[2].encode("utf-8")).hexdigest()
                htk = HashToken.query.filter_by(htk_id=hash_token, htk_locked=False).first()
                if htk:
                    # Pin hashen 
                    pin_hash = hashlib.sha256(pin.encode("utf-8")).hexdigest()
                    if pin_hash == htk.htk_pin:
                        user = htk.user
                        if user.usr_id:
                            resp["usr_id"] = user.usr_id
                            resp["usr_name"] = user.usr_name
                            resp["usr_role"] = user.usr_role
                            _add_session_user(user.usr_id, user.usr_role, user.usr_name)
                        else:
                            resp["error"] = "usr_id_not_found"
                    else:
                            resp["error"] = "pin_error"
                else:
                    resp["error"] = "usr_not_found"
            else:
                resp["error"] = "pin_not_found"
            resp_json = jsonify(resp)
        if re_match[1] == "tsk":
            resp["type"] = "task"
            # Hash Token erstellen
            hash_token = hashlib.sha256(re_match[2].encode("utf-8")).hexdigest()
            # Task ermitteln
            htk = HashToken.query.filter_by(htk_id=hash_token, htk_locked=False).first()
            task_id = None
            task = None
            if htk:
                task_id = htk.htk_tsk_id
            if task_id:
                task = Task.query.filter_by(tsk_id=task_id).first()
            if task:
                resp["tsk_id"] = task.tsk_id
                resp_json = jsonify(resp)

                _add_session_allowed_id(task.tsk_id, htk.htk_auth)
            else:
                resp["error"] = "task_not_found"
                resp_json = jsonify(resp)

    return resp_json


def _add_session_allowed_id(tsk_id, htk_auth):
    today_date = datetime.now()

    allowed_ids = session.get('ALLOWED_IDS', [])
    try:
        if not [item for item in allowed_ids if tsk_id in item]:
            allowed_ids.append((tsk_id, today_date, htk_auth))
            session['ALLOWED_IDS'] = allowed_ids
        else:
            # Tuple holen
            allowed_id_tuple = [item for item in allowed_ids if tsk_id in item][0]
            # Tuple aus Liste entfernen
            allowed_ids.remove(allowed_id_tuple)
            # Datum austauschen
            new_tuple = (allowed_id_tuple[0], today_date, allowed_id_tuple[2])
            # Tuple wieder zur Liste hinzufügen
            allowed_ids.append(new_tuple)
    except TypeError:
        allowed_ids = []
        allowed_ids.append((tsk_id, today_date, htk_auth))
        session['ALLOWED_IDS'] = allowed_ids


def _add_session_user(usr_id, usr_role, usr_name):
    today_date = datetime.now()

    session_user = (
        usr_id,
        usr_name,
        today_date,
        usr_role
    )
    
    session['USER'] = session_user
    
