import pytest
from api import create_app
from api.config import TestConfig
from api import db


@pytest.fixture
def app():
    """Create app instance for tests."""
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()
    

    yield app