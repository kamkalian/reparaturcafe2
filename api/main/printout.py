from api.main import bp
from flask import current_app, send_file
from api.main.auth import _is_granted
from pathlib import Path
from api.models import Task, Log
from datetime import datetime


@bp.route('/api/printout/<tsk_id>', methods=['GET'])
def printout(tsk_id):
    if _is_granted():
        path = Path(current_app.root_path)
        task = None

        # Laufzettel.html einlesen
        f = open(str(path.parent.absolute()) + "/templates/Laufzettel.html", "r")
        html = f.read()
        f.close()

        # Datensatz holn
        task = Task.query.filter_by(tsk_id=tsk_id).first()
        if task:
            print("#"+task.customer.cus_last_name+"#")
            # Datum des letzten Log Eintrags holen
            last_log_dat = ""
            last_log = Log.query.filter_by(log_tsk_id=tsk_id).order_by(Log.log_id.desc()).first()
            if last_log:
                last_log_dat = last_log.log_timestamp.strftime("%d.%m.%y")

            # Logs als Protokoll zu einem String zusammenbauen
            log_string = ""
            for log in task.log_list:
                log_string += log.log_timestamp.strftime("%d.%m.%y")
                log_string += " | " + log.log_msg 
                log_string += " | " + log.user.usr_name + "<br><hr>"

            # Daten ersetzen
            html = html.replace(
                "header_image.png",
                "/api/printout_logo")
            html = html.replace("cus_first_name", task.customer.cus_first_name)
            html = html.replace("cus_last_name", task.customer.cus_last_name)
            html = html.replace("cus_phone_no", task.customer.cus_phone_no)
            html = html.replace("cus_email", task.customer.cus_email)
            html = html.replace("tsk_creation_date", task.tsk_creation_date.strftime("%d.%m.%y"))
            html = html.replace("last_log_dat", last_log_dat)
            html = html.replace("tsk_id", tsk_id)
            html = html.replace("dev_name", task.device.dev_name)
            html = html.replace("dev_mnf_name", task.device.dev_mnf_name)
            html = html.replace("dev_model", task.device.dev_model)
            #html = html.replace("Zub", task.device.dev_mnf_name)
            html = html.replace("tsk_fault_description", task.tsk_fault_description)
            html = html.replace("log_string", log_string)
            
        return html
    else:
        return """Keine Berechtigung!"""


@bp.route('/api/printout_logo', methods=['GET'])
def printout_logo():
    path = Path(current_app.root_path)
    filename = str(path.parent.absolute()) + "/templates/header_image.png"
    return send_file(filename, mimetype='image/png')