import os
from dotenv import load_dotenv
from pathlib import Path


APP_BASEDIR = Path(__file__).parents[1]
ENV_FILE = Path(APP_BASEDIR, ".env")

if ENV_FILE.exists():
    load_dotenv(ENV_FILE)
    print("LOADED:", ENV_FILE)
else:
    print("WARNING: No .env file found.")


class Config(object):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']

    UPLOAD_FOLDER = Path(APP_BASEDIR, "public/images")
    ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif"}

