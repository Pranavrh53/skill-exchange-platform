from flask import Blueprint, jsonify
from app.utils.matching import find_matches

matching_bp = Blueprint('matching', __name__)

@matching_bp.route('/', methods=['GET'])
def get_matches():
    # Assuming user_id is derived from a token
    user_id = 1 # Placeholder
    matches = find_matches(user_id)
    return jsonify(matches)
