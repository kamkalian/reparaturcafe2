from flask import Flask
from api.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=None):
    """Create app instance."""
    app = Flask(__name__)
    if config_class is None:
        app.config.from_object(Config)
    else:
        app.config.from_object(config_class)
    app.app_context().push

    db.init_app(app)
    migrate.init_app(app)

    from api.task_manager import bp as task_manager
    app.register_blueprint(task_manager)

    from api.smart_qrcode import bp as smart_qrcode
    app.register_blueprint(smart_qrcode)

    return app