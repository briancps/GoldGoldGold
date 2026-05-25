from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase_connection import supabase_client

app = Flask(__name__)

# To allow React server to communicate with Flask backend without any errors
CORS(app)

# Ensure Flask backend server is functional
@app.route('/')
def test():
    return jsonify({'Test Message' : 'Server is running and working'}), 200

# To ensure flask backend receives pose data and returns a response as well as store users' session data into Supabase db
# methods would be POST since we are getting data from users to be stored in Supabase db under that user
@app.route('/pose', methods = ['POST'])
def session_data():
    # Get pose landmark and user id data from React frontend
    data = request.get_json()
    # Ensure JSON data is receieved 
    if data is None:
        return jsonify({'Error Message' : 'No JSON data Received'}), 400
    
    pose_landmarks = data.get('pose_landmarks')
    user_id = data.get('user_id')

    # Ensure user_id is received before inserting into Supabase db 
    if user_id is None:
        return jsonify({'Error Message' : 'No user_id Received'}), 400
    # Ensure pose data is received 
    if pose_landmarks is None:
        return jsonify({'Error Message' : 'No Pose Landmark Received'}), 400

    # Insert user's session data into Supabase db
    try:
        # If user exists, upsert would update the corresponding row of the user
        # If its a new user, create a new row with the new user's credentials
        supabase_client.table('userprofiles').upsert({'user_id' : user_id}, on_conflict = 'user_id').execute()
    # If any errors occur during insertion of the user's session data (e.g. invalid data type, connection issues etc.)
    # Prevents flask backend from crashing due to insertion errors
    except Exception as e:
        return jsonify({'Error Message' : str(e)}), 500
    
    return jsonify({'Message' : 'Pose Landmark Successfully Received'}), 201

if __name__ == '__main__':
    app.run(debug = True)