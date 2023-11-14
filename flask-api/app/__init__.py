import json
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from datetime import date, time

app = Flask(__name__)
app.config.from_object('config.DevelopmentConfig') # Refer to config.py 

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Import routes and models
from app.routes import event_detail_app
app.register_blueprint(event_detail_app)

from app.routes.auth import auth_blueprint
app.register_blueprint(auth_blueprint) # Could add url_prefix='/auth' to this line depends on what frontend prefers

from app.routes.profile import profile_blueprint
app.register_blueprint(profile_blueprint, url_prefix='/profile')

from app.models import Event, Tag

def add_demo_events(db):
    demo_event1 = Event(
        title='Engineering Leather Jacket Fitting',
        location='Sandford Flemming Basement',
        date=date(2023, 11, 23),
        start_time=time(10, 00),
        end_time=time(18, 00),
        description='Within Canada, most engineering schools have their own Engineering jackets; all in various colours and styles. The University of Toronto Engineering Jacket has gone through several renditions over many decades, including a corduroy style! For the foreseeable future, our Engineering jackets are a black leather, available in either a bomber style fit or a tailored fit! You can customize your jacket with unique designs, patches and other options to add your own style!',
        website='https://stores.skule.ca/pages/leather-jackets',
        tag_list=['Community', 'Fun'],
        image_url='https://cdn.shopify.com/s/files/1/0569/4858/8753/files/IMG_0095_480x480.jpg?v=1695873235',
        creator_id=100000, 
        org='Engineering Society'
    )

    demo_event2 = Event(
        title='Chess Club First Meeting',
        location='Student Activities Center',
        date=date(2023, 9, 15),
        start_time=time(15, 30),
        end_time=time(17, 00),
        description='Kick off the new semester with our chess club! Whether you are a beginner or an experienced player, join us for an afternoon of strategy and fun. Meet fellow chess enthusiasts and learn from each other.',
        website='https://harthousechess.com/',
        tag_list=['Fun', 'Chess', 'Games'],
        image_url='https://harthousechesscom.files.wordpress.com/2023/02/2023-rw.jpg?w=1520',
        creator_id=100002, 
        org='Hart House Chess Club'
    )

    demo_event3 = Event(
        title='Mario Kart Tournament',
        location='Campus Recreation Center',
        date=date(2023, 10, 5),
        start_time=time(16, 00),
        end_time=time(21, 00),
        description='Ready, set, go! Join us for an epic Mario Kart tournament. Compete against your friends and win awesome prizes. All students are welcome. Sign up now to secure your spot on the race track!',
        website='https://www.universitygaming.com/mario-kart-tournament',
        tag_list=['Games'],
        image_url='https://assets1.ignimgs.com/2019/05/31/mario-kart-8---button-1559265583134.jpg',
        creator_id=100004,
        org='University Gaming Society'
    )

    demo_event4 = Event(
        title='Tutoring for Freshman Students',
        location='Online',
        date=date(2023, 9, 20),
        start_time=time(19, 00),
        end_time=time(20, 00),
        description='Are you a freshman looking for help in your courses? Join our tutoring sessions online! Our experienced tutors can help you with a range of subjects. Sign up today and start your journey to academic success!',
        website='mailto:tutoring@university.com',
        tag_list=['Freshman', 'Tutor', 'Engineering'],
        creator_id=100003,
        org='University Academic Support'
    )

    demo_event5 = Event(
        title='Chestnut Residence Board Game Night',
        location='Chestnut Residence Hall',
        date=date(2023, 10, 15),
        start_time=time(18, 30),
        end_time=time(22, 00),
        description='Join us for a fun-filled board game night at Chestnut Residence! A wide variety of games will be available, so bring your friends or come solo and make some new ones. Snacks and refreshments will be provided.',
        website='https://chestnutresidence.utoronto.ca/events/board-game-night',
        tag_list=['Fun', 'Community'],
        image_url='https://cdn.thewirecutter.com/wp-content/media/2020/10/smallworldboardgames-2048px-33.jpg',
        creator_id=100005, 
        org='Chestnut Residence Community'
    )

    # Engineering Career Fair Event
    demo_event6 = Event(
        title='Engineering Career Fair',
        location='Engineering Building Hall',
        date=date(2023, 11, 10),
        start_time=time(10, 00),
        end_time=time(16, 00),
        description='Explore your future at the Engineering Career Fair! Meet top employers, learn about innovative career paths in engineering, and network with industry professionals. Bring your resume and dress for success.',
        website='https://engineering.utoronto.ca/career-fair',
        tag_list=['Career', 'Engineering'],
        image_url='https://www.engr.ncsu.edu/wp-content/uploads/2018/09/eng_careerfair-2558.jpg',
        creator_id=100006,
        org='University of Toronto Engineering Department'
    )

    db.session.add(demo_event1)
    addTag(demo_event1, ['Community', 'Fun'])
    db.session.add(demo_event2)
    addTag(demo_event2, ['Fun', 'Chess', 'Games'])
    db.session.add(demo_event3)
    addTag(demo_event3, ['Games'])
    db.session.add(demo_event4)
    addTag(demo_event4, ['Freshman', 'Tutor', 'Engineering'])
    db.session.add(demo_event5)
    addTag(demo_event5, ['Fun', 'Community'])
    db.session.add(demo_event6)
    addTag(demo_event6, ['Career', 'Engineering'])
    db.session.commit()

def addTag(event, tags):
    for tag_name in json.loads(json.dumps(tags)):
        tag = Tag.query.filter_by(name=tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.session.add(tag)
        event.tags.append(tag)

with app.app_context():
    db.drop_all() 
    db.create_all() # Create all tables in the database in case they don't exist
    add_demo_events(db)

# Temporary route [Could remove now if wanted]
import time
@app.route('/time')
def get_current_time():
    return {'time': time.time()}
    
