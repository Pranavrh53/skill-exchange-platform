from app import db

class Portfolio(db.Model):
    __tablename__ = 'portfolios'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    project_url = db.Column(db.String(255), nullable=True)
