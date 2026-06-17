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

# To ensure flask backend receives user_email, angle and exercise_type and returns a response
@app.route('/pose', methods = ['POST'])
def session_data():
    # Get user_email, exercise_type and angle data from React frontend
    data = request.get_json()
    # Ensure JSON data is receieved 
    if data is None:
        return jsonify({'Error Message' : 'No JSON data Received'}), 400
    
    angle = data.get('angle')
    exercise_type = data.get('exercise_type')
    user_email = data.get('user_email')

    # Ensure user_email is received before inserting into Supabase db 
    if user_email is None:
        return jsonify({'Error Message' : 'No user_email Received'}), 400
    # Ensure exercise type is received 
    if exercise_type is None:
        return jsonify({'Error Message' : 'No Exercise Type Received'}), 400
    # Ensure angle is received
    if angle is None:
        return jsonify({'Error Message' : 'No Angle Received'}), 400
    
    if exercise_type == 'push-up' :
        # float(angle) ensures angle is treated as a numeric value
        count = count_pushup_rep(float(angle))
    elif exercise_type == 'sit-up' :
        count = count_situp_rep(float(angle))
    else :
        return jsonify({'Error Message' : f"Invalid Exercise Type : {exercise_type}"}), 400
    
    return jsonify({'Valid Count' : count}), 200

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