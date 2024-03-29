from flask import Flask
from api.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_session import Session
from flask_wtf.csrf import CSRFProtect

db = SQLAlchemy()
migrate = Migrate()
session = Session()
csrf = CSRFProtect()

def create_app(config_class=None):
    """Create app instance."""
    app = Flask(__name__)
    if config_class is None:
        app.config.from_object(Config)
    else:
        app.config.from_object(config_class)
    app.app_context().push

    db.init_app(app)
    migrate.init_app(app, db)
    session.init_app(app)
    csrf.init_app(app)

    from api.main import bp as main
    app.register_blueprint(main)

    from api.task_manager import bp as task_manager
    app.register_blueprint(task_manager)

    from api.smart_qrcode import bp as smart_qrcode
    app.register_blueprint(smart_qrcode)

    from api.user_manager import bp as user_manager
    app.register_blueprint(user_manager)

    return app