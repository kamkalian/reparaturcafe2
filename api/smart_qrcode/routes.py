import time
from api.smart_qrcode import bp
from flask import request, jsonify, url_for
from api.models import Task, Customer, Device, Image


@bp.route('/api/qrcode/<token>', methods=['POST', 'GET'])
def get_current_time(token):
    return jsonify({'time': time.time()})

