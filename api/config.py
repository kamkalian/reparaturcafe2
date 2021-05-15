import os
from dotenv import load_dotenv
from pathlib import Path
from formelsammlung.envvar import getenv_typed
import datetime


APP_BASEDIR = Path(__file__).parents[1]
ENV_FILE = Path(APP_BASEDIR, ".env")

if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
    print("LOADED:", ENV_FILE)
else:
    print("WARNING: No .env file found.")


class Config():
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']

    UPLOAD_FOLDER = Path(APP_BASEDIR, "public/images")
    ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif"}

    JWT_SECRET_KEY = getenv_typed("JWT_SECRET_KEY", "Dies ist ein Dummy Key")
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_ACCESS_COOKIE_PATH = "/api/"
    JWT_REFRESH_COOKIE_PATH = "/token/refresh"
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=5)
    

class TestConfig():
    TESTING = True
    SECRET_KEY = getenv_typed("SECRET_KEY", "fddsakdljdsanbfeilufh")
    SQLALCHEMY_DATABASE_URI = getenv_typed("DATABASE_URL", "sqlite://")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
