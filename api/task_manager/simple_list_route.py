from flask import jsonify
from api.models import Task, Customer, Device, State
from api.task_manager import bp
from datetime import datetime


@bp.route('/api/simple_list', methods=['GET'])
def simple_list():
    resp = {}

    tasks = Task.query
    tasks = tasks.filter(Task.tsk_state!="close").order_by(Task.tsk_id.asc()).all()
    task_list = []
    for d in tasks:

        dev_name = ""
        if d.device:
            dev_name = d.device.dev_name

        task_list.append(
            {
                "id": d.tsk_id,
                "creationDate": d.tsk_creation_date.strftime("%d.%m.%Y"),
                "deviceName": dev_name,
            }
        )
    return jsonify({
        'task_list':task_list})