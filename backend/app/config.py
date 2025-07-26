# backend/app/config.py
import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env file from project root (parent directory)
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.environ.get('MYSQL_USER')}:"
        f"{os.environ.get('MYSQL_PASSWORD')}@"
        f"{os.environ.get('MYSQL_HOST')}/"
        f"{os.environ.get('MYSQL_DB')}"
    )
    print(f"Database URI: {SQLALCHEMY_DATABASE_URI}")  # Debug output
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')