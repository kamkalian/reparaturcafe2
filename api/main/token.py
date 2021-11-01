from datetime import datetime
from api.models import HashToken
from api import db
import secrets
import hashlib


def generate_token(type, tsk_id):
    # type prüfen
    htk_auth = ""
    if type == "customer":
        htk_auth = "cus"
    if type == "device":
        htk_auth = "dev"
    if type == "user":
        htk_auth = "usr"

    # Ein Token wird generiert, damit kann später der Task zum bearbeiten
    # vom User geöffnet werden.
    token = secrets.token_urlsafe(32)

    # Der Token soll so nicht in der Datenbank gespeichert werden,
    # daher wir hier noch eine gehashete Version generiert.
    hash_token = hashlib.sha256(token.encode("utf-8")).hexdigest()

    # Hash Token mit Task zuordnung anlegen
    htk = HashToken(
        htk_id=hash_token,
        htk_creation_date=datetime.now(),
        htk_tsk_id=tsk_id,
        htk_auth=htk_auth)

    db.session.add(htk) # pylint: disable=maybe-no-member
    db.session.commit() # pylint: disable=maybe-no-member

    return token