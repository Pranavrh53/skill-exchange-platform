from flask import Blueprint, jsonify, g, request
from app import db
from app.models import User, Skill
from app.auth import token_auth

bp = Blueprint('users', __name__)

@bp.route('/api/users', methods=['GET'])
@token_auth.login_required
def get_users():
    """
    Get all users with their skills
    """
    current_user = g.current_user
    
    # Get query parameters for filtering
    search = request.args.get('search', '')
    
    # Base query
    query = User.query.filter(User.id != current_user.id)
    
    # Apply search filter
    if search:
        search = f"%{search}%"
        query = query.filter(
            (User.name.ilike(search)) | 
            (User.bio.ilike(search) if hasattr(User, 'bio') else False) |
            (User.offered_skills.any(Skill.name.ilike(search))) |
            (User.required_skills.any(Skill.name.ilike(search)))
        )
    
    users = query.all()
    
    # Format the response
    result = []
    for user in users:
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'bio': user.bio if hasattr(user, 'bio') else '',
            'photo_url': user.photo_url if hasattr(user, 'photo_url') else None,
            'location': user.location if hasattr(user, 'location') else '',
            'offered_skills': [{
                'id': skill.id,
                'name': skill.name
            } for skill in user.offered_skills],
            'required_skills': [{
                'id': skill.id,
                'name': skill.name
            } for skill in user.required_skills]
        }
        result.append(user_data)
    
    return jsonify(result)

@bp.route('/api/users/<int:user_id>', methods=['GET'])
@token_auth.login_required
def get_user(user_id):
    """
    Get a user's profile by ID
    """
    # Get the requested user
    user = User.query.get_or_404(user_id)
    
    # Get offered skills
    offered_skills = db.session.query(Skill).join(
        'users_offering',
        User.offered_skills
    ).filter(
        User.id == user_id
    ).all()
    
    # Get requested skills
    required_skills = db.session.query(Skill).join(
        'users_requiring',
        User.required_skills
    ).filter(
        User.id == user_id
    ).all()
    
    # Format the response
    user_data = {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'bio': user.bio if hasattr(user, 'bio') else '',
        'photo_url': user.photo_url if hasattr(user, 'photo_url') else None,
        'location': user.location if hasattr(user, 'location') else '',
        'availability': user.availability if hasattr(user, 'availability') else '',
        'offered_skills': [{
            'id': skill.id,
            'name': skill.name
        } for skill in offered_skills],
        'required_skills': [{
            'id': skill.id,
            'name': skill.name
        } for skill in required_skills]
    }
    
    return jsonify(user_data)
