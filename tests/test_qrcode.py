import pytest
import json



@pytest.mark.parametrize(
    "qrcodes", [
        {
            "qrcode": "tsvGICeBTQ4VG3Xckiq1bEyAGYbiGrP8CvsuO12re7UjL",
            "qrcode_valid": False
        },
        {
            "qrcode": "tskGICeBTQ4VG3Xckiq1bEyAGYbiGrP8CvsuO12re7UjLk",
            "qrcode_valid": True,
            "action": "show_task"
        },
        {
            "qrcode": "usrGICeBTQ4VG3Xckiq1bEyAGYbiGrP8CvsuO12re7UjLk",
            "qrcode_valid": True,
            "action": "show_user"
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
    if "action" in qrcodes:
        assert result.json["action"] == qrcodes["action"]