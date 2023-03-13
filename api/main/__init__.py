from flask import Blueprint
#test
bp = Blueprint("main", __name__)

from api.main import routes, settings