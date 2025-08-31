from flask import Blueprint, jsonify, request
from app.utils.auth import token_required
from app.utils.matching import find_matches, get_available_skills

matching_bp = Blueprint('matching', __name__)

@matching_bp.route('/', methods=['GET'])
@token_required
def get_matches(current_user):
    """
    Get potential matches for the current user with optional filters
    Query Parameters:
        - skill_id: Filter by specific skill ID
        - location: Filter by location (partial match)
    """
    filters = {}
    
    if 'skill_id' in request.args:
        try:
            filters['skill_id'] = int(request.args.get('skill_id'))
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid skill_id'}), 400
    
    if 'location' in request.args:
        filters['location'] = request.args.get('location')
    
    try:
        matches = find_matches(current_user.id, filters)
        return jsonify({
            'success': True,
            'data': matches
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@matching_bp.route('/skills', methods=['GET'])
@token_required
def get_skills(current_user):
    """Get all available skills for filtering"""
    try:
        skills = [{'id': s.id, 'name': s.name} for s in get_available_skills()]
        return jsonify({
            'success': True,
            'data': skills
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
