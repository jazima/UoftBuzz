import pytest
import json
from pathlib import Path
from datetime import datetime

from app import app, db

TEST_DB = "test.db"

@pytest.fixture
def client():
    BASE_DIR = Path(__file__).resolve().parent.parent
    app.config["TESTING"] = True
    app.config["DATABASE"] = BASE_DIR.joinpath(TEST_DB)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{BASE_DIR.joinpath(TEST_DB)}"

    with app.app_context():
        db.create_all()  # setup
        yield app.test_client()  # tests run here
        db.drop_all()  # teardown

def get_test_entries():
    with open("test/test_entries.json", "r") as f:
        return json.load(f)

def add_test_entries_to_db(client):
    entries = get_test_entries()
    for user in entries["users"]:
        register(client, user)
    for event in entries["events"]:
        access_token = json.loads(login(client, event["email"], event["password"]).data)['token']
        create_event(client, access_token, event)

# Helper Functions
def convert_time_to_milliseconds(time_str):
    # Parse the time
    time_obj = datetime.strptime(time_str, "%H:%M")
    
    # Convert to milliseconds
    milliseconds = (time_obj.hour * 60 * 60 * 1000) + (time_obj.minute * 60 * 1000)
    
    return str(milliseconds)

def register(client, user_info:{}):
    """Registration helper function"""
    return client.post(
        "/register",
        data=user_info
    )

def login(client, email, password):
    """Login helper function"""
    return client.post(
        "/login",
        data=json.dumps({"email": email, "password": password}),
        headers={"Content-Type": "application/json"},
    )

def create_event(client, token, event_info:{}):
    """Create event helper function"""
    event_info_copy = event_info.copy()
    if "startTime" in event_info_copy: event_info_copy["startTime"] = convert_time_to_milliseconds(event_info_copy["startTime"])
    if "endTime" in event_info_copy: event_info_copy["endTime"] = convert_time_to_milliseconds(event_info_copy["endTime"])
    if "tags" in event_info_copy: event_info_copy["tags"] = json.dumps(event_info_copy["tags"])
    return client.post(
        "/event",
        data=event_info_copy,
        headers={'Authorization': f'Bearer {token}'}
    )

# Authorization Tests
def test_register(client):
    """Test registration works"""
    request_data = {"username": "test_name",}
    response = register(client, request_data)
    assert response.status_code == 400 # Missing required fields

    request_data["password"] = "test_password"
    response = register(client, request_data)
    assert response.status_code == 400 # Missing required fields

    request_data["email"] = "test_email@mail.com"
    response = register(client, request_data)
    assert response.status_code == 201 # contains required fields

    request_data["firstName"] = "test_first_name"
    request_data["lastName"] = "test_last_name"
    request_data["description"] = "test_description"
    response = register(client, request_data)
    assert response.status_code == 400 # User Exists
    data = json.loads(response.data)
    assert data["message"] == "Email already exists"

    request_data["email"] = "bad_email"
    response = register(client, request_data)
    assert response.status_code == 400 # Bad email
    data = json.loads(response.data)
    assert data["message"] == "Invalid email"

    request_data["email"] = "bad_email.com"
    response = register(client, request_data)
    assert response.status_code == 400 # Bad email
    data = json.loads(response.data)
    assert data["message"] == "Invalid email"

def test_login(client):
    """Test login works"""
    request_data = {
        "username": "test_name",
        "password": "test_password",
        "email": "test_email@email.com",
        "firstName": "test_first_name",
        "lastName": "test_last_name",
        "description": "test_description"
    }
    response = register(client, request_data)
    assert response.status_code == 201 # register successful
    
    response = login(client, request_data["email"], request_data["password"])
    assert response.status_code == 200 # login successful
    data = json.loads(response.data)
    assert data["message"] == "Logged in successfully"
    assert data["token"] != None

    response = login(client, "bad_email", request_data["password"])
    assert response.status_code == 401 # bad email
    data = json.loads(response.data)
    assert data["message"] == "Invalid email or password"

    response = login(client, "wrong_email@mail.com", request_data["password"])
    assert response.status_code == 401 # wrong email
    data = json.loads(response.data)
    assert data["message"] == "Invalid email or password"

    response = login(client, request_data["email"], "wrong_password")
    assert response.status_code == 401 # wrong password
    data = json.loads(response.data)
    assert data["message"] == "Invalid email or password"

# Profile Tests
def test_get_profile(client):
    """Test get profile works"""
    test_entries = get_test_entries()
    user = test_entries["users"][0]
    register(client, user)

    # Test with valid user ID
    data = json.loads(login(client, user["email"], user["password"]).data)
    access_token = data['token']
    userID = data['userID']
    response = client.get(
        f"/profile/{userID}",
        headers={"Content-Type": "application/json", 'Authorization': f'Bearer {access_token}'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["username"] == user["username"]
    assert data["email"] == user["email"]
    assert data["name"] == user["firstName"] + ' ' + user["lastName"]
    assert data["description"] == user["description"]
    # assert data["interests"] == user["interests"] # Need to add interests to the database

    # Test with invalid user ID
    response = client.get(
        f"/profile/999",
        headers={"Content-Type": "application/json", 'Authorization': f'Bearer {access_token}'})
    assert response.status_code == 404

    # Test without authorization token
    response = client.get(
        f"/profile/{userID}",
        headers={"Content-Type": "application/json"})
    assert response.status_code == 200 # Token is optional

def test_update_profile(client):
    """Test update profile works"""
    test_entries = get_test_entries()
    user = test_entries["users"][0]
    register(client, user)

    # Test with valid user ID
    data = json.loads(login(client, user["email"], user["password"]).data)
    access_token = data['token']
    userID = data['userID']
    response = client.put(
        f"/profile/{userID}",
        data=json.dumps({"description": "New description"}),
        headers={"Content-Type": "application/json", 'Authorization': f'Bearer {access_token}'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["message"] == "Profile updated successfully"

    # Test with invalid user ID
    response = client.put(
        f"/profile/999",
        data=json.dumps({"description": "New description"}),
        headers={"Content-Type": "application/json", 'Authorization': f'Bearer {access_token}'})
    assert response.status_code == 403
    data = json.loads(response.data)
    assert data["message"] == "One can only update their own profile"

    # Test without authorization token
    response = client.put(
        f"/profile/{userID}",
        data=json.dumps({"description": "New description"}),
        headers={"Content-Type": "application/json"})
    assert response.status_code == 401 # Unauthorized

    # Test with missing fields
    response = client.put(
        f"/profile/{userID}",
        data=json.dumps({}),
        headers={"Content-Type": "application/json", 'Authorization': f'Bearer {access_token}'})
    assert response.status_code == 400
    data = json.loads(response.data)

    # Test with invalid field
    response = client.put(
        f"/profile/{userID}",
        data=json.dumps({"email": "bad_email"}),
        headers={"Content-Type": "application/json", 'Authorization': f'Bearer {access_token}'})
    assert response.status_code == 400

    # Test with existing username
    user2 = test_entries["users"][1]
    register(client, user2)
    response = client.put(
        f"/profile/{userID}",
        data=json.dumps({"username": test_entries["users"][1]["username"]}),
        headers={"Content-Type": "application/json", 'Authorization': f'Bearer {access_token}'})
    assert response.status_code == 409

    # Test with existing email
    response = client.put(
        f"/profile/{userID}",
        data=json.dumps({"email": test_entries["users"][1]["email"]}),
        headers={"Content-Type": "application/json", 'Authorization': f'Bearer {access_token}'})
    assert response.status_code == 409

# Event Tests
def test_create_event(client):
    """Test create event works"""
    test_entries = get_test_entries()
    event = test_entries["events"][0]
    user = {"username": event["username"], "password": event["password"], "email": event["email"]}
    register(client, user)
    
    response = login(client, event["email"], event["password"])
    data = json.loads(response.data)
    access_token = data['token']
    print(access_token)

    # Test with valid data
    response = create_event(client, access_token, event)
    data = json.loads(response.data)
    assert response.status_code == 201
    assert data["message"] == "Event created"

    # Test if org is automatically set to user's username
    response = client.get(
        f"/event/{data['event_id']}",
        headers={"Content-Type": "application/json"})
    assert response.status_code == 200

    # Test with missing fields
    response = create_event(client, access_token, {"title": "Test Event"})
    data = json.loads(response.data)
    assert response.status_code == 400
    assert data["message"] == "Missing required field(s)"
    
def test_create_many_events(client):
    add_test_entries_to_db(client)

def test_get_event(client):
    """Test get event works"""
    test_entries = get_test_entries()
    event = test_entries["events"][0]
    user = {"username": event["username"], "password": event["password"], "email": event["email"]}
    register(client, user)
    
    response = login(client, event["email"], event["password"])
    data = json.loads(response.data)
    access_token = data['token']

    # Test with valid event ID
    response = create_event(client, access_token, event)
    data = json.loads(response.data)
    event_id = data['event_id']

    response = client.get(
        f"/event/{event_id}",
        headers={"Content-Type": "application/json"})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data["title"] == event["title"]
    assert data["location"] == event["location"]
    assert data["tags"] == event["tags"]
    assert data["website"] == event["website"]

    # Test with invalid event ID
    response = client.get(
        f"/event/999",
        headers={"Content-Type": "application/json"})
    assert response.status_code == 404

    # Test without authorization token
    response = client.get(
        f"/event/{event_id}",
        headers={"Content-Type": "application/json"})
    assert response.status_code == 200 # Token is optional

def test_get_events(client):
    """Test get events works"""
    # Add test entries to the database
    add_test_entries_to_db(client)

    # Test with no query parameters
    response = client.get(
        "/events",
        headers={"Content-Type": "application/json"})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data['events']) == 9

if __name__ == "__main__":
    get_test_entries()
