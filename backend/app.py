from flask import Flask, request, jsonify
from flask_cors import CORS
from backend.supabase_connection import supabase_client
from backend.utils import count_pushup_rep, count_situp_rep, reset_rep_state

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

    elbow_angle = data.get("elbow_angle")
    hip_angle = data.get("hip_angle")
    shoulder_visibility = data.get("shoulder_visibility")
    elbow_visibility = data.get("elbow_visibility")
    wrist_visibility = data.get("wrist_visibility")
    hip_visibility = data.get("hip_visibility")
    knee_visibility = data.get("knee_visibility")
    user_email = data.get("user_email")
    exercise_type = data.get("exercise_type")

    # Tuple containing the required fields common to both push-ups and sit-ups for rep counting
    required_fields = (hip_angle, shoulder_visibility, hip_visibility, knee_visibility, user_email, exercise_type)

    # If any of the field is missing, send an error message
    if any(field is None for field in required_fields):
        return jsonify({'Error Message' : 'Missing Required Fields'}), 400

    if exercise_type == 'push-up' :
        # need to include the additional fields for push-ups specifically (elbow_angle, elbow_visibility, wrist_visibility)
        if any(field is None for field in (elbow_angle, elbow_visibility, wrist_visibility)):
            return jsonify({'Error Message' : 'Missing Required Fields'}), 400 
        # float(angle) ensures angle is treated as a numeric value
        count = count_pushup_rep(float(elbow_angle), float(hip_angle), float(shoulder_visibility), float(elbow_visibility), float(wrist_visibility), float(hip_visibility), float(knee_visibility))
    elif exercise_type == 'sit-up' :
        count = count_situp_rep(float(hip_angle), float(shoulder_visibility), float(hip_visibility), float(knee_visibility))
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

@app.route("/session/reset", methods = ["POST"])
def session_reset():
    reset_rep_state()
    return jsonify({"Message" : "Session has been resetted!"})

if __name__ == '__main__':
    app.run(debug = True)