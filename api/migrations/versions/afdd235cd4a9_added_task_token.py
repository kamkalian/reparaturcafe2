"""Added task token

Revision ID: afdd235cd4a9
Revises: ab83e7074ba8
Create Date: 2021-02-03 18:31:19.816013

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'afdd235cd4a9'
down_revision = 'ab83e7074ba8'
branch_labels = None
depends_on = None


def upgrade():
    pass
    # ### commands auto generated by Alembic - please adjust! ###
    # op.add_column('task', sa.Column('tsk_token', sa.String(length=255), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    pass
    # ### commands auto generated by Alembic - please adjust! ###
    # op.drop_column('task', 'tsk_token')
    # ### end Alembic commands ###
