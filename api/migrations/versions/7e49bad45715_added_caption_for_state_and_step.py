"""Added caption for state and step

Revision ID: 7e49bad45715
Revises: 82d78d5b49a0
Create Date: 2021-10-23 15:16:49.636181

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7e49bad45715'
down_revision = '82d78d5b49a0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('state', sa.Column('sta_caption', sa.String(length=255), nullable=True))
    op.add_column('step', sa.Column('ste_caption', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('step', 'ste_caption')
    op.drop_column('state', 'sta_caption')
    # ### end Alembic commands ###