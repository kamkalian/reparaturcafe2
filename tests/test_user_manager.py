import pytest
import json
from api.models import User
from api import db


def test_no_admin_available(app, client):
    result = client.post(
        "/api/admin_available",
        headers={'Content-Type': 'application/json'}
    )
    assert result.json['admin_available'] == False


def test_admin_available(app, client):

    user = User(usr_role="admin")
    db.session.add(user)
    db.session.commit()

    result = client.post(
        "/api/admin_available",
        headers={'Content-Type': 'application/json'}
    )
    assert result.json['admin_available'] == True