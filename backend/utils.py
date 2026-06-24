# minimum threshold for a landmark to be considered visible (in this case its 50%)
# This threshold level balances out being overly strict and being overly lenient.
VISIBILITY_THRESHOLD = 0.5

rep_state = {
    "pushup" : {"position": "neutral", "count": 0},
    "situp" : {"position": "neutral", "count": 0},
}

def reset_rep_state():
    rep_state["pushup"] = {"position": "neutral", "count": 0}
    rep_state["situp"] = {"position": "neutral", "count": 0}

def count_pushup_rep(elbow_angle, hip_angle, shoulder_visibility, elbow_visibility, wrist_visibility, hip_visibility, knee_visibility):
    """
    Tracks push-up reps using elbow angle and hip angle.

    neutral position : starting state, user has not yet assumed proper up position
    up position : elbow_angle > 160 and hip_angle > 160 (proper up position)
    down position : elbow_angle < 90  AND hip_angle > 160 (proper down position)

    Valid rep sequence : neutral → up → down → up (count increments on return to up)

    Partial reps are not counted. If any required landmark is not visible,
    the state resets to neutral to prevent false counts.
    """
    # To avoid magic numbers, we declare the following variables:
    PUSHUP_DOWN_THRESHOLD_ANGLE = 90
    PUSHUP_UP_THRESHOLD_ANGLE = 160

    state = rep_state["pushup"]

    # check all required landmarks are actually visible in frame
    # if any landmark is not visible, we cannot trust the angles, so reset to neutral position to prevent false counts
    all_landmarks_visible = (
        shoulder_visibility > VISIBILITY_THRESHOLD and
        elbow_visibility > VISIBILITY_THRESHOLD and
        wrist_visibility > VISIBILITY_THRESHOLD and
        hip_visibility > VISIBILITY_THRESHOLD and
        knee_visibility > VISIBILITY_THRESHOLD
    )

    if not all_landmarks_visible:
        # all required landmarks are not reliably in frame --> reset state back to neutral position
        state["position"] = "neutral"
        return state["count"]

    # proper up position
    is_proper_up = elbow_angle > PUSHUP_UP_THRESHOLD_ANGLE and hip_angle > PUSHUP_UP_THRESHOLD_ANGLE

    # proper down position
    is_proper_down = elbow_angle < PUSHUP_DOWN_THRESHOLD_ANGLE and hip_angle > PUSHUP_UP_THRESHOLD_ANGLE

    if state["position"] == "neutral" and is_proper_up:
        # user has assumed proper starting position
        state["position"] = "up"

    elif state["position"] == "up" and is_proper_down:
        # user has gone down properly from the proper up position
        state["position"] = "down"

    elif state["position"] == "down" and is_proper_up:
        # user has returned to proper up position from the proper down positon --> a valid rep is completed
        state["position"] = "up"
        state["count"] += 1

    # Usage of tuple ("up", "down") to check that if user's state["position"] is in either up or down position and the hip angle is not
    # in accordance to standard, we return the user to the neutral position to avoid false reps. As a result, the user has to assume a
    # proper up position again before the user's following reps would be counted
    elif state["position"] in ("up", "down") and not hip_angle > PUSHUP_UP_THRESHOLD_ANGLE:
        state["position"] = "neutral"

    return state["count"]

def count_situp_rep(hip_angle, shoulder_visibility, hip_visibility, knee_visibility):
    """
    Tracks sit-up reps using hip angle.

    Down position: hip_angle > 125
    Up position: hip_angle <= 55

    Valid rep: down --> up --> down

    Partial reps are not counted. If any required landmark is not visible,
    the state resets to neutral to prevent false counts.

    Returns the current valid rep count.
    """
    # To avoid magic numbers, we declare the following variables:
    SITUP_DOWN_THRESHOLD_ANGLE = 125
    SITUP_UP_THRESHOLD_ANGLE = 55

    state = rep_state["situp"]

    # check all required landmarks are actually visible in frame
    # if any landmark is not visible, we cannot trust the angles, so reset to neutral position to prevent false counts
    all_landmarks_visible = (
        shoulder_visibility > VISIBILITY_THRESHOLD and
        hip_visibility > VISIBILITY_THRESHOLD and
        knee_visibility > VISIBILITY_THRESHOLD
    )

    if not all_landmarks_visible:
        # all required landmarks are not reliably in frame --> reset state back to neutral position
        state["position"] = "neutral"
        return state["count"]

    # proper down position
    is_proper_down = hip_angle > SITUP_DOWN_THRESHOLD_ANGLE

    # proper up position
    is_proper_up = hip_angle <= SITUP_UP_THRESHOLD_ANGLE

    if state["position"] == "neutral" and is_proper_down:
        # user has assumed proper starting position (lying flat)
        state["position"] = "down"

    elif state["position"] == "down" and is_proper_up:
        # user has sat up properly from the proper down position
        state["position"] = "up"

    elif state["position"] == "up" and is_proper_down:
        # user has returned to proper down position from the proper up position --> a valid rep is completed
        state["position"] = "down"
        state["count"] += 1

    return state["count"]