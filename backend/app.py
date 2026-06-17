from flask import Flask, request, jsonify
from flask_cors import CORS
from supabase_connection import supabase_client
from utils import count_pushup_rep, count_situp_rep, reset_rep_state

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
    # Get user_email, exercise_type and angle data from React frontend
    data = request.get_json()
    # Ensure JSON data is receieved 
    if data is None:
        return jsonify({'Error Message' : 'No JSON data Received'}), 400
    
    pose_landmarks = data.get('pose_landmarks')
    user_email = data.get('user_email')

    # Ensure user_email is received before inserting into Supabase db 
    if user_email is None:
        return jsonify({'Error Message' : 'No user_email Received'}), 400
    # Ensure pose data is received 
    if pose_landmarks is None:
        return jsonify({'Error Message' : 'No Pose Landmark Received'}), 400

    # Insert user's session data into Supabase db
    try:
        # If user exists, upsert would update the corresponding row of the user
        # If its a new user, create a new row with the new user's credentials
        supabase_client.table('userprofiles').upsert({'user_email' : user_email}, on_conflict = 'user_email').execute()
    # If any errors occur during insertion of the user's session data (e.g. invalid data type, connection issues etc.)
    # Prevents flask backend from crashing due to insertion errors
    except Exception as e:
        return jsonify({'Error Message' : str(e)}), 500
    
    return jsonify({'Message' : 'Pose Landmark Successfully Received'}), 201

@app.route("/session/save", methods = ["POST"])
def session_save():
    data = request.get_json()
    if data is None:
        return jsonify({'Error Message' : 'No JSON data Received'}), 400
    
    user_email = data.get('user_email')
    exercise_type = data.get('exercise_type')
    rep_count = data.get('rep_count')

    if user_email is None:
        return jsonify({'Error Message' : 'No user_email Received'}), 400
    if exercise_type is None:
        return jsonify({'Error Message' : 'No Exercise Type Received'}), 400
    if rep_count is None:
        return jsonify({'Error Message' : 'No Rep Count Received'}), 400
    
    try:
        supabase_client.table('userprofiles').insert({
            'user_email' : user_email,
            'exercise_type' : exercise_type,
            # int(rep_count) is to ensure rep_count data is forwarded to Supabase as in integer to be saved as expected
            'rep_count' : int(rep_count)
        }).execute()
    except Exception as err:
        return jsonify({'Error Message' : str(err)}), 500
    
    # After session ends and the current user's session data has been saved to Supabase, we reset the rep state so that the next session starts afresh
    reset_rep_state()

    return jsonify({'Message' : "User's Session Data Has Been Saved Successfully"}), 201

if __name__ == '__main__':
    app.run(debug = True)