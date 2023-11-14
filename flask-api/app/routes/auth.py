from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash
# could use flask bcrypt instead of  werkzeug.security
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import json

from app import app, db
from app.models import User

auth_blueprint = Blueprint('auth_blueprint', __name__)

# Login takes 
@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    password = data['password']
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'message': 'Invalid email or password'}), 401
    # NOTE: Token has an expiry time, currently we do not check or refresh the token, something to address later
    access_token = create_access_token(identity=user.id) # I read somewhere that turning identity to a str may be a good idea i.e. str(user.id) but may not be neccessary
    return jsonify({'message': 'Logged in successfully', 'token' : access_token, 'userID' : user.id}), 200

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.form

    required_fields = ['email', 'password', 'username']
    # Check if the required fields are present
    for field in required_fields:
        if field not in data:
            return jsonify({"message": "Missing required field(s)"}), 400
    
    if '@' not in data.get('email'):
        return jsonify({'message': 'Invalid email'}), 400
        
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    
    # Check if the optional fields are present
    if data.get('firstName') :
        if(data.get('lastName')):
            name = data.get('firstName') + ' ' + data.get('lastName')
        else:
            name = data.get('firstName')
    else:
        name = None

    if data.get('description'): description = data.get('description')
    else: description = None
    
    if(data.get('tags')): tags = json.loads(data['tags'])
    else: tags = None

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400
    elif User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 400
    
    if 'image' in request.files:
        file = request.files['image']
        if file and not(file.filename == ''):
            filename = secure_filename(file.filename) # Need to generate unique filename for every image uploaded
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            image_url = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        else:
            image_url = None
    else:
        image_url = None

    user = User(email=email, username=username, password=generate_password_hash(password), name=name, description=description, profile_picture=image_url, tag_list=tags)
    
    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'message': 'Failed to create user', 'error': str(e)}), 500
    
    return jsonify({'message': 'User created successfully'}), 201

# Example of a protected route i.e. a route that requires authentication
@auth_blueprint.route('/protected', methods=['GET'])
@jwt_required
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': 'Protected route', 'userID': current_user}), 200