import time
import os
from api import app
from flask import request, jsonify, url_for
from werkzeug.utils import secure_filename
from models import Task, Customer, Device, Image
from api import db
from datetime import datetime
import secrets
import pyqrcode


@app.route('/api/time')
def get_current_time():
    return {'time1': time.time()}


@app.route('/new_task', methods=['POST'])
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
            cus_phone_no = post_json["phone"],
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

    # Ein Token wird generiert, damit kann später der Task zum bearbeiten
    # vom User geöffnet werden.
    token = secrets.token_urlsafe(32)

    # QR-Code generieren
    url = pyqrcode.create('https://reparaturcafe.awo-oberlar.de/' + token)
    url.svg( '../public/qr_codes/' + token + '.svg', scale=4, quiet_zone=0)

    new_task = Task(
        tsk_fault_description = post_json["faultDescription"],
        tsk_creation_date = datetime.now(),
        tsk_cus_id = cus_id,
        tsk_dev_id = dev_id,
        tsk_token = token,
    )

    db.session.add(new_task) # pylint: disable=maybe-no-member
    db.session.commit() # pylint: disable=maybe-no-member

    # Files anlegen
    files = post_json["files"]
    for filename in files:
        new_file = Image(img_filename=filename, img_tsk_id=new_task.tsk_id)
        db.session.add(new_file) # pylint: disable=maybe-no-member
        db.session.commit() # pylint: disable=maybe-no-member

    return {'tsk_id':new_task.tsk_id, 'tsk_token': token}


@app.route('/tasks', methods=['POST'])
def tasks():
    post_json = request.get_json()

    tasks = Task.query
    if "filterCategory" in post_json:
        filter_category = post_json["filterCategory"]
        if filter_category != "":
            if filter_category == "ohne Angabe":
                filter_category = ""
            tasks = tasks.join(Task.device, aliased=True).filter_by(dev_category=filter_category)
    if "filterManufacturer" in post_json:
        filter_manufacturer = post_json["filterManufacturer"]
        if filter_manufacturer != "":
            if filter_manufacturer == "ohne Angabe":
                filter_manufacturer = ""
            tasks = tasks.join(Task.device, aliased=True).filter_by(dev_mnf_name=filter_manufacturer)
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

        task_list.append(
            {
                "id": d.tsk_id,
                "faultDescription": d.tsk_fault_description,
                "creationDate": d.tsk_creation_date,
                "deviceName": dev_name,
                "deviceManufacturer": dev_manufacturer,
                "deviceModel": dev_model,
                "deviceCategory": dev_category,
            }
        )
    return jsonify({
        'task_list':task_list,
        'category_list':category_list,
        'manufacturer_list':manufacturer_list})


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]


@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return {"error":"Kein file gefunden"}


    file = request.files['file']
    if file.filename == '':
        return {"error":"keine Datei angegeben!"}
    
    if file and allowed_file(file.filename):
        # filename = secure_filename(file.filename)
        filename = secrets.token_urlsafe(32) + "." + file.filename.split(".")[-1]
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return {"ok":1, "filename":filename}

    return {"ok":1}