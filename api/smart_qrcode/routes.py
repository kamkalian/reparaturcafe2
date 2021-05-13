import time
from api.smart_qrcode import bp
from flask import request, jsonify, url_for
from api.models import Task, Customer, Device, Image, User
import re


@bp.route('/api/qrcode', methods=['POST', 'GET'])
def qrcode():
    post_json = ""
    qrcode = ""
    result_dict = {}

    # QRCode ermitteln
    if request.method == "POST":
        post_json = request.get_json()
        if "qrcode" in post_json:
            qrcode = post_json["qrcode"]
    if request.method == "GET":
        pass
        
    # Prüfen ob der QR-Code valide ist
    # Der QR-Code muss am Anfang ein 'usr' oder 'tsk' oder 'adm' haben.
    # usr = User
    # tsk = Task
    # adm = Admin
    # Danach folgt der 43 Zeichen lange Hash-Code, 
    # oder bei 'adm' 4x die '0'
    re_match = re.search("(usr|tsk|adm)([a-zA-Z0-9]{43}|0000)", qrcode)
    if re_match is None:
        result_dict["qrcode_valid"] = False
    else:
        result_dict["qrcode_valid"] = True
        if re_match[1] == "usr":
            result_dict["action"] = "show_user"
        if re_match[1] == "tsk":
            result_dict["action"] = "show_task"
        if re_match[1] == "adm":
            user_list = User.query.all()
            if len(user_list) == 0:
                result_dict["action"] = "add_first_user"
    
    return jsonify(result_dict)