from flask import Blueprint, jsonify

sessions_bp = Blueprint('sessions', __name__)

@sessions_bp.route('/', methods=['GET'])
def get_sessions():
    return jsonify({'message': 'List of barter sessions'})

@sessions_bp.route('/<int:session_id>/feedback', methods=['POST'])
def give_feedback(session_id):
    return jsonify({'message': f'Feedback given for session {session_id}'})
