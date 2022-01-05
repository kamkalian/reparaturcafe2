from json.decoder import JSONDecodeError
from api.main import bp
import yaml
from pathlib import Path
from flask import current_app, jsonify
from api.main.auth import _is_granted



@bp.route('/api/label_printer_settings', methods=['POST', 'GET'])
def label_printer_settings():
    config = lp_settings_from_file()
    return jsonify(config)


def lp_settings_from_file():
    path = Path(current_app.root_path)
    config = ""
    if _is_granted:
        with open(str(path.parent.absolute()) + '/config.yaml', 'r') as f:
            try:
                config = yaml.safe_load(f)
            except yaml.YAMLError as e:
                print(e)
    return config["label_printer"]