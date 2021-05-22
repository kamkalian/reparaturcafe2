from flask import Blueprint


bp = Blueprint("user_manager", __name__)

from api.user_manager import routes