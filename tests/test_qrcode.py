import pytest
import json
from api.models import User, HashToken
from api import db


@pytest.mark.parametrize(
    "qrcodes", [
        {
            "qrcode": "tsvGICeBTQ4VG3Xckiq1bEyAGYbiGrP8CvsuO12re7UjL",
            "qrcode_valid": False
        },
        {
            "qrcode": "tskGICeBTQ4VG3Xckiq1bEyAGYbiGrP8CvsuO12re7UjLk",
            "qrcode_valid": True,
            "type": "task"
        },
        {
            "qrcode": "usrGICeBTQ4VG3Xckiq1bEyAGYbiGrP8CvsuO12re7UjLk",
            "qrcode_valid": True,
            "type": "user"
        },
    ]
)
def test_qrcodes(app, client, qrcodes):
    result = client.post(
        "/api/qrcode",
        json={'qrcode': qrcodes["qrcode"]},
        headers={'Content-Type': 'application/json'}
    )
    assert result.json["qrcode_valid"] == qrcodes["qrcode_valid"]    
    if "type" in qrcodes:
        assert result.json["type"] == qrcodes["type"]

    
@pytest.mark.parametrize(
    "qrcodes", [
        {
            "qrcode": "usrETZ6obiJMOn8NMWe67TwForQgwwbCS4peAddQ3NdSY4",
            "qrcode_valid": True,
            "action": "show_task",
            "hash_token": "421996bbf0dd0eb7cf39bbe78581197a52b7ef9eaa2e2a9b2f934ced1a156618",
            "role": "admin"
        }
    ]
)
def test_user_qrcodes(app, client, qrcodes):
    user = User(usr_role=qrcodes["role"])
    db.session.add(user)
    db.session.commit()

    htk = HashToken(htk_id=qrcodes['hash_token'], htk_usr_id=1)
    db.session.add(htk)
    db.session.commit()

    result = client.post(
        "/api/qrcode",
        json={'qrcode': qrcodes["qrcode"]},
        headers={'Content-Type': 'application/json'}
    )
    print(result.json)
    assert result.json['usr_id'] == 1
    assert result.json['usr_role'] == qrcodes["role"]