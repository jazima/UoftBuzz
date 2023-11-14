from flask import jsonify, Blueprint, send_from_directory, abort, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import json
import datetime
from models import db, User, Event, Tag
from app import app

event_detail_app = Blueprint('event_detail_app',__name__)



def format_datetime(date: datetime.date, start_time:datetime.time, end_time:datetime.time):
    if start_time and end_time:
        return start_time.strftime("%I:%M %p").lstrip('0') + " - " + end_time.strftime("%I:%M %p").lstrip('0') + "  -  " + date.strftime("%B %d, %Y") 
    elif start_time:
        return start_time.strftime("%I:%M %p").lstrip('0') + "  -  " + date.strftime("%B %d, %Y")
    else:
        return date.strftime("%B %d, %Y")


def event_to_dict(event):
    datetime = format_datetime(event.date, event.start_time, event.end_time)
    return {
        'id': event.id,
        'title': event.title,
        'location': event.location,
        'dateTime': datetime,
        'description': event.description,
        'website': event.website,
        'tags': event.tag_list if event.tag_list else [],
        'imgSrc': event.image_url,
        'creatorId': event.creator_id,
        'group' : event.org
    }

# Endpoint to get event details
@event_detail_app.route('/event/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    event = db.get_or_404(Event, event_id) # Could also try similar scheme as before and send a dummy event if event_id is not found
    return jsonify(event_to_dict(event)), 200

# Route to get all events
@event_detail_app.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    events_data = {
        'message': 'Success',
        'events': [event_to_dict(e) for e in events]
        }
    return jsonify(events_data), 200

# Maybe change to plurals later for grammatical correctness but for now this is fine
@event_detail_app.route('/event', methods=['POST'])
@jwt_required()
def create_event():
    # Fetch the data to create an event
    # NOTE: Currently the data is not checked to see if it is valid or safe
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    org_name = user.username

    data = request.form

    # Check for required fields
    required_fields = ['title', 'location', 'date', 'description']
    for field in required_fields:
        if field not in data:
            return jsonify({"message": "Missing required field(s)"}), 400

    # Try saving image
    if 'image' in request.files:
        file = request.files['image']
        if file and not(file.filename == ''):
            filename = secure_filename(file.filename) # Need to generate unique filename for every image uploaded
            file.save(os.path.join('/opt/render/project', filename))
            image_url = os.path.join('/opt/render/project', filename)
        else:
            image_url = None
    else:
        image_url = None
   
    date = datetime.date(int(data['date'][:4]), int(data['date'][5:7]), int(data['date'][8:10]))
    if data.get("startTime"): start_time = datetime.time(int(data['startTime'])//3600000, int(data['startTime'])//600000 % 60)
    else: start_time = None
    if data.get("endTime"): end_time = datetime.time(int(data['endTime'])//3600000, int(data['endTime'])//600000 % 60)
    else: end_time = None
    if(data.get('tags')): tags = json.loads(data['tags'])
    else: tags = None
    if(data.get('website')): website = data['website']
    else: website = None


    # Create the event
    new_event = Event(
        # Event ID is automatically generated
        title = data['title'],
        location = data['location'],
        date = date,
        start_time = start_time,
        end_time = end_time,
        description = data['description'],
        website = website,
        tag_list = tags,
        image_url = image_url,
        creator_id = user_id,
        org = org_name # Need to grab creator name from db
    )

    db.session.add(new_event)

    if tags is not None:
        for tag_name in tags:
            tag = Tag.query.filter_by(name=tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.session.add(tag)
            new_event.tags.append(tag)

    try:
        db.session.commit()
    except Exception as e: # If event can't be created
        print(e)
        db.session.rollback() 
        return jsonify({"message": "Something went wrong when creating event"}), 400

    return jsonify({"message": "Event created", "event_id": new_event.id}), 201

# Route to update an existing event that the user created
@event_detail_app.route('/event/update/<int:event_id>', methods=['PUT']) # Don't neccessarily need update but I like the barrier it creates
@jwt_required()
def update_event(event_id):
    # Code adapted from Chat-GPT
    # Get the identity of the current user
    current_user_id = get_jwt_identity()
    
    # Find the event by id
    event = Event.query.get_or_404(event_id)
    
    # Check if the current user is the creator of the event
    if event.creator_id != current_user_id:
        return jsonify({"msg": "You do not have permission to update this event."}), 403
    
    # Get data from the request
    data = request.get_json()
    
    # Update the event with the new data
    # NOTE: This data is also not sanitized or checked for validity
    try:
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'date_time' in data:
            event.date_time = data['date_time']
        if 'location' in data:
            event.location = data['location']
        if 'image_url' in data:
            event.image_url = data['image_url']
        if 'org' in data:
            event.org = data['org']

        # Commit the changes to the database
        db.session.commit()
        return jsonify({"msg": "Event updated successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to update event.", "error": str(e)}), 500


# Tag related routes for events from Chat-GPT
@event_detail_app.route('/event/add_tag/<int:event_id>', methods=['POST'])
@jwt_required()
def add_tag_to_event(event_id):
    current_user_id = get_jwt_identity()
    event = Event.query.get_or_404(event_id)
    if event.creator_id != current_user_id:
        return jsonify({"message": "You do not have permission to add a tag to this event."}), 403
    
    data = request.get_json()
    tag_name = data.get('tag_name')
    tag = Tag.query.filter_by(name=tag_name).first()
    
    if not tag:
        tag = Tag(name=tag_name)
        db.session.add(tag)
    
    event.tags.append(tag)
    db.session.commit()
    return jsonify({"message": "Tag added to event."}), 200

@event_detail_app.route('/event/tags/<int:event_id>', methods=['GET'])
def get_event_tags(event_id):
    event = Event.query.get_or_404(event_id)
    tags = [tag.name for tag in event.tags]
    return jsonify({"tags": tags}), 200

@event_detail_app.route('/tags', methods=['GET'])
def get_all_tags():
    tags = Tag.query.all()
    print(tags)
    tags = [tag.name for tag in tags]
    return jsonify({"tags": tags}), 200

@event_detail_app.route('/opt/render/project/<asset_name>', methods=['GET']) # Maybe depreciate this later? Not too sure what the frontend wants
def get_asset(asset_name):
    try:
        return send_from_directory("/opt/render/project", asset_name) # Temporary solution. Need to figure out how to serve static files
    except FileNotFoundError:
        abort(404)

