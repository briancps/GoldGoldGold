import pytest
from backend.app import app
from unittest.mock import patch

# Creates a test client for Flask routes
@pytest.fixture
def client():
    # Enable Flask's testing mode
    app.config.update({
        "Testing" : True
    })

    # This creates a Flask test client that simulates HTTP requests without starting an actual webpage
    with app.test_client() as client:
        yield client # Provide the test client to any tests here that requires it

# Testing '/' route
def test_root_route(client):
    response = client.get('/')
    assert response.status_code == 200

# Testing '/pose' route
def pushup_required_fields():
    return {
        'elbow_angle' : 165, 
        'hip_angle' : 165, 
        'shoulder_visibility' : 0.8, 
        'elbow_visibility' : 0.8, 
        'wrist_visibility' : 0.8, 
        'hip_visibility' : 0.8, 
        'knee_visibility' : 0.8, 
        'user_email' : 'testing123@gmail.com', 
        'exercise_type' : 'push-up'
    }

def test_pose_response_with_valid_data(client):
    response = client.post('/pose', json = pushup_required_fields())
    assert response.status_code == 200

def test_pose_response_with_invalid_data(client):
    invalid_data = pushup_required_fields()
    invalid_data['exercise_type'] = 'running'

    response = client.post('/pose', json = invalid_data)
    assert response.status_code == 400

# Testing '/session/save' route
'''
@patch('app.supabase_client') replaces the actual supabase_client object with a mock object. This prevents actual database operations
while still being able to test the functionality of the route and database.
'''
@patch('backend.app.supabase_client')
def test_session_save_route_with_valid_data(mock_supabase, client):
    '''
    For our actual database, we did the following:

    supabase_client.table('userprofiles').insert({
        'user_email' : user_email,
        'exercise_type' : exercise_type,
        # int(rep_count) is to ensure rep_count data is forwarded to Supabase as in integer to be saved as expected
        'rep_count' : int(rep_count)
        }).execute()  

    Thus, for our mock_supabase, we have to simulate this via mock_supabase.table.return_value.insert.return_value.execute.return_value.
    We have to include ".return_value" since table, insert and execute are function calls and not attributes, and thus we are mocking the
    objects returned by calling those functions
    '''
    mock_supabase.table.return_value.insert.return_value.execute.return_value = {}

    required_fields = {
        'user_email' : 'testing123@gmail.com', 
        'exercise_type' : 'push-up',
        'rep_count' : 60
    }
    response = client.post('/session/save', json = required_fields)
    assert response.status_code == 201

# Since invalid data is being inputted, it should never reach our Supabase database. Thus, no mock object is required to be made here
def test_session_save_route_with_invalid_data(client):
    response = client.post('/session/save', json = {'user_email' : 'testing123@gmail.com'})
    assert response.status_code == 400
