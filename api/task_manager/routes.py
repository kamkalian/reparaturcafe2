import os
from flask import request, jsonify, url_for, session, current_app, send_file
from werkzeug.utils import secure_filename
from api.models import Task, Customer, Device, Image, State, Step, Log, Accessory
from api import db
from datetime import datetime, timedelta
from api.task_manager import bp
from sqlalchemy import or_
from api.smart_qrcode.qrcode_label import generate_qrcode_label
from api.main.token import generate_token, htk_from_token
from api.main.auth import _is_granted
from pathlib import Path
import secrets


@bp.route('/api/new_task', methods=['POST'])
def new_task():

    post_json = request.get_json()
    
    # Kunde anlegen oder über ID selektieren
    customer = None
    cus_id = None
    if hasattr(post_json, "cusID"):
        cus_id = post_json["cusID"]
    else:
        customer = Customer(
            cus_title = post_json["gender"],
            cus_first_name = post_json["firstName"],
            cus_last_name = post_json["lastName"],
            cus_email = post_json["email"],
            cus_phone_no = post_json["prefixNumber"] + " " + post_json["phone"],
            cus_street = post_json["street"],
            cus_house_number = post_json["houseNumber"],
            cus_post_code = post_json["postCode"]
        )
        db.session.add(customer) # pylint: disable=maybe-no-member
        db.session.commit() # pylint: disable=maybe-no-member
        cus_id = customer.cus_id

    # Gerät anlegen oder über ID selektieren
    device = None
    dev_id = None
    if hasattr(post_json, "devID"):
        dev_id = post_json["devID"]
    else:
        device = Device(
            dev_name = post_json["devName"],
            dev_model = post_json["devModel"],
            dev_category = post_json["categoryName"],
            dev_electronic_mechanical_type = post_json["electricalMechanical"],
            dev_mnf_name = post_json["manufacturerName"],
        )
        db.session.add(device) # pylint: disable=maybe-no-member
        db.session.commit() # pylint: disable=maybe-no-member
        dev_id = device.dev_id

    new_task = Task(
        tsk_fault_description = post_json["faultDescription"],
        tsk_creation_date = datetime.now(),
        tsk_cus_id = cus_id,
        tsk_dev_id = dev_id,
        tsk_state = "new",
        tsk_next_step = "not_set",
    )
    db.session.add(new_task) # pylint: disable=maybe-no-member
    db.session.commit() # pylint: disable=maybe-no-member

    # Zubehör
    for acc in post_json["accessories"]:
        accessory = Accessory(
            acc_name = acc,
            acc_tsk_id = new_task.tsk_id
        )
        db.session.add(accessory) # pylint: disable=maybe-no-member
    db.session.commit() # pylint: disable=maybe-no-member

    tk = generate_token("customer", new_task.tsk_id)

    # QR-Code generieren
    image_file = generate_qrcode_label("customer", new_task.tsk_id, tk)

    # Files anlegen
    files = post_json["files"]
    for filename in files:
        new_file = Image(img_filename=filename, img_tsk_id=new_task.tsk_id)
        db.session.add(new_file) # pylint: disable=maybe-no-member
        db.session.commit() # pylint: disable=maybe-no-member

    # Token als neuer Token in der Session speichern.
    session['NEW_TOKEN'] = tk

    return {'tsk_id':new_task.tsk_id, 'tsk_token': tk}


@bp.route('/api/tasks', methods=['GET'])
def tasks():
    filter_category = request.args.get('filter_category')
    filter_manufacturer = request.args.get('filter_manufacturer')
    filter_text = request.args.get('filter_text')

    tasks = Task.query
    tasks = tasks.join(Task.device, aliased=True)
    if filter_category != "":
        if filter_category == "ohne Angabe":
            filter_category = ""
        tasks = tasks.filter_by(dev_category=filter_category)
    if filter_manufacturer != "":
        if filter_manufacturer == "ohne Angabe":
            filter_manufacturer = ""
        tasks = tasks.filter_by(dev_mnf_name=filter_manufacturer)
    if filter_text != "" :
        tasks = tasks.filter(or_(
                Task.tsk_id == filter_text, Device.dev_name.contains(filter_text)
            )
        )
    tasks = tasks.order_by(Task.tsk_id.desc()).all()

    task_list = []
    category_list = []
    manufacturer_list = []
    for d in tasks:

        dev_name = ""
        dev_manufacturer = ""
        dev_model = ""
        dev_category = ""
        if d.device:
            dev_name = d.device.dev_name
            dev_manufacturer = d.device.dev_mnf_name
            dev_model = d.device.dev_model
            dev_category = d.device.dev_category
        
            # Kategorien ermitteln und als Liste zusammenbauen
            category_exists = False
            if dev_category == "":
                    dev_category = "ohne Angabe"
            for category in category_list:
                if dev_category == category["name"]:
                    category["count"] += 1
                    category_exists = True
            if category_exists == False:
                category_list.append({"name": dev_category, "count": 1})

            # Hersteller ermitteln und als Liste zusammenbauen
            manufacturer_exists = False
            if dev_manufacturer == "" or dev_manufacturer == None:
                    dev_manufacturer = "ohne Angabe"
            for manufacturer in manufacturer_list:
                if dev_manufacturer == manufacturer["name"]:
                    manufacturer["count"] += 1
                    manufacturer_exists = True
            if manufacturer_exists == False:
                manufacturer_list.append({"name": dev_manufacturer, "count": 1})

        # In der Session nachschauen ob die Task enthalten ist.
        # Wenn ja dann writeable = True setzen.
        writeable = False
        if _is_exp_date_in_session_valid(d.tsk_id):
            writeable = True

        task_list.append(
            {
                "id": d.tsk_id,
                "faultDescription": d.tsk_fault_description,
                "creationDate": d.tsk_creation_date,
                "deviceName": dev_name,
                "deviceManufacturer": dev_manufacturer,
                "deviceModel": dev_model,
                "deviceCategory": dev_category,
                "writeable": writeable,
            }
        )
    return jsonify({
        'task_list':task_list,
        'category_list':category_list,
        'manufacturer_list':manufacturer_list})


@bp.route('/api/task_lists', methods=['GET'])
def task_lists():
    filter_category = request.args.get('filter_category')
    filter_manufacturer = request.args.get('filter_manufacturer')
    filter_text = request.args.get('filter_text')

    tasks = Task.query
    tasks = tasks.join(Device)
    tasks = tasks.join(Customer)
    if filter_category != "":
        if filter_category == "ohne Angabe":
            filter_category = ""
        tasks = tasks.filter_by(dev_category=filter_category)
    if filter_manufacturer != "":
        if filter_manufacturer == "ohne Angabe":
            filter_manufacturer = ""
        tasks = tasks.filter_by(dev_mnf_name=filter_manufacturer)
    if filter_text != "" :
        tasks = tasks.filter(or_(
                Task.tsk_id == filter_text,
                Device.dev_name.contains(filter_text),
                Customer.cus_last_name.contains(filter_text),
                Customer.cus_first_name.contains(filter_text),
                Customer.cus_email.contains(filter_text),
            )
        )
    tasks = tasks.order_by(Task.tsk_id.asc()).all()

    new_task_list = []
    in_process_task_list = []
    done_task_list = []
    category_list = []
    manufacturer_list = []

    for d in tasks:

        dev_name = ""
        dev_manufacturer = ""
        dev_model = ""
        dev_category = ""
        if d.device:
            dev_name = d.device.dev_name
            dev_manufacturer = d.device.dev_mnf_name
            dev_model = d.device.dev_model
            dev_category = d.device.dev_category
        
            # Kategorien ermitteln und als Liste zusammenbauen
            category_exists = False
            if dev_category == "":
                    dev_category = "ohne Angabe"
            for category in category_list:
                if dev_category == category["name"]:
                    category["count"] += 1
                    category_exists = True
            if category_exists == False:
                category_list.append({"name": dev_category, "count": 1})

            # Hersteller ermitteln und als Liste zusammenbauen
            manufacturer_exists = False
            if dev_manufacturer == "" or dev_manufacturer == None:
                    dev_manufacturer = "ohne Angabe"
            for manufacturer in manufacturer_list:
                if dev_manufacturer == manufacturer["name"]:
                    manufacturer["count"] += 1
                    manufacturer_exists = True
            if manufacturer_exists == False:
                manufacturer_list.append({"name": dev_manufacturer, "count": 1})

        # In der Session nachschauen ob die Task enthalten ist.
        # Wenn ja dann writeable = True setzen.
        writeable = False
        if _is_exp_date_in_session_valid(d.tsk_id):
            writeable = True

        task = {
            "id": d.tsk_id,
            "faultDescription": d.tsk_fault_description,
            "creationDate": d.tsk_creation_date,
            "deviceName": dev_name,
            "deviceManufacturer": dev_manufacturer,
            "deviceModel": dev_model,
            "deviceCategory": dev_category,
            "writeable": writeable,
            "nextStep": d.tsk_next_step,
        }
        if d.tsk_state == "new":
            new_task_list.append(task)
        elif d.tsk_state == "in_process":
            in_process_task_list.append(task)
        elif d.tsk_state == "done":
            done_task_list.append(task)

        
    return jsonify({
        'new_task_list':new_task_list,
        'in_process_task_list':in_process_task_list,
        'done_task_list':done_task_list,
        'category_list':category_list,
        'manufacturer_list':manufacturer_list})


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]


@bp.route('/api/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return {"error":"Kein file gefunden"}


    file = request.files['file']
    if file.filename == '':
        return {"error":"keine Datei angegeben!"}
    
    if file and allowed_file(file.filename):
        # filename = secure_filename(file.filename)
        filename = secrets.token_urlsafe(32) + "." + file.filename.split(".")[-1]
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], filename))
        return {"ok":1, "filename":filename}

    return {"ok":1}


@bp.route('/api/task', methods=['GET'])
def task():
    tsk_id = None
    task = None
    resp = {}
    resp_json = jsonify({})
    new_task_indicator = False
    
    tsk_id = request.args.get('tsk_id')
    new_task_indicator = request.args.get('new_task_indicator')

    if tsk_id:
        task = Task.query.filter_by(tsk_id=tsk_id).first()
        if task:
            resp['writeable'] = False
            resp['tsk_id'] = task.tsk_id
            resp['dev_name'] = task.device.dev_name
            resp['dev_mnf_name'] = task.device.dev_mnf_name
            resp['dev_category'] = task.device.dev_category
            resp['dev_model'] = task.device.dev_model
            resp['dev_electronic_mechanical_type'] = task.device.dev_electronic_mechanical_type
            resp['tsk_fault_description'] = task.tsk_fault_description
            resp['tsk_creation_date'] = task.tsk_creation_date.strftime("%d.%m.%Y")
            try:
                resp['accessory_list'] = ', '.join(r.acc_name for r in task.accessory_list)
            except:
                resp['accessory_list'] = ''
            resp['image_files'] = [img.img_filename for img in task.image_list]

            is_exp_date_in_session_valid, tsk_auth = _is_exp_date_in_session_valid(task.tsk_id)
            
            is_granted = _is_granted()
            if is_exp_date_in_session_valid or is_granted:
                resp['cus_first_name'] = task.customer.cus_first_name
                resp['cus_last_name'] = task.customer.cus_last_name
                resp['cus_phone'] = task.customer.cus_phone_no
                resp['cus_email'] = task.customer.cus_email
                resp['tsk_auth'] = tsk_auth
                resp['tsk_state'] = task.tsk_state
                resp['tsk_next_step'] = task.tsk_next_step

                state = State.query.filter_by(sta_name=task.tsk_state).first()
                next_step = Step.query.filter_by(ste_name=task.tsk_next_step).first()
                resp['tsk_state_caption'] = state.sta_caption
                resp['tsk_next_step_caption'] = next_step.ste_caption
                
                resp['tsk_auth'] = tsk_auth

                if(tsk_auth == 'dev' or is_granted):
                    resp['writeable'] = True
                    resp['hash_tokens'] = [{
                    'htk_id': item.htk_id,
                    'htk_auth': item.htk_auth,
                    'htk_creation_date': item.htk_creation_date.strftime("%d.%m.%Y")}
                    for item in task.hash_tokens]
                    if task.log_list:
                        log_list = []
                        for d in task.log_list:
                            user_name = ""
                            if d.user:
                                user_name = d.user.usr_name
                            log_tuple = (d.log_type, d.log_msg, user_name, d.log_timestamp.strftime("%d.%m.%Y"))
                            log_list.append(log_tuple)
                        resp['log_list'] = log_list

                if new_task_indicator:
                    resp['new_token'] = session.get('NEW_TOKEN', None)
            else:
                resp['writeable'] = False
  
        else:
            resp["state"] = "error"
            resp["msg"] = "Task nicht gefunden!"
    else:
        resp["state"] = "error"
        resp["msg"] = "Keine Task ID angegeben!"

    resp_json = jsonify(resp)

    return resp_json


@bp.route('/api/lock_task', methods=['POST'])
def lock_task():
    allowed_ids = session.get('ALLOWED_IDS', [])
    allowed_left_ids = []
    resp = {}
    resp_json = jsonify({})

    if request.method == "POST":
        post_json = request.get_json()
        if "tsk_id" in post_json:
            tsk_id = post_json["tsk_id"]

        if tsk_id:
            for item in allowed_ids:
                if tsk_id != item[0]:
                    allowed_left_ids.append(item)
            
            session['ALLOWED_IDS'] = allowed_left_ids

    resp_json = jsonify(resp)
    return resp_json


def _is_exp_date_in_session_valid(tsk_id):
    allowed_ids = session.get('ALLOWED_IDS', [])
    today_date = datetime.now()
    if [item for item in allowed_ids if tsk_id in item]:
        allowed_id_tuple = [item for item in allowed_ids if tsk_id in item][0]
        if today_date.date() == allowed_id_tuple[1].date():
            try:
                return True, allowed_id_tuple[2]
            except IndexError:
                return False, None
        else:
            return False, None
    else:
        return False, None


@bp.route('/api/new_qrcode_image/<tsk_id>', methods=['GET'])
def new_qrcode_image(tsk_id):
    qrcode_only = request.args.get('qrcode_only')
    path = Path(current_app.root_path)
    new_token = session.get('NEW_TOKEN', "empty")

    suffix = ""
    if qrcode_only and new_token != "empty":
        suffix = "_qrcode_only"

    if tsk_id:
        # Prüfen ob der Token auch zur Task ID passt.
        # Task ermitteln
        htk = None
        htk = htk_from_token(new_token)
        task_id = None
        task = None
        if htk:
            task_id = htk.htk_tsk_id
            if task_id == int(tsk_id):
                task = Task.query.filter_by(tsk_id=task_id).first()
                if task:
                    is_exp_date_in_session_valid, tsk_auth = _is_exp_date_in_session_valid(int(tsk_id))
                    if is_exp_date_in_session_valid or _is_granted():
                        return send_file("../qr_codes/" + new_token + suffix + ".png", mimetype='image/png')
                    else:
                        return send_file(str(path.parent.absolute()) + "/qr_codes/empty.png", mimetype='image/png')
                else:
                    return send_file(str(path.parent.absolute()) + "/qr_codes/empty.png", mimetype='image/png')
            else:
                return send_file(str(path.parent.absolute()) + "/qr_codes/empty.png", mimetype='image/png')
        else:
            return send_file(str(path.parent.absolute()) + "/qr_codes/empty.png", mimetype='image/png')
    else:
        return send_file(str(path.parent.absolute()) + "/qr_codes/empty.png", mimetype='image/png')



@bp.route('/api/image/<img_filename>', methods=['GET'])
def image(img_filename):
    if img_filename:
        return send_file("../images/" + img_filename, mimetype='image/jpeg')
    else:
        return send_file("../images/error.svg", mimetype='image/svg')


@bp.route('/api/state_lists', methods=['GET'])
def state_lists():
    state_list_db = State.query.order_by(State.sta_caption).all()
    step_list_db = Step.query.order_by(Step.ste_caption).all()
    return jsonify({
        "state_list": [(d.sta_name, d.sta_caption) for d in state_list_db],
        "step_list": [(d.ste_name, d.ste_caption) for d in step_list_db]})


@bp.route('/api/change_state', methods=['POST'])
def change_state():
    post_json = request.get_json()
    tsk_id = None
    new_state = None
    resp = {}
    resp_json = jsonify({})

    if "tsk_id" in post_json:
        tsk_id = post_json["tsk_id"]
    if "new_state" in post_json:
        new_state = post_json["new_state"]
    
    if tsk_id and new_state:
        is_exp_date_in_session_valid, tsk_auth = _is_exp_date_in_session_valid(int(tsk_id))
        if is_exp_date_in_session_valid or _is_granted():
            task = Task.query.filter_by(tsk_id=tsk_id).first()
            if task:
                old_state = task.tsk_state
                task.tsk_state = new_state
                db.session.commit()

                old_state_caption = db.session.query(State.sta_caption).filter(State.sta_name == old_state).first()[0]
                new_state_caption = db.session.query(State.sta_caption).filter(State.sta_name == new_state).first()[0]
                
                _add_log_item(tsk_id, "action", "Status von '" + old_state_caption + "' auf '" + new_state_caption + "' geändert.")
                
                resp["state"] = "success"
        else:
            resp["state"] = "error"
            resp["msg"] = "Keine Berechtigung!"
    else:
        resp["state"] = "error"
        resp["msg"] = "Keine Task ID angegeben!"

    resp_json = jsonify(resp)

    return resp_json


@bp.route('/api/change_next_step', methods=['POST'])
def change_next_step():
    post_json = request.get_json()
    tsk_id = None
    new_next_step = None
    resp = {}
    resp_json = jsonify({})

    if "tsk_id" in post_json:
        tsk_id = post_json["tsk_id"]
    if "new_next_step" in post_json:
        new_next_step = post_json["new_next_step"]
    
    if tsk_id and new_next_step:
        is_exp_date_in_session_valid, tsk_auth = _is_exp_date_in_session_valid(int(tsk_id))
        if is_exp_date_in_session_valid or _is_granted():
            task = Task.query.filter_by(tsk_id=tsk_id).first()
            if task:
                old_step = task.tsk_next_step
                task.tsk_next_step = new_next_step
                db.session.commit()

                old_step_caption = db.session.query(Step.ste_caption).filter(Step.ste_name == old_step).first()[0]
                new_step_caption = db.session.query(Step.ste_caption).filter(Step.ste_name == new_next_step).first()[0]
                _add_log_item(tsk_id, "action", "Nächster Schritt von '" + old_step_caption + "' auf '" + new_step_caption + "' geändert.")

                resp["state"] = "success"
        else:
            resp["state"] = "error"
            resp["msg"] = "Keine Berechtigung!"
    else:
        resp["state"] = "error"
        resp["msg"] = "Keine Task ID angegeben!"

    resp_json = jsonify(resp)

    return resp_json


def _add_log_item(tsk_id, log_type, log_msg):
    user = session.get('USER', None)
    user_id = None
    
    if user:
        user_id = user[0]

    log_item = Log(
        log_type=log_type,
        log_msg=log_msg,
        log_tsk_id=tsk_id,
        log_usr_id=user_id,
        )
    db.session.add(log_item)
    db.session.commit()


@bp.route('/api/save_comment', methods=['POST'])
def save_comment():
    post_json = request.get_json()
    tsk_id = None
    comment = None
    resp = {}
    resp_json = jsonify({})

    if "tsk_id" in post_json:
        tsk_id = post_json["tsk_id"]
    if "comment" in post_json:
        comment = post_json["comment"]
    
    if tsk_id and comment:
        is_exp_date_in_session_valid, tsk_auth = _is_exp_date_in_session_valid(int(tsk_id))
        if is_exp_date_in_session_valid or _is_granted():
            task = Task.query.filter_by(tsk_id=tsk_id).first()
            if task:
                _add_log_item(tsk_id, "comment", comment)
                resp["state"] = "success"
        else:
            resp["state"] = "error"
            resp["msg"] = "Keine Berechtigung!"
    else:
        resp["state"] = "error"
        resp["msg"] = "Keine Task ID angegeben!"

    resp_json = jsonify(resp)

    return resp_json