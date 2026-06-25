import pytest
from backend.utils import count_pushup_rep, reset_rep_state, count_situp_rep

VISIBLE = 0.8
NOT_VISIBLE = 0.2
UP_ELBOW_ANGLE = 165
PARTIAL_ELBOW_ANGLE = 120
DOWN_ELBOW_ANGLE = 85
UP_HIP_ANGLE = 165
PARTIAL_HIP_ANGLE = 140
SITUP_DOWN_ANGLE = 130
SITUP_UP_ANGLE = 50
SITUP_PARTIAL_UP_ANGLE = 60
SITUP_PARTIAL_DOWN_ANGLE = 120

# PUSH-UP TESTS
'''
Note:
count_pushup_rep(
    float(elbow_angle), 
    float(hip_angle), 
    float(shoulder_visibility), 
    float(elbow_visibility), 
    float(wrist_visibility), 
    float(hip_visibility), 
    float(knee_visibility))
'''
def test_pushup_neutral_to_up_position():
    reset_rep_state()
    count = count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0 # The user moved from neutral to up position --> doesn't count as valid rep yet

def test_pushup_valid_rep_count():
    reset_rep_state()
    count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count_pushup_rep(DOWN_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 1 # The user went from neutral -> up -> down -> up which counts as a valid rep

def test_pushup_multiple_valid_rep_count():
    reset_rep_state()
    for _ in range(5):
        count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
        count_pushup_rep(DOWN_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 5

def test_pushup_no_double_counting():
    reset_rep_state()
    count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count_pushup_rep(DOWN_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_pushup_rep(UP_ELBOW_ANGLE, UP_ELBOW_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 1  # staying in the up position after a valid rep won't add to the rep count

def test_pushup_partial_rep():
    reset_rep_state()
    count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    # User did not go fully down
    count_pushup_rep(PARTIAL_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0 # Partial reps do not count

def test_pushup_back_sags():
    reset_rep_state()
    count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    # User sags back such that its no longer straight
    count_pushup_rep(UP_ELBOW_ANGLE, PARTIAL_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    # User then tries to go down and up from this sagged position --> should not count as a valid rep as state resets to neutral when the user's back sag
    count_pushup_rep(DOWN_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0

def test_pushup_not_visible_landmarks_resets_state():
    reset_rep_state()
    count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    # User's shoulder went out of frame --> should reset state back to neutral
    count_pushup_rep(DOWN_ELBOW_ANGLE, UP_HIP_ANGLE, NOT_VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0

def test_pushup_start_from_proper_up_position():
    reset_rep_state()
    # Going straight down from a non proper up position
    count_pushup_rep(DOWN_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_pushup_rep(UP_ELBOW_ANGLE, UP_HIP_ANGLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0

# SIT-UP TESTS
'''
Note: count_situp_rep(hip_angle, shoulder_visibility, hip_visibility, knee_visibility):
'''
def test_situp_neutral_to_down_position():
    reset_rep_state()
    count = count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0 # The user moved from neutral to down position --> doesn't count as valid rep yet

def test_situp_valid_rep_count():
    reset_rep_state()
    count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count_situp_rep(SITUP_UP_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 1 # The user went from neutral -> down -> up -> down which counts as a valid rep

def test_situp_multiple_valid_rep_count():
    reset_rep_state()
    for _ in range(5):
        count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
        count_situp_rep(SITUP_UP_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 5

def test_situp_no_double_counting():
    reset_rep_state()
    count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count_situp_rep(SITUP_UP_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 1  # staying in the down position after a valid rep won't add to the rep count

def test_situp_partial_up_rep():
    reset_rep_state()
    count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    # User did not go fully up
    count_situp_rep(SITUP_PARTIAL_UP_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0 # Partial reps do not count

def test_situp_partial_down_rep():
    reset_rep_state()
    count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count_situp_rep(SITUP_UP_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    # User did not go fully down
    count = count_situp_rep(SITUP_PARTIAL_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0 # Partial reps do not count

def test_situp_not_visible_landmarks_resets_state():
    reset_rep_state()
    count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    # User's shoulder went out of frame --> should reset state back to neutral
    count_situp_rep(SITUP_UP_ANGLE, NOT_VISIBLE, VISIBLE, VISIBLE)
    count = count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0

def test_situp_start_from_proper_down_position():
    reset_rep_state()
    # Going straight up from a non proper down position
    count_situp_rep(SITUP_UP_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    count = count_situp_rep(SITUP_DOWN_ANGLE, VISIBLE, VISIBLE, VISIBLE)
    assert count == 0