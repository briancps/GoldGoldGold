# rep_state is a nested dictionary that stores exercise tracking state. 
# The top-level keys are exercise names, and each exercise maps to a dictionary containing its current position/state and rep count.
rep_state = {
    "pushup": {"position": "up", "count": 0},
    "situp": {"position": "down", "count": 0},
}


def reset_rep_state():
    # Resets the rep counter for both exercise types at end of the session
    rep_state["pushup"] = {"position": "up", "count": 0}
    rep_state["situp"] = {"position": "down", "count": 0}


def count_pushup_rep(elbow_angle: float) -> int:
    """
    Tracks push-up reps using elbow angle.

    Down position: elbow_angle <= 90
    Up position: elbow_angle > 170

    Valid rep: up --> down --> up

    Returns the current valid rep count.
    """
    # To avoid magic numbers, we declare the following variables:
    PUSHUP_DOWN_THRESHOLD_ANGLE = 90
    PUSHUP_UP_THRESHOLD_ANGLE = 170

    state = rep_state["pushup"]

    if state["position"] == "up" and elbow_angle <= PUSHUP_DOWN_THRESHOLD_ANGLE:
        state["position"] = "down"

    elif state["position"] == "down" and elbow_angle > PUSHUP_UP_THRESHOLD_ANGLE:
        state["position"] = "up"
        state["count"] += 1

    return state["count"]


def count_situp_rep(hip_angle: float) -> int:
    """
    Tracks sit-up reps using hip angle.

    Down position: hip_angle > 125
    Up position: hip_angle <= 55

    Valid rep: down --> up --> down

    Returns the current valid rep count.
    """
    # To avoid magic numbers, we declare the following variables:
    SITUP_DOWN_THRESHOLD_ANGLE = 125
    SITUP_UP_THRESHOLD_ANGLE = 55
    
    state = rep_state["situp"]

    if state["position"] == "down" and hip_angle <= SITUP_UP_THRESHOLD_ANGLE:
        state["position"] = "up"

    elif state["position"] == "up" and hip_angle > SITUP_DOWN_THRESHOLD_ANGLE:
        state["position"] = "down"
        state["count"] += 1

    return state["count"]