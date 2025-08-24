from flask_httpauth import HTTPTokenAuth
from app.models import User
from app import db

token_auth = HTTPTokenAuth(scheme='Bearer')

@token_auth.verify_token
def verify_token(token):
    if not token:
        return None
    user = User.verify_auth_token(token)
    if not user:
        return None
    return user

@token_auth.get_user_roles
def get_user_roles(user):
    return []

def init_app(app):
    pass
