# pylint: disable=no-member
from api import db


class Task(db.Model):
    """Table fo tasks"""
    __tablename__ = "task"
    tsk_id = db.Column(db.Integer, primary_key=True)
    tsk_fault_description = db.Column(db.String(1000))
    tsk_creation_date = db.Column(db.DateTime())
    tsk_state = db.Column(db.String(64), db.ForeignKey("state.sta_name"))
    tsk_next_step = db.Column(db.String(64), db.ForeignKey("step.ste_name"))
    #tsk_hash_token = db.Column(db.String(255), nullable=False)

    tsk_cus_id = db.Column(db.Integer(), db.ForeignKey("customer.cus_id"))
    tsk_dev_id = db.Column(db.Integer(), db.ForeignKey("device.dev_id"))
    tsk_supervisor_usr_id = db.Column(db.Integer(), db.ForeignKey("user.usr_id"))

    tsk_acc_name = db.Column(db.String(255), db.ForeignKey("accessory.acc_name"))

    hash_tokens = db.relationship('HashToken', backref='task', lazy=True)


class Customer(db.Model):
    """Table fo customers"""
    __tablename__ = "customer"
    cus_id = db.Column(db.Integer, primary_key=True)
    cus_title = db.Column(db.String(64), index=True, nullable=True)
    cus_first_name = db.Column(db.String(255), index=True, nullable=True)
    cus_last_name = db.Column(db.String(255), index=True, nullable=True)
    cus_email = db.Column(db.String(255), index=True, nullable=True)
    cus_phone_no = db.Column(db.String(255), index=True, nullable=True)
    cus_street = db.Column(db.String(255), index=True, nullable=True)
    cus_house_number = db.Column(db.String(64), index=True, nullable=True)
    cus_post_code = db.Column(db.String(64), index=True, nullable=True)
    cus_awo_member = db.Column(db.Boolean(), nullable=False, server_default="0")

    tasks = db.relationship('Task', backref='customer', lazy=True)


class Device(db.Model):
    """Table fo devices"""
    __tablename__ = "device"
    dev_id = db.Column(db.Integer, primary_key=True)
    dev_name = db.Column(db.String(255), index=True, nullable=True)
    dev_model = db.Column(db.String(255), index=True, nullable=True)
    dev_category = db.Column(db.String(64), index=True, nullable=True)
    dev_electronic_mechanical_type = db.Column(db.String(64), index=True, nullable=True)

    dev_mnf_name = db.Column(db.String(255))

    tasks = db.relationship('Task', backref='device', lazy=True)


class Manufacturer(db.Model):
    """Table fo manufacturers"""
    __tablename__ = "manufacturer"
    mnf_name = db.Column(db.String(255), primary_key=True)

    #devices = db.relationship('Device', backref='manufacturer', lazy=True)


class Accessory(db.Model):
    """Table fo accessories"""
    __tablename__ = "accessory"
    acc_name = db.Column(db.String(255), primary_key=True)


class Log(db.Model):
    """Table fo logs"""
    __tablename__ = "log"
    log_id = db.Column(db.Integer, primary_key=True)
    log_type = db.Column(db.String(64), index=True, nullable=True)
    log_msg = db.Column(db.String(1000), nullable=True)
    log_timestamp = db.Column(db.DateTime(), nullable=False)

    log_usr_id = db.Column(db.Integer(), db.ForeignKey("user.usr_id"))
    log_tsk_id = db.Column(db.Integer(), db.ForeignKey("task.tsk_id"))


class Image(db.Model):
    """Table fo images"""
    __tablename__ = "image"
    img_id = db.Column(db.Integer, primary_key=True)
    img_filename = db.Column(db.String(255), index=True, nullable=False)

    img_tsk_id = db.Column(db.Integer(), db.ForeignKey("task.tsk_id"))


class User(db.Model):
    """Table fo users"""
    __tablename__ = "user"
    usr_id = db.Column(db.Integer, primary_key=True)
    usr_name = db.Column(db.String(64), index=True, unique=True)
    usr_email = db.Column(db.String(255), index=True, unique=True)
    usr_email_confirmed_at = db.Column(db.DateTime(), nullable=True)
    
    usr_phone = db.Column(db.String(64), index=True)
    usr_role = db.Column(db.String(64), index=True)

    usr_hash_tokens = db.relationship('HashToken', backref='user', lazy=True)

    def __repr__(self):
        return '<User {}>'.format(self.usr_name)    


class UserCategory(db.Model):
    """Table fo user categories"""
    __tablename__ = "usercategory"
    uct_id = db.Column(db.Integer, primary_key=True)
    uct_category_name = db.Column(db.String(64), index=True, unique=True)

    uct_usr_id = db.Column(db.Integer(), db.ForeignKey("user.usr_id"))


class State(db.Model):
    """Table fo states"""
    __tablename__ = "state"
    sta_name = db.Column(db.String(64), primary_key=True, nullable=False)
    sta_caption = db.Column(db.String(255))


class Step(db.Model):
    """Table fo steps"""
    __tablename__ = "step"
    ste_name = db.Column(db.String(64), primary_key=True, nullable=False)
    ste_caption = db.Column(db.String(255))


class Category(db.Model):
    """Table fo categories"""
    __tablename__ = "category"
    cat_name = db.Column(db.String(64), primary_key=True, nullable=False)


class HashToken(db.Model):
    """Table for hash tokens."""
    __tablename__ = "hashtoken"
    htk_id = db.Column(db.String(255), primary_key=True, nullable=False)
    htk_tsk_id = db.Column(db.Integer(), db.ForeignKey("task.tsk_id"))
    htk_usr_id = db.Column(db.Integer(), db.ForeignKey("user.usr_id"))
    htk_locked = db.Column(db.Boolean(), nullable=False, server_default="0")
    htk_auth = db.Column(db.String(64))
    htk_pin = db.Column(db.String(255))
    htk_creation_date = db.Column(db.DateTime())
