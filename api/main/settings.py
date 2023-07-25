from json.decoder import JSONDecodeError
from api.main import bp
import yaml
from pathlib import Path
from flask import current_app, jsonify
from api.main.auth import _is_granted
from flask import request
import os
import subprocess


def settings_from_file():
    path = Path(current_app.root_path)
    config = ""
    if _is_granted:
        try:
            with open(str(path.parent.absolute()) + '/config.yaml', 'r') as f:
                try:
                    config = yaml.safe_load(f)
                except yaml.YAMLError as e:
                    print(e)
        except FileNotFoundError as e:
            print(e)
    return config


def save_settings(conf_dict):
    if _is_granted:
        path = Path(current_app.root_path)
        config = settings_from_file()

        with open(str(path.parent.absolute()) + '/config.yaml', 'w') as f:
            try:
                data = yaml.dump(config, f)
            except yaml.YAMLError as e:
                print(e)

    