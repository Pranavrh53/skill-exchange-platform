from flask import Blueprint, request, jsonify

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/send', methods=['POST'])
def send_message():
    return jsonify({'message': 'Message sent'})

@chat_bp.route('/request', methods=['POST'])
def request_barter():
    return jsonify({'message': 'Barter request sent'})
