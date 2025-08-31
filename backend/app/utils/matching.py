from sqlalchemy import and_, or_
from app import db
from app.models import User, Profile, Skill

def find_matches(user_id, filters=None):
    """
    Find potential matches for a user with optional filters
    
    Args:
        user_id (int): ID of the current user
        filters (dict): Dictionary of filters to apply (e.g., {'skill_id': 1, 'location': 'New York'})
        
    Returns:
        list: List of matched users with their profiles and skills
    """
    if filters is None:
        filters = {}
        
    # Get current user with relationships
    current_user = User.query.options(
        db.joinedload(User.profile),
        db.joinedload(User.offered_skills),
        db.joinedload(User.required_skills)
    ).get(user_id)
    
    if not current_user:
        return []

    # Start building the query
    query = User.query.join(Profile).options(
        db.joinedload(User.profile),
        db.joinedload(User.offered_skills),
        db.joinedload(User.required_skills)
    ).filter(User.id != user_id)
    
    # Apply filters
    if 'location' in filters:
        query = query.filter(Profile.location.ilike(f"%{filters['location']}%"))
        
    if 'skill_id' in filters:
        skill_id = filters['skill_id']
        query = query.filter(
            or_(
                User.offered_skills.any(id=skill_id),
                User.required_skills.any(id=skill_id)
            )
        )
    
    # Find users who either:
    # 1. Offer what current user needs, or
    # 2. Need what current user offers
    current_offered_skill_ids = [s.id for s in current_user.offered_skills]
    current_required_skill_ids = [s.id for s in current_user.required_skills]
    
    query = query.filter(
        or_(
            User.offered_skills.any(Skill.id.in_(current_required_skill_ids)),
            User.required_skills.any(Skill.id.in_(current_offered_skill_ids))
        )
    )
    
    # Execute query and format results
    matches = query.all()
    
    def format_user(user):
        return {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'profile': {
                'bio': user.profile.bio if user.profile else None,
                'location': user.profile.location if user.profile else None,
                'photo_url': user.profile.photo_url if user.profile else None
            },
            'offered_skills': [{
                'id': skill.id,
                'name': skill.name
            } for skill in user.offered_skills],
            'required_skills': [{
                'id': skill.id,
                'name': skill.name
            } for skill in user.required_skills]
        }
    
    return [format_user(user) for user in matches]

def get_available_skills():
    """Get all available skills for filtering"""
    return Skill.query.order_by(Skill.name).all()
