import time
from api.smart_qrcode import bp
from flask import request, jsonify, url_for
from api.models import Task, Customer, Device, Image, User, HashToken
import re
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    set_access_cookies,
    set_refresh_cookies,
    jwt_required,
    get_jwt_identity
)
import hashlib


@bp.route('/api/qrcode', methods=['POST', 'GET'])
def qrcode():
    post_json = ""
    qrcode = ""
    resp = {}
    resp_json = ""

    # QRCode ermitteln
    if request.method == "POST":
        post_json = request.get_json()
        if "qrcode" in post_json:
            qrcode = post_json["qrcode"]
    if request.method == "GET":
        pass
        
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
            resp["type"] = "user"
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
                # Tokens generieren
                access_token = create_access_token(identity=task.tsk_id) 
                refresh_token = create_refresh_token(identity=task.tsk_id) 
                # Cookies setzen
                resp_json = jsonify(resp)
                set_access_cookies(resp_json, access_token)
                set_refresh_cookies(resp_json, refresh_token)
            else:
                resp["error"] = "task_not_found"
                resp_json = jsonify(resp)

    return resp_json


@bp.route('/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user = get_jwt_identity()
    access_token = create_access_token(identity=user)
    resp = jsonify({'refresh': True})
    set_access_cookies(resp, access_token)

