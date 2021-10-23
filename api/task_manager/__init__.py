from flask import Blueprint


bp = Blueprint("task_manager", __name__)

from api.task_manager import routes