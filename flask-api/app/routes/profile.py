from flask import Blueprint, jsonify, request 
from flask_jwt_extended import jwt_required, get_jwt_identity
import json

from app import db
from app.models import User, Tag, Event
from app.routes.event_detail import event_to_dict

profile_blueprint = Blueprint('profile', __name__)

@profile_blueprint.route('/<int:user_id>', methods=['GET'])
@jwt_required(optional=True) # Anyone can look at a profile not everyone can edit it
def get_profile(user_id):
    try:
        user = db.get_or_404(User, user_id)
        return jsonify({
            'id': user.id,
            'name': user.name,
            'username': user.username,
            'email': user.email, # Should we include this?
            'imgSrc': user.profile_picture,
            'description': user.description, # Should we rename this to bio?
            'tags': user.tag_list if user.tag_list else []
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 404


@profile_blueprint.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_profile(user_id):
    current_user = get_jwt_identity()
    if current_user != user_id:
        return jsonify({'message': 'One can only update their own profile'}), 403
    
    user = db.get_or_404(User, user_id)
    data = request.get_json()

    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    # Update the user's profile
    # If an error is thrown, no updates should be performed
    if 'username' in data and User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 409
    if 'email' in data:
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already exists'}), 409
        if '@' not in data['email']:
            return jsonify({'message': 'Invalid email'}), 400
    
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'profilePicture' in data:
        user.profile_picture = data['profile_picture'] # Link to image, also needs checking in final version
    if 'description' in data:
        user.description = data['description']
    #if 'password' in data: # Should we allow users to change their password?
    #    user.password = data['password'] # Do neccessary hashing here if we do want change password functionality
    
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200

@profile_blueprint.route('/add_tag', methods=['POST']) # Could change to PUT if we want or add specific user_id
@jwt_required()
# Chat-GPT code
def add_tag_to_user():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    data = request.get_json()
    tag_name = data.get('tagName')
    tag = Tag.query.filter_by(name=tag_name).first()
    
    if not tag:
        tag = Tag(name=tag_name)
        db.session.add(tag)
    
    user.favourite_tags.append(tag)
    db.session.commit()
    return jsonify({"message": "Tag added to user favourites."}), 200


@profile_blueprint.route('/save_event/<int:event_id>', methods=['POST'])
@jwt_required()
def add_saved_event_to_user(event_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    event = Event.query.get_or_404(event_id)
    user.saved_events.append(event)
    db.session.commit()
    return jsonify({"message": "Saved event."}), 200

@profile_blueprint.route('/remove_saved_event/<int:event_id>', methods=['POST'])
@jwt_required()
def remove_saved_event_from_user(event_id):
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    event = Event.query.get_or_404(event_id)
    user.saved_events.remove(event)
    db.session.commit()
    return jsonify({"message": "Removed saved event."}), 200


# Case where user wants to retrieve own tags
@profile_blueprint.route('/favourite_tags', methods=['GET'])
@jwt_required()
def get_self_favourite_tags():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    favourite_tags = [tag.name for tag in user.favourite_tags]
    return jsonify({"favouriteTags": favourite_tags}), 200

@profile_blueprint.route('/<int:user_id>/favourite_tags', methods=['GET'])
@jwt_required(optional=True) # Maybe make this optional?
def get_user_favourite_tags(user_id):
    user = User.query.get_or_404(user_id)
    favourite_tags = [tag.name for tag in user.favourite_tags]
    return jsonify({"favouriteTags": favourite_tags}), 200


@profile_blueprint.route('/saved_events', methods=['GET'])
@jwt_required()
def get_self_saved_events():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    data = {
        'message': 'Retrieved saved events.',
        'events': [event_to_dict(e) for e in user.saved_events]
        }
    return jsonify(data), 200

# it's possible to get events without user authentication, so
# this is a separate call invokable only when user is logged in
@profile_blueprint.route('/are_saved_events', methods=['POST'])
@jwt_required()
def get_self_are_saved_events():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)

    event_ids = set(request.get_json())
    saved_events = user.saved_events.filter(Event.id.in_(event_ids))
    saved_event_ids = [event.id for event in saved_events]
    data = {
        'message': 'Retrieved whether given events are saved.',
        'saved_event_ids': saved_event_ids
        }
    return jsonify(data), 200

# Events associated with the user  User story 3.5.1
@profile_blueprint.route('/<int:user_id>/events', methods=['GET'])
@jwt_required(optional=True) # Maybe make this mandatory?
def get_user_events(user_id): 
    # Fetch the events created by this user
    events = Event.query.filter_by(creator_id=user_id).all()
    events_data = [event_to_dict(e) for e in events]
    #events_data = ['id' : event.id for event in events] # Alternative to above, just returns the id's of the events, frontend can decide which to use
    return jsonify(events_data), 200

@profile_blueprint.route('/<int:user_id>/name', methods=['GET'])
@jwt_required(optional=True) # Maybe make this mandatory so not everyone can access it?
def get_user_name(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({"name": user.name}), 200

@profile_blueprint.route('/<int:user_id>/username', methods=['GET'])
@jwt_required(optional=True) # Maybe make this mandatory so not everyone can access it?
def get_username(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({"username": user.username}), 200
