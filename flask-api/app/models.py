from app import db
import datetime
from sqlalchemy.dialects.postgresql import JSON

# To Understand how to use the db, refer to DatabaseUse.md or look at examples in routes

# Association table for User and Tag
user_tags = db.Table('user_tags',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

# Association table for Event and Tag
event_tags = db.Table('event_tags',
    db.Column('event_id', db.Integer, db.ForeignKey('event.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), primary_key=True)
)

# Association table for User and saved events
user_saved_events = db.Table('user_saved_events',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('saved_event_id', db.Integer, db.ForeignKey('event.id'), primary_key=True)
)

class Tag(db.Model):
    __talbename__ = 'tag' # Maybe tags, but I think tag is fine
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, unique=True)
    # Relationships
    users = db.relationship('User', secondary=user_tags, backref=db.backref('favourite_tags', lazy='dynamic'))
    events = db.relationship('Event', secondary=event_tags, lazy='dynamic', backref=db.backref('tags', lazy='dynamic'))

# When we work on more details for user we can modify this, and add or remove things i.e. email, no username...
class User(db.Model):
    __tablename__ = 'user'
    # Authentification Credentials
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(64))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    # User profile related information
    profile_picture = db.Column(db.String(255)) # Path to the profile picture, by default is default.png
    description = db.Column(db.Text) # User Bio, if we want to change this to a string we can, just wasn't sure about character limit
    tag_list = db.Column(JSON) # List of interests stored as serialized JSON
    # favourite_tags: Something to add later 
    # Could add events here, but I think at this point we can just Query for events with user_id as creator_id instead

    def __repr__(self):
        return '<User %r>' % self.username

# Can similarly modify this to add things like, club affiliation
class Event(db.Model):
    __tablename__ = 'event'
    id = db.Column(db.Integer, primary_key=True) # Apparently SQLALchemy automatically adds autoincrement and uniqueness to its int primary keys
    title = db.Column(db.String(120), nullable=False) # Could allow unique event names if we want
    date = db.Column(db.Date, nullable=False, default=datetime.datetime.utcnow) # Date of the event
    start_time = db.Column(db.Time, nullable=False, default=datetime.datetime.utcnow) # Start time of the event
    end_time = db.Column(db.Time, nullable=False, default=datetime.datetime.utcnow) # End time of the event
    location = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    tag_list = db.Column(JSON) # List of tags stored as serialized JSON
    website = db.Column(db.String(255)) # URL to the event website
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # This could also be user.id
    org = db.Column(db.String(120)) # Organization hosting the event
    image_url = db.Column(db.String(255)) # Path to the image, since I believe we wanted events to have associated image

    users = db.relationship('User', secondary=user_saved_events, backref=db.backref('saved_events', lazy='dynamic'))

    def __repr__(self): # May adjust
        return '<Event %r>' % self.title 

