"""Fixed accesory list

Revision ID: 8c3efa20608d
Revises: 7e49bad45715
Create Date: 2022-03-13 17:33:26.905502

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '8c3efa20608d'
down_revision = '7e49bad45715'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('accessory', sa.Column('acc_id', sa.Integer(), nullable=False))
    op.add_column('accessory', sa.Column('acc_tsk_id', sa.Integer(), nullable=True))
    op.alter_column('accessory', 'acc_name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=True)
    op.create_foreign_key(None, 'accessory', 'task', ['acc_tsk_id'], ['tsk_id'])
    op.drop_index('ix_task_tsk_next_step', table_name='task')
    op.drop_index('ix_task_tsk_state', table_name='task')
    op.drop_constraint('task_ibfk_1', 'task', type_='foreignkey')
    op.create_foreign_key(None, 'task', 'step', ['tsk_next_step'], ['ste_name'])
    op.create_foreign_key(None, 'task', 'state', ['tsk_state'], ['sta_name'])
    op.drop_column('task', 'tsk_acc_name')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('task', sa.Column('tsk_acc_name', mysql.VARCHAR(length=255), nullable=True))
    op.drop_constraint(None, 'task', type_='foreignkey')
    op.drop_constraint(None, 'task', type_='foreignkey')
    op.create_foreign_key('task_ibfk_1', 'task', 'accessory', ['tsk_acc_name'], ['acc_name'])
    op.create_index('ix_task_tsk_state', 'task', ['tsk_state'], unique=False)
    op.create_index('ix_task_tsk_next_step', 'task', ['tsk_next_step'], unique=False)
    op.drop_constraint(None, 'accessory', type_='foreignkey')
    op.alter_column('accessory', 'acc_name',
               existing_type=mysql.VARCHAR(length=255),
               nullable=False)
    op.drop_column('accessory', 'acc_tsk_id')
    op.drop_column('accessory', 'acc_id')
    # ### end Alembic commands ###
