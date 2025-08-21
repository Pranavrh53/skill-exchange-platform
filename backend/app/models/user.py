from app import db, bcrypt

user_offered_skills = db.Table('user_offered_skills',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skills.id'), primary_key=True)
)

user_required_skills = db.Table('user_required_skills',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skills.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    google_id = db.Column(db.String(120), unique=True, nullable=True)
    created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())

    profile = db.relationship('Profile', back_populates='user', uselist=False, cascade="all, delete-orphan")
    portfolios = db.relationship('Portfolio', backref='user', lazy=True, cascade="all, delete-orphan")
    offered_skills = db.relationship('Skill', secondary=user_offered_skills, lazy='subquery',
                                     backref=db.backref('users_offering', lazy=True))
    required_skills = db.relationship('Skill', secondary=user_required_skills, lazy='subquery',
                                      backref=db.backref('users_requiring', lazy=True))

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
