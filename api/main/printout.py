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

            # Datum des letzten Log Eintrags holen
            b_dat = ""
            last_log = Log.query.filter_by(log_tsk_id=tsk_id).order_by(Log.log_id.desc()).first()
            if last_log:
                b_dat = last_log.log_timestamp.strftime("%d.%m.%y")

            # Logs als Protokoll zu einem String zusammenbauen
            log_string = ""
            for log in task.log_list:
                log_string += log.log_timestamp.strftime("%d.%m.%y")
                log_string += " | " + log.log_msg 
                log_string += " | " + log.user.usr_name + "<br><hr>"

            # Daten ersetzen
            html = html.replace(
                "Laufzettel_html_425b1b1f96f73285.png",
                "/api/printout_logo")
            html = html.replace("Vorname", task.customer.cus_first_name)
            html = html.replace("Name", task.customer.cus_last_name)
            html = html.replace("Telefonnummer", task.customer.cus_phone_no)
            html = html.replace("E-Mail", task.customer.cus_email)
            html = html.replace("A-Dat", task.tsk_creation_date.strftime("%d.%m.%y"))
            html = html.replace("B-Dat", b_dat)
            html = html.replace("R-Nr", tsk_id)
            html = html.replace("Bez", task.device.dev_name)
            html = html.replace("Her", task.device.dev_mnf_name)
            html = html.replace("Mod", task.device.dev_model)
            #html = html.replace("Zub", task.device.dev_mnf_name)
            html = html.replace("Fehler", task.tsk_fault_description)
            html = html.replace("Protokoll", log_string)
            
        return html
    else:
        return """Keine Berechtigung!"""


@bp.route('/api/printout_logo', methods=['GET'])
def printout_logo():
    path = Path(current_app.root_path)
    filename = str(path.parent.absolute()) + "/templates/Laufzettel_html_425b1b1f96f73285.png"
    return send_file(filename, mimetype='image/png')