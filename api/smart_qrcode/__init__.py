from flask import Blueprint


bp = Blueprint("smart_qrcode", __name__)

from api.smart_qrcode import routes