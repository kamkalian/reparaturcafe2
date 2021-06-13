from api import create_app
from api import db
from api.models import HashToken, User
from datetime import datetime
import secrets
import hashlib
import random

app = create_app()


def _generate_and_add_hashtoken(usr_id):
    # Ein Token wird generiert, damit kann später der Task zum bearbeiten
    # vom User geöffnet werden.
    token = secrets.token_urlsafe(64)

    # Der Token soll so nicht in der Datenbank gespeichert werden,
    # daher wir hier noch eine gehashete Version generiert.
    hash_token = hashlib.sha256(token.encode("utf-8")).hexdigest()

    # Zufallszahl für den Pin ermitteln
    pin = random.randint(1000, 9999)
    hash_pin = hashlib.sha256(str(pin).encode("utf-8")).hexdigest()

    htk = HashToken(
        htk_id=hash_token,
        htk_usr_id=usr_id,
        htk_creation_date=datetime.now(),
        htk_auth="usr",
        htk_pin=hash_pin
    )
    db.session.add(htk)
    db.session.commit()

    return token, pin

def _valid_hash_token_exists(usr_id):
    user = User.query.filter_by(usr_id=usr_id).first()
    for htk in user.usr_hash_tokens:
        if htk.htk_locked is False:
            return True
    return False


with app.app_context():
    print(" ")
    print(" ")
    user_list = User.query.all()
    
    if len(user_list) > 0:
        print("Welcher User soll Admin Berechtigung bekommen?")
        for user in user_list:
            print(user.usr_id, user.usr_name, user.usr_role)#
            
        userid = input("User ID (leer=Abbruch):")
        if userid != "":
            if [d for d in user_list if d.usr_id == int(userid)]:
                user = User.query.filter_by(usr_id=userid).first()
                user.usr_role = "admin"
                db.session.commit()
                
                print("Rolle wurde geändert.")

                if _valid_hash_token_exists(user.usr_id) is not True:
                    print(" ")
                    print("User hat keinen gültigen Key, daher wird jetzt einer generiert...")
                    token, pin = _generate_and_add_hashtoken(user.usr_id)
                    print("usr" + token)
                    print("Pin:", pin)
            else:
                print("Fehler! User ID wurde nicht gefunden!")

    else:
        print("Es ist kein User in der Datenbank vorhanden.")
        print("Ein neuer User wird angelegt...")

        print(" ")
        username = input("Username(leer=Abbruch):")
        email = input("Email:")
        if username != "" and email != "":
            user = User(usr_name=username, usr_email=email, usr_role="admin")
            db.session.add(user)
            db.session.commit()

            print("User wurde angelegt.")
            if _valid_hash_token_exists(user.usr_id) is not True:
                print(" ")
                print("User hat keinen gültigen Key, daher wird jetzt einer generiert...")
                token = _generate_and_add_hashtoken(user.usr_id)
                print("usr" + token)
        else:
            print("Abbruch.")
            quit()



