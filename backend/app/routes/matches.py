from flask import Blueprint, request, jsonify, g
from app import db
from app.models.user import User, user_offered_skills, user_required_skills
from app.models.skill import Skill
from app.models.barter_session import BarterSession
from sqlalchemy import and_, or_
from app.auth import token_auth

bp = Blueprint('matches', __name__)

@bp.route('/api/matches', methods=['GET'])
@token_auth.login_required
def get_matches():
    current_user = g.current_user
    
    # Get current user's offered and required skills
    current_offered_skills = [skill.id for skill in current_user.offered_skills]
    current_required_skills = [skill.id for skill in current_user.required_skills]
    
    if not current_offered_skills or not current_required_skills:
        return jsonify({
            'message': 'Please add both offered and required skills to your profile',
            'matches': []
        }), 200
    
    # Find users who have at least one skill the current user needs
    # and need at least one skill the current user offers
    potential_matches = db.session.query(User).filter(
        User.id != current_user.id,
        User.offered_skills.any(Skill.id.in_(current_required_skills)),
        User.required_skills.any(Skill.id.in_(current_offered_skills))
    ).all()
    
    matches = []
    for user in potential_matches:
        # Get matching skills
        user_offered = {skill.id: skill.name for skill in user.offered_skills}
        user_required = {skill.id: skill.name for skill in user.required_skills}
        
        # Find overlapping skills
        matching_offered = {
            skill_id: user_offered[skill_id] 
            for skill_id in user_offered 
            if skill_id in current_required_skills
        }
        
        matching_required = {
            skill_id: user_required[skill_id]
            for skill_id in user_required
            if skill_id in current_offered_skills
        }
        
        # Generate possible exchanges
        possible_exchanges = []
        for req_skill_id, req_skill_name in matching_required.items():
            for off_skill_id, off_skill_name in matching_offered.items():
                possible_exchanges.append({
                    'offered_skill_id': req_skill_id,
                    'offered_skill_name': req_skill_name,
                    'requested_skill_id': off_skill_id,
                    'requested_skill_name': off_skill_name
                })
        
        if possible_exchanges:
            matches.append({
                'user': {
                    'id': user.id,
                    'name': user.name,
                    'photo_url': user.photo_url,
                    'location': user.location,
                    'bio': user.bio
                },
                'offered_skills': [
                    {'id': skill_id, 'name': name} 
                    for skill_id, name in user_offered.items()
                ],
                'requested_skills': [
                    {'id': skill_id, 'name': name}
                    for skill_id, name in user_required.items()
                ],
                'possible_exchanges': possible_exchanges
            })
    
    return jsonify(matches)

@bp.route('/api/barter-sessions', methods=['POST'])
@token_auth.login_required
def create_barter_session():
    current_user = g.current_user
    data = request.get_json()
    
    # Validate request data
    required_fields = ['provider_id', 'offered_skill_id', 'requested_skill_id']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Check if the provider exists
    provider = User.query.get(data['provider_id'])
    if not provider:
        return jsonify({'error': 'Provider not found'}), 404
    
    # Check if the offered skill belongs to the current user
    offered_skill = Skill.query.get(data['offered_skill_id'])
    if not offered_skill or offered_skill not in current_user.offered_skills:
        return jsonify({'error': 'Invalid offered skill'}), 400
    
    # Check if the requested skill is offered by the provider
    requested_skill = Skill.query.get(data['requested_skill_id'])
    if not requested_skill or requested_skill not in provider.offered_skills:
        return jsonify({'error': 'Invalid requested skill'}), 400
    
    # Check if a similar barter session already exists
    existing_session = BarterSession.query.filter(
        BarterSession.requester_id == current_user.id,
        BarterSession.provider_id == provider.id,
        BarterSession.offered_skill_id == offered_skill.id,
        BarterSession.requested_skill_id == requested_skill.id,
        BarterSession.status.in_(['pending', 'accepted'])
    ).first()
    
    if existing_session:
        return jsonify({'error': 'A similar barter session already exists'}), 400
    
    # Create new barter session
    barter_session = BarterSession(
        requester_id=current_user.id,
        provider_id=provider.id,
        offered_skill_id=offered_skill.id,
        requested_skill_id=requested_skill.id,
        status='pending'
    )
    
    db.session.add(barter_session)
    db.session.commit()
    
    return jsonify({
        'message': 'Barter session created successfully',
        'session_id': barter_session.id
    }), 201
