
from pathlib import Path
from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw 
from datetime import datetime
from flask import current_app
from api.models import HashToken
from api.main.token import hashed_token
from api.main.settings import settings_from_file
import pyqrcode
import os


def generate_qrcode_label(type, tsk_id, token):
    # type prüfen
    prefix = ""
    if type == "customer":
        prefix = "tsk"
    if type == "device":
        prefix = "tsk"
    if type == "user":
        prefix = "usr"

    path = Path(current_app.root_path)
    image_file = str(path.parent.absolute()) + '/qr_codes/' + token + '.png'
    image_file_qrcode_only = str(path.parent.absolute()) + '/qr_codes/' + token + '_qrcode_only.png'
    url = pyqrcode.create('https://reparaturcafe.awo-oberlar.de/qrcode/' + prefix + token, error='L')
    url.png(image_file_qrcode_only, scale=3)

    qr_code_image = Image.open(image_file_qrcode_only, "r")
    new_qr_code_image = Image.new("1", (300,150), 1)
    new_qr_code_image.paste(qr_code_image, (10, 5))
    draw = ImageDraw.Draw(new_qr_code_image)
    id_font = ImageFont.truetype("AWOFagoOffice.ttf", 40)
    oher_font = ImageFont.truetype("AWOFagoOffice.ttf", 20)
    draw.text((150, 15),"ID: " + str(tsk_id), font=id_font)
    draw.text((150, 60), datetime.now().strftime("%d.%m.%Y"), font=oher_font)
    draw.text((150, 80), "Reparaturcafe", font=oher_font)
    draw.text((150, 100), "AWO Oberlar", font=oher_font)
    new_qr_code_image.save(image_file)

    return image_file


def print_label(token):
    htk = HashToken.query.filter_by(htk_id=hashed_token(token)).first()
    if htk or token == "test":
        print("label wird gedruckt...")
        path = Path(current_app.root_path)
        pi_settings = settings_from_file()["label_printer"]
        # print(pi_settings)
        image_file = str(path.parent.absolute()) + '/qr_codes/' + token + '.png'
        bashCommand = "scp -i "
        bashCommand += str(path.parent.absolute()) + "/api/lp_key "
        bashCommand += image_file + " "+ pi_settings['user'] + "@" + pi_settings['host'] + ":" + pi_settings['qr_code_path']
        # print(bashCommand)
        os.system(bashCommand)