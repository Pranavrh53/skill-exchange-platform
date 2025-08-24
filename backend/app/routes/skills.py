from flask import Blueprint, jsonify, g
from app import db
from app.auth import token_auth
from app.models import Skill, User, user_offered_skills, user_required_skills

bp = Blueprint('skills', __name__, url_prefix='/api/skills')

@bp.route('', methods=['GET'])
def get_skills():
    """
    Get all available skills with user counts
    """
    skills = db.session.query(
        Skill.id,
        Skill.name,
        db.func.count(user_offered_skills.c.user_id).label('user_count')
    ).outerjoin(
        user_offered_skills, user_offered_skills.c.skill_id == Skill.id
    ).group_by(Skill.id).all()
    
    return jsonify([{
        'id': skill.id,
        'name': skill.name,
        'user_count': skill.user_count
    } for skill in skills])

@bp.route('/<int:skill_id>/users', methods=['GET'])
@token_auth.login_required
def get_users_by_skill(skill_id):
    """
    Get all users who have a specific skill
    """
    # Get the current user
    current_user = g.current_user
    
    # Get users who have this skill as an offered skill and are not the current user
    users = User.query.join(
        user_offered_skills, user_offered_skills.c.user_id == User.id
    ).filter(
        user_offered_skills.c.skill_id == skill_id,
        User.id != current_user.id
    ).all()
    
    # Get each user's offered and requested skills
    result = []
    for user in users:
        # Get offered skills
        offered_skills = db.session.query(Skill).join(
            user_offered_skills, user_offered_skills.c.skill_id == Skill.id
        ).filter(
            user_offered_skills.c.user_id == user.id
        ).all()
        
        # Get requested skills
        requested_skills = db.session.query(Skill).join(
            user_required_skills, user_required_skills.c.skill_id == Skill.id
        ).filter(
            user_required_skills.c.user_id == user.id
        ).all()
        
        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'bio': user.bio,
            'location': user.location,
            'photo_url': user.photo_url,
            'offered_skills': [{
                'id': skill.id,
                'name': skill.name
            } for skill in offered_skills],
            'requested_skills': [{
                'id': skill.id,
                'name': skill.name
            } for skill in requested_skills]
        }
        
        result.append(user_data)
    
    return jsonify(result)
