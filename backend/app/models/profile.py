from app import db

class Profile(db.Model):
    __tablename__ = 'profiles'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    bio = db.Column(db.Text, nullable=True)
    photo_url = db.Column(db.String(255), nullable=True)
    availability = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(100), nullable=True)
