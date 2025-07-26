# backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from .config import Config

db = SQLAlchemy()
migrate = Migrate()
bcrypt = Bcrypt()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    CORS(app)

    # Import models to register with SQLAlchemy
    try:
        from app.models import user, profile, portfolio, barter_session, message
    except ImportError as e:
        print(f"Error importing models: {e}")

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.profile import profile_bp
    from .routes.portfolio import portfolio_bp
    from .routes.matching import matching_bp
    from .routes.chat import chat_bp
    from .routes.sessions import sessions_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')
    app.register_blueprint(portfolio_bp, url_prefix='/api/portfolio')
    app.register_blueprint(matching_bp, url_prefix='/api/matches')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(sessions_bp, url_prefix='/api/sessions')

    # Import models to ensure they are registered with SQLAlchemy
    from . import models
    
    # Create tables if they don't exist
    with app.app_context():
        db.create_all()

    return app