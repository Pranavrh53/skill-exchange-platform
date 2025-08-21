# backend/app/routes/profile.py
from flask import Blueprint, request, jsonify
from functools import wraps
from app import db
from app.models import User, Profile
from app.utils.auth import decode_token

profile_bp = Blueprint('profile', __name__)

# ------------------ Auth Decorator ------------------
# Updated token_required decorator for profile.py
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]
        if not token:
            print("DEBUG: No token found in headers")
            return jsonify({'message': 'Token is missing!'}), 401
        print(f"DEBUG: Token received: {token[:10]}...")  # Log first 10 chars of token
        
        try:
            user_id = decode_token(token)
            print(f"DEBUG: Decoded user_id: {user_id} (type: {type(user_id)})")
            
            # Check if decode_token returned an error message
            error_messages = [
                'Token expired. Please log in again.',
                'Invalid token. Please log in again.'
            ]
            
            if isinstance(user_id, str) and any(error_msg in user_id for error_msg in error_messages):
                print(f"DEBUG: Token validation error: {user_id}")
                return jsonify({'message': user_id}), 401
                
        except Exception as e:
            print(f"DEBUG: Exception in token validation: {str(e)}")
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 401

        try:
            # Convert user_id to int (handle both string and int cases)
            if isinstance(user_id, str):
                uid = int(user_id)
            else:
                uid = user_id
            print(f"DEBUG: Converted user_id to int: {uid}")
        except (TypeError, ValueError) as e:
            print(f"DEBUG: Failed to convert user_id to int: {e}")
            return jsonify({'message': 'Invalid token subject.'}), 401

        current_user = User.query.get(uid)
        if not current_user:
            print(f"DEBUG: User not found with id: {uid}")
            return jsonify({'message': 'User not found!'}), 401

        print(f"DEBUG: Authentication successful for user_id: {uid}")
        return f(current_user, *args, **kwargs)
    return decorated
# ------------------ Routes ------------------

@profile_bp.route('/', methods=['GET'])
@token_required
def get_profile(current_user):
    profile = current_user.profile
    if not profile:
        return jsonify({'message': 'Profile not found for this user.'}), 404

    return jsonify({
        'name': current_user.name,
        'email': current_user.email,
        'bio': profile.bio,
        'photo_url': profile.photo_url,
        'offered_skills': profile.offered_skills.split(',') if profile.offered_skills else [],
        'required_skills': profile.required_skills.split(',') if profile.required_skills else [],
        'availability': profile.availability,
        'location': profile.location
    })

@profile_bp.route('/', methods=['POST', 'PUT'])
@token_required
def manage_profile(current_user):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is empty'}), 400

    profile = current_user.profile
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.session.add(profile)

    profile.bio = data.get('bio', profile.bio)
    profile.photo_url = data.get('photo_url', profile.photo_url)
    profile.availability = data.get('availability', profile.availability)
    profile.location = data.get('location', profile.location)

    if 'offered_skills' in data and isinstance(data['offered_skills'], list):
        profile.offered_skills = ','.join(data['offered_skills'])
    
    if 'required_skills' in data and isinstance(data['required_skills'], list):
        profile.required_skills = ','.join(data['required_skills'])

    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})

@profile_bp.route('/status', methods=['GET'])
@token_required
def get_profile_status(current_user):
    """Check if a user has a profile."""
    profile = Profile.query.filter_by(user_id=current_user.id).first()
    if profile:
        return jsonify({'has_profile': True})
    return jsonify({'has_profile': False})
