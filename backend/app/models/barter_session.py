from app import db
from .user import User
from .skill import Skill

class BarterSession(db.Model):
    __tablename__ = 'barter_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    offered_skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    requested_skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    status = db.Column(db.Enum('pending', 'accepted', 'rejected', 'completed', 'cancelled'), 
                      default='pending', nullable=False)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())

    # Relationships
    requester = db.relationship('User', foreign_keys=[requester_id], 
                               backref='requested_sessions')
    provider = db.relationship('User', foreign_keys=[provider_id],
                             backref='provided_sessions')
    offered_skill = db.relationship('Skill', foreign_keys=[offered_skill_id])
    requested_skill = db.relationship('Skill', foreign_keys=[requested_skill_id])

    def __repr__(self):
        return f'<BarterSession {self.id}: {self.requester.name} -> {self.provider.name}>'

class Feedback(db.Model):
    __tablename__ = 'feedback'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('barter_sessions.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reviewee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())

    # Relationships
    session = db.relationship('BarterSession', backref=db.backref('feedbacks', cascade='all, delete-orphan'))
    reviewer = db.relationship('User', foreign_keys=[reviewer_id], 
                             backref='given_feedback')
    reviewee = db.relationship('User', foreign_keys=[reviewee_id],
                             backref='received_feedback')

    def __repr__(self):
        return f'<Feedback {self.id} for session {self.session_id}>'
