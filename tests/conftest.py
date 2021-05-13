import pytest
from api import create_app
from api.config import TestConfig


@pytest.fixture
def app():
    """Create app instance for tests."""
    app = create_app(TestConfig)

    

    yield app