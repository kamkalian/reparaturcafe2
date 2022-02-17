from json.decoder import JSONDecodeError
from api.main import bp
import yaml
from pathlib import Path
from flask import current_app, jsonify
from api.main.auth import _is_granted
from flask import request
import os
import subprocess


@bp.route('/api/label_printer_settings', methods=['POST'])
def label_printer_settings():
    config = settings_from_file()

    return jsonify(config["label_printer"])


@bp.route('/api/label_printer_save_settings', methods=['POST'])
def label_printer_save_settings():
    path = Path(current_app.root_path)
    resp = {}
    resp["state"] = "error"
    if request.method == "POST":
        post_json = request.get_json()
        config = {}

        if "host" in post_json:
            config["host"] = post_json["host"]
        if "user" in post_json:
            config["user"] = post_json["user"]
        if "qr_code_path" in post_json:
            config["qr_code_path"] = post_json["qr_code_path"]
        if "ssh_key" in post_json:
            if post_json["ssh_key"] != "":
                bashCommand = "echo -n '" + post_json["ssh_key"] + "' > lp_key | chmod 600 lp_key"
                os.system(bashCommand)
        
        save_settings(config)

        resp["state"] = "success"

    return jsonify(resp)


@bp.route('/api/label_printer_ping_test', methods=['POST'])
def label_printer_ping_test():
    resp = {}

    settings = settings_from_file()
    
    resp["ping_result"], resp["severity"] = ping(settings["label_printer"]["host"])

    return jsonify(resp)


def settings_from_file():
    path = Path(current_app.root_path)
    config = ""
    if _is_granted:
        with open(str(path.parent.absolute()) + '/config.yaml', 'r') as f:
            try:
                config = yaml.safe_load(f)
            except yaml.YAMLError as e:
                print(e)
    return config


def save_settings(conf_dict):
    if _is_granted:
        path = Path(current_app.root_path)
        config = settings_from_file()

        if "host" in conf_dict:
            config["label_printer"]["host"] = conf_dict["host"]
        if "user" in conf_dict:
            config["label_printer"]["user"] = conf_dict["user"]
        if "qr_code_path" in conf_dict:
            config["label_printer"]["qr_code_path"] = conf_dict["qr_code_path"]

        with open(str(path.parent.absolute()) + '/config.yaml', 'w') as f:
            try:
                data = yaml.dump(config, f)
            except yaml.YAMLError as e:
                print(e)


def ping(host):
    resp = {}

    try:
        resp = subprocess.check_output(["ping", "-c", "1", host])
        resp = resp.decode("utf-8")
        return resp, "info"
        
    except subprocess.CalledProcessError:
        resp = "Host not found :("
        return resp, "error"

    