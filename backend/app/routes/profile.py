from flask import Blueprint, request, jsonify
from functools import wraps
from app import db
from app.models import User, Profile
from app.utils.auth import decode_token

profile_bp = Blueprint('profile', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        user_id = decode_token(token)
        if isinstance(user_id, str):
            return jsonify({'message': user_id}), 401

        current_user = User.query.get(user_id)
        if not current_user:
            return jsonify({'message': 'User not found!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated

@profile_bp.route('/', methods=['GET'])
@token_required
def get_profile(current_user):
    profile = Profile.query.filter_by(user_id=current_user.id).first()
    
    profile_data = {
        'name': current_user.name,
        'bio': profile.bio if profile else None,
        'photo': profile.photo_url if profile else None,
        'offered_skills': profile.offered_skills.split(',') if profile and profile.offered_skills else [],
        'required_skills': profile.required_skills.split(',') if profile and profile.required_skills else [],
        'availability': profile.availability if profile else None
    }

    return jsonify(profile_data)

@profile_bp.route('/', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    profile = Profile.query.filter_by(user_id=current_user.id).first()

    if not profile:
        profile = Profile(user_id=current_user.id)
        db.session.add(profile)

    profile.bio = data.get('bio', profile.bio)
    profile.photo_url = data.get('photo', profile.photo_url)
    profile.availability = data.get('availability', profile.availability)

    if 'offered_skills' in data and isinstance(data['offered_skills'], list):
        profile.offered_skills = ','.join(data['offered_skills'])
    
    if 'required_skills' in data and isinstance(data['required_skills'], list):
        profile.required_skills = ','.join(data['required_skills'])

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})
