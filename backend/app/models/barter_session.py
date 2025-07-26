from app import db

class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

class BarterSession(db.Model):
    __tablename__ = 'barter_sessions'
    id = db.Column(db.Integer, primary_key=True)
    requester_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    provider_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    offered_skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    requested_skill_id = db.Column(db.Integer, db.ForeignKey('skills.id'), nullable=False)
    status = db.Column(db.Enum('pending', 'accepted', 'rejected', 'completed', 'cancelled'), default='pending')
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())

    requester = db.relationship('User', foreign_keys=[requester_id])
    provider = db.relationship('User', foreign_keys=[provider_id])
    offered_skill = db.relationship('Skill', foreign_keys=[offered_skill_id])
    requested_skill = db.relationship('Skill', foreign_keys=[requested_skill_id])

class Feedback(db.Model):
    __tablename__ = 'feedback'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('barter_sessions.id'), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reviewee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())

    session = db.relationship('BarterSession', backref='feedback')
    reviewer = db.relationship('User', foreign_keys=[reviewer_id])
    reviewee = db.relationship('User', foreign_keys=[reviewee_id])
