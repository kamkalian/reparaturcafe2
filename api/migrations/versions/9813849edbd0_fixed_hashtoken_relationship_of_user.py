"""Fixed hashtoken relationship of user

Revision ID: 9813849edbd0
Revises: cce4f0ae82e7
Create Date: 2021-05-21 17:25:03.105275

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '9813849edbd0'
down_revision = 'cce4f0ae82e7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'usr_hash_token')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('usr_hash_token', mysql.VARCHAR(length=255), nullable=False))
    # ### end Alembic commands ###