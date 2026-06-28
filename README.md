# GoldGoldGold

<img src="images/pic1.png">

**Team ID:** 6897

**Level of Achievement:** Apollo

**Team Members:** Brian Chua Peng Shuen, Ian Wong Wei Jie

**Milestone:** 2

**GitHub:**
[[https://github.com/briancps/GoldGoldGold.git]{.underline}](https://github.com/briancps/GoldGoldGold.git)

**Deployment:**
[[https://goldgoldgold-nq1y.onrender.com]{.underline}](https://goldgoldgold-nq1y.onrender.com)

## Table of Contents

1.  Problem Motivation

2.  Target Audience

3.  Our Solution

4.  Features

5.  Tech Stack

6.  System Architecture

7.  Design

8.  Planning & Version Control

9.  Technical Proof of Concept

10. Testing

11. Development Plan

##  

## 1. Problem Motivation

Many Singaporean males are required to complete the Individual Physical
Proficiency Test (IPPT) as part of their National Service (NS) journey.
Excelling in the static stations of IPPT, which includes push-ups and
sit-ups, depends not only on physical fitness but also on one's ability
to perform each repetition according to strict standards enforced by
ELISS machines.

A common challenge faced by NSFs/NSmen when training for the static
stations on their own, is the inability to accurately determine whether
repetitions done meet the standards of the ELISS machines. Without
feedback on their form, NSFs/NSmen training may unknowingly develop
improper form, resulting in a difference between training performance
and the actual IPPT performance.

To overcome this issue, we propose a computer vision-based exercise
monitoring system that tracks body landmarks in real time. By analyzing
pose data, the system can evaluate exercise form (for both push-ups and
sit-ups), count valid repetitions, and provide corrective feedback when
standards are not met. This solution serves as a personal IPPT training
assistant, enabling NSFs/NSmen to practice more effectively and
reliably, helping them build confidence in excelling the static stations
for IPPT.

## 2. Target Audience

**Primary users:** Full-time National Servicemen (NSFs) and
Operationally Ready National Servicemen (NSmen) who are required to take
the Individual Physical Proficiency Test (IPPT) as part of their service
requirements and looking for a reliable way to train for the static
stations (push-ups and sit-ups).

**Secondary users:** Pre-enlistees who wish to gauge their standards and
prepare for the pre-enlistment IPPT.

## 3. Our Solution

Our project is a web application designed to help NSFs and NSmen train
more effectively for the static stations of the IPPT. By utilising
computer vision and pose detection through the users;s device webcam,
the system tracks the user's body pose landmarks in real time and
evaluates their exercise performance according to strict standards. The
web app currently supports push-ups and sit-ups, automatically counting
valid reps.

The application directly addresses the difficulty of self-training for
IPPT without access to ELISS machines or external supervision. Planned
features (for milestone #3) such as exercise form feedback, workout
history, and video capture further strengthen the application's role as
a personal IPPT training assistant, enabling users to monitor their
progress, review their performance, and improve their exercise technique
over time. Ultimately, the system aims to provide NSFs and NSmen with a
more reliable and accessible way to prepare for the IPPT static
stations.

**Link to web application:**
[[https://goldgoldgold-nq1y.onrender.com]{.underline}](https://goldgoldgold-nq1y.onrender.com)

## 4. Features

### Feature 1: User Authentication

![-{{git_url\>https://github.com/briancps/GoldGoldGold/blob/main/images/mPE_Image_2.png}}](media/image7.png){width="2.764607392825897in"
height="4.057292213473316in"}![-{{git_url\>https://github.com/briancps/GoldGoldGold/blob/main/images/hge_Image_3.png}}](media/image35.png){width="2.6916513560804898in"
height="4.058181321084865in"}

![-{{git_url\>https://github.com/briancps/GoldGoldGold/blob/main/images/knA_Image_4.png}}](media/image23.png){width="2.7083333333333335in"
height="0.625in"}![](media/image30.png){width="1.1354166666666667in"
height="0.5833333333333334in"}

**Milestone:** 1

**Status:** Implemented

**User role:** Registered user

**What it does:** Allows users to sign up for an account, login with the
registered credentials and logout when they are done. Authenticated
users would be able to access features within our web app (push-up and
sit-up rep counter) and maintain a personalised session for the
currently logged in user.

**Complexity justification:** . The React frontend communicates directly
with Supabase via the *\@supabase/supabase-js* client library to handle
user authentication (e.g. await supabase.auth.signUp({email, password}
and await supabase.auth.signInWithPassword({email, password} for sign up
and login respectively). To restrict access to pages outside of the
login page for route protection, we validate the user's session before
granting access to these pages. More specifically, we obtain the user's
session via await supabase.auth.getSession(); and if no such valid
session exists, we redirect the user back to the login page.

**Design decisions:** We chose Supabase over other databases such as
Firebase because Supabase provides direct access to a PostgreSQL
relational database within a single platform. This made it easier to
organise and query the required data using a table with relevant columns
such as *user_email*, *exercise_type*, *created_at*, *rep_count* and
*id*. In addition, Supabase provides built-in user authentication,
allowing us to manage both our database and user authentication within a
single platform.

### Feature 2: Main Page

![](media/image28.png){width="5.635416666666667in"
height="2.819776902887139in"}

**Milestone:** 2

**Status:** Implemented

**User role:** Registered user

**What it does:** The main page is where users select the exercise of
their choice (between push-ups and sit-ups). Clicking on the selected
exercise will direct users to its associated page. The main page also
informs new users of a potential technical glitch and inaccuracy of the
rep counter display due to a cold start of render (our chosen deployment
site).

**Complexity justification:** It seamlessly navigates users to the
relevant exercise pages via different routes which have their own
internal logic. It also makes use of visual icons that aid in a more
straightforward user interface and experience.

**Design decisions:** The main page is essentially a one-stop place
showing all possible exercises to be done (in this case, two exercises).
This also means that it is easily scalable in the event that more
exercises need to be incorporated, and easily changeable should the
format of IPPT change.

### Feature 3: Start Button

![](media/image17.png){width="1.8400995188101488in"
height="0.8118088363954505in"}

**Milestone:** 2

**Status:** Implemented

**User role:** Registered user

**What it does:** Triggers the 10s countdown to allow users to get into
the appropriate position. Following that, the 60s timer would begin its
countdown signalling the official start of the session for the user.

**Complexity justification:** Under the hood, it triggers a
handleSessionStart() function that ensures that the rep count displayed
is set at 0 and marks the session as being active and the timer as
counting down. This prevents wrongly displaying a previous workout rep
count due to carryover data.

**Design decisions:** From a user's perspective, one would not want the
session to begin immediately upon clicking as it might create
unnecessary pressure. Thus, having the start button means the user is in
control, and can begin only when they are ready.

###  

### Feature 4: 10s Preparation Timer and 60s Session Timer

![](media/image11.png){width="2.834009186351706in"
height="1.5779385389326335in"}![](media/image20.png){width="1.3854166666666667in"
height="0.5520833333333334in"}

**Milestone:** 2

**Status:** Implemented

**User role:** Registered user

**What it does:** The 10 seconds is meant for users to have ample time
to get into the appropriate starting position before the official start
of the session. The 60 seconds is to simulate the actual IPPT where a
participant has only 60 seconds to do as many reps as they can and
maximise their score.

**Complexity justification:** This timer component is shared across both
the push-up page and sit-up page, preventing redundant code duplication.
It ticks down every second just like a countdown timer, and carefully
cleans up to prevent multiple timeouts from accumulating simultaneously.

**Design decisions:** We wanted to give users sufficient time to get
into ready position after clicking the Start button, rather than
immediately starting which we can imagine users rushing to get into
position so as not to waste precious seconds that could make all the
difference.

### Feature 5: Webcam Feed & Pose Detection

![](media/image43.png){width="5.313765310586176in"
height="2.9216885389326333in"}

![](media/image45.png){width="5.303641732283465in"
height="2.8976509186351707in"}

![](media/image47.png){width="2.197082239720035in"
height="2.627150043744532in"}![](media/image40.png){width="1.43373687664042in"
height="2.5750667104111984in"}![](media/image40.png){width="1.4552077865266841in"
height="2.4813167104111984in"}

The above is obtained from
[[https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker]{.underline}](https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker)

**Milestone:** 2

**Status:** Implemented

**User role:** Registered user

**What it does:** Detected body landmarks are rendered as a skeletal
overlay on the video stream, with gold landmarks connected by white
lines to provide a clear visual representation of the user\'s movements
and posture.

**Complexity justification:** The system captures the user\'s webcam
feed and performs real-time body pose detection using the
*\@mediapipe/tasks-vision* client library. The Webcam component
asynchronously loads MediaPipe's WebAssembly (WASM) runtime, initialises
the PoseLandmarker model, accesses the webcam, and runs a continuous
frame detection loop. This is also a reusable component shared between
both push-up page and sit-up page to prevent redundant code duplication.

**Design decisions:** We used the pose_landmarker_full model over the
lite and heavy variants to balance accuracy and performance latency,
providing sufficiently precise landmark coordinates for angle
calculations while maintaining smooth real-time detection in the browser
without excessive computational overhead, given that it is meant to run
on a standard consumer laptop. The skeletal landmarks are coloured gold
to match the overall theme and aesthetic of our product. The canvas is
also mirrored to produce a more natural mirror-view for the user.

### Feature 6: Timer Display and Live Rep Counter Display

![](media/image16.png){width="4.546875546806649in"
height="1.1763057742782153in"}

**Milestone:** 2

**Status:** Implemented

**User role:** Registered user

**What it does:** 10s countdown timer prompts users to get into the
appropriate position. Following that, the 60s timer signals the official
start of the session, whereby users would then start carrying out
push-up/sit-up reps. The live rep counter would then allow users to view
how many valid reps have been performed so far.

**Complexity justification:** Shows a non-static countdown timer that
updates (by ticking down) every second from 60 and a dynamic rep counter
that changes whenever a user completes a successful rep, displayed
throughout the whole session.

**Design decisions:** The two are displayed prominently side by side
above the webcam feed, allowing users to monitor both simultaneously
without being distracted from their exercise. This is extremely useful
for users because it tells you how much time is left and the number of
successful reps performed without you needing to self-track. This also
allows you to gauge your performance against your own targets and
expectations.

### Feature 7: Push-up Rep Counter

**Milestone:** 2

**Status:** Implemented

**User role:** Registered user

**What it does:** Tracks the number of valid push-up reps performed by
user

**Complexity justification:** It is essentially a 3-state machine
(neutral, up, down) that simultaneously tracks both elbow and hip angles
to enforce a proper push-up form. The 'neutral' starting state ensures
the system cannot assume the user begins in the correct position, but
rather enforces them to be in the 'proper up' position. Landmark
visibility is also checked using a threshold of 0.5 before every state
transition, resetting back to 'neutral' if they fall below the
threshold, thereby ensuring the whole body is within frame for the reps
to count.

**Design decisions:** We used the shoulder, elbow, and wrist landmarks
to calculate the elbow angle, and the shoulder, hip, and knee landmarks
to calculate the hip angle. The hip angle check is needed to ensure that
users have a (relatively) straight back throughout the rep, apart from
just being down low enough and up high enough via the elbow angles.

The following is what we defined to be in a 'proper up' position and
'proper down' position:

is_proper_up = elbow_angle \> 160 and hip_angle \> 160

is_proper_down = elbow_angle \< 90 and hip_angle \> 160

We first referenced videos depicting proper form and traced the joints
on a piece of paper and calculated the angle manually with a protractor,
using this as a ballpark figure. Then, we conducted iterative testing by
varying the thresholds around these initial estimates until we arrived
at values that were sufficiently strict to distinguish valid repetitions
while maintaining accurate rep counting. It is also worth noting that
the calculated joint angles may be imprecise due to landmark
localisation errors, occlusions, and variations in camera perspective,
as well as minor numerical errors arising from floating-point
computations.

### Feature 8: Sit-up Rep Counter

**Milestone:** 2

**Status:** Implemented

**User role:** Registered user

**What it does:** Tracks the number of valid sit-up reps performed by
user

**Complexity justification:** Likewise, it is essentially a 3-state
machine (neutral, up, down) that tracks hip angles to enforce a proper
sit-up form. The 'neutral' starting state ensures the system cannot
assume the user begins in the correct position, but rather enforces them
to be in the proper 'down' position and lying flat. Landmark visibility
is also checked using a threshold of 0.5 before every state transition,
resetting back to 'neutral' if they fall below the threshold, thereby
ensuring the whole body is within frame for the reps to count.

**Design decisions:** The hip angle is tracked since the torso is the
primary body part moving in a sit-up. We used the shoulder, hip, and
knee landmarks to calculate the hip angle.

The following is what we defined to be in a 'proper down' position and
'proper up' position:

is_proper_down = hip_angle \> 125

is_proper_up = hip_angle \<= 55

Likewise, we first referenced videos depicting proper form and traced
the joints on a piece of paper and calculated the angle manually with a
protractor, using this as a ballpark figure. Then, we conducted
iterative testing by varying the thresholds around these initial
estimates until we arrived at values that were sufficiently strict to
distinguish valid repetitions while maintaining accurate rep counting.
It is also worth noting that the calculated joint angles may be
imprecise due to landmark localisation errors, occlusions, and
variations in camera perspective, as well as minor numerical errors
arising from floating-point computations.

###  

### Supporting Utility Function: calculateAngle(pointA, pointB, pointC)

**Milestone:** 1

**Status:** Implemented

**User role:** Registered user

**What it does:**

The calculateAngle function takes in 3 landmarks (pointA, pointB,
pointC) as arguments, and outputs the interior angle formed at the
second landmark, that is, pointB as the vertex. This means that pointB
is treated as the joint (like the elbow, hip etc.).

To achieve this, we use the mathematical concept of vectors.
Specifically, the dot product of two vectors, given by the equation:

$\overrightarrow{BA}$ $\bullet$ $\overrightarrow{BC}$ =
$\left| \overrightarrow{BA} \right|\left| \overrightarrow{BC} \right|\ cos\theta$

where $\theta$ is our desired angle.

Rearranging, we get:

$\cos\theta = \frac{\overrightarrow{BA}\  \bullet \ \overrightarrow{BC}}{\left| \overrightarrow{BA} \right|\left| \overrightarrow{BC} \right|}$

Since it is possible for a vector to have a magnitude of 0, the angle is
undefined because the denominator is 0 and an error is thrown.

Furthermore, due to floating-point precision errors, the computed value
of $\cos\theta$ may be slightly outside the valid range
\[$-$`<!-- -->`{=html}1, 1\], which would cause $\arccos$ to return NaN
(Not a Number). To prevent this, we perform clamping to restrict the
value to indeed be in the interval \[$-$`<!-- -->`{=html}1, 1\]:

$max( -$`<!-- -->`{=html}1$,min(1,cos\theta))$.

Applying $\arccos$ to this clamped value will return $\theta$ in
radians, which is then converted to degrees by multiplying by:

$\frac{180}{\pi}$

**Complexity justification:** The function utilises the mathematical
concept of vectors, showing a useful application of linear algebra in
real world contexts. Two edge cases are also taken care of: a
divide-by-zero guard in the event of zero-length vectors, and clamping
the value passed into Math.acos() to strictly be in the interval
\[$-$`<!-- -->`{=html}1, 1\] to prevent NaN.

**Design decisions:** We used only the x and y-coordinates since the
webcam captures a 2D projection of the user's movement from a fixed
side-on angle. Degrees are returned rather than radians as they are more
intuitive for threshold comparisons in the rep counting logic.

### Feature 9: Results Overlay

![](media/image8.png){width="5.675521653543307in"
height="3.1300218722659667in"}

**Milestone:** 2

**Status:** Implemented

**User role:** Registered user

**What it does:** At the end of the 60s session, the results overlay
would appear on the live webcam feed. This allows users to see the
exercise type completed and the number of valid reps performed for that
specific exercise type within the 60s session. It also gives users the
option to try again or to change exercise

**Complexity justification:** The results overlay essentially acts as a
summary of the session, The 'Try Again' button will re-trigger the same
event loop for the user to seamlessly redo the same exercise. The
'Change Exercise' button navigates the user back to the Main Page
displaying all the exercises available.

**Design decisions:** The 'Try Again' button was added so that users can
simply redo the exercise without the hassle of going back to the Main
Page and reselecting the same exercise. Currently, there are only 2
exercises available, and thus one may question why the 'Change Exercise'
button does not simply navigate directly to the other exercise's page.
This design choice was made with scalability in mind. By returning users
to the Main Page (which displays all available exercises) the navigation
flow remains consistent even as additional exercises are introduced in
the future. This avoids implementing special-case logic that only works
when exactly two exercises are available.

###  

### Feature 10: Exercise Form Feedback

**Milestone:** Proposed for Milestone #3

**Status:** Not Started

**User role:** Registered user

**What it does:** When improper form is detected, feedback messages will
be displayed to inform the user. For example, if the user is not going
down low enough on a push-up, or not lying flat on their back at the
bottom of a sit-up, among other incorrect postures. This allows users to
know what their mistake is and correct it.

**Complexity justification:**

![](media/image34.png){width="6.267716535433071in"
height="1.0138888888888888in"}

![](media/image27.png){width="3.5156255468066493in"
height="1.0191568241469817in"}

This feature would extend the existing rep-counting logic by introducing
additional posture validation. Whereby if the user does not meet the
proper up/down position as per what we implemented, a feedback message
would then be displayed with the appropriate context to the user. These
checks are performed continuously during the session and the
corresponding feedback messages must be displayed in real-time where
appropriate.

**Design decisions:** Since utils.py in our backend handles the rep
counting logic, following the Separation of Concerns principle, the
additional posture validation to be done can be integrated into that
file too. The feedback messages to be displayed can also be added and
forwarded to React frontend to be displayed in real time to the users.

### Feature 11: Workout History

**Milestone:** Proposed for Milestone #3

**Status:** Not Started

**User role:** Registered user

**What it does:** Past workout sessions will be displayed on the
dashboard, fetched from Supabase and filtered by the logged-in user,
allowing users to be able to track and monitor their progress over time.

**Complexity justification:** This feature requires retrieving past
exercise session data from Supabase and displaying them under a
'History' tab for each user. Specifically, for each and every user, we
would have to query our PostgreSQL database for that specific user and
retrieve their past exercise session records and display them nicely in
the 'History' tab for users to track and view their progress.

**Design decisions:**

![](media/image42.png){width="4.578125546806649in"
height="1.922455161854768in"}

Currently, with these columns to store the respective data in our table,
we can identify the currently logged in user via *userEmailRef.current*,
which allows us to obtain specifically that user's past exercise session
data to be displayed in their 'History' tab.

### Feature 12: Video Capture

**Milestone:** Proposed for Milestone #3

**Status:** Not Started

**User role:** Registered user

**What it does:** Users will be able to save and rewatch a recording of
their workout session so that they can review their performance.

**Complexity justification:** We intend to utilise MediaRecorder API and
integrate it into our existing Webcam component. Recording will only
begin after the 10s preparation countdown (via *handleSessionStart*),
and stop when the 60s exercise session ends (via *handleSessionEnded*),
and the resulting video will be uploaded and saved as a video url in our
Supabase table. This video url would then be included as an additional
field in users' "History" tab for them to view their form and possibly
improve/maintain it.

**Design decisions:** Since *handleSessionStart* and
*handleSessionEnded* handles when the session officially begins and ends
respectively**,** following the Separation of Concerns principle, the
additional feature to record for future playback can be integrated into
these two functions.

## 5. Tech Stack

+----------------------+--------------------+-----------------------+
| **Layer**            | **Technology**     | **Why we chose it**   |
+======================+====================+=======================+
| Frontend             | React with Vite +  | React allows us to    |
|                      | TypeScript         | build reusable UI     |
|                      |                    | components to be used |
|                      |                    | across our project.   |
|                      |                    | Specifically, we made |
|                      |                    | components to display |
|                      |                    | timers, webcam with   |
|                      |                    | skeletal overlay, and |
|                      |                    | result overlays to be |
|                      |                    | displayed at the end  |
|                      |                    | of the session,       |
|                      |                    | making it easier to   |
|                      |                    | maintain and expand   |
|                      |                    | our web app. (these   |
|                      |                    | components were       |
|                      |                    | utilised across our   |
|                      |                    | pages)                |
|                      |                    |                       |
|                      |                    | TypeScript provides   |
|                      |                    | static type checking, |
|                      |                    | which reduces runtime |
|                      |                    | errors and improves   |
|                      |                    | code reliability      |
|                      |                    | during development    |
|                      |                    | and system testing.   |
+----------------------+--------------------+-----------------------+
| Backend              | Python (Flask)     | Python was chosen     |
|                      |                    | because it offers     |
|                      |                    | beginner friendly     |
|                      |                    | backend server        |
|                      |                    | development while     |
|                      |                    | working well with our |
|                      |                    | exercise rep-counting |
|                      |                    | logic.                |
|                      |                    |                       |
|                      |                    | Flask provides a REST |
|                      |                    | API framework that    |
|                      |                    | allows the frontend   |
|                      |                    | to send data (e.g.    |
|                      |                    | elbow angle, hip      |
|                      |                    | angle and visibility  |
|                      |                    | scores) back to it    |
|                      |                    | and forward this data |
|                      |                    | to our file in the    |
|                      |                    | backend responsible   |
|                      |                    | for rep-counting and  |
|                      |                    | thus track valid reps |
|                      |                    | performed and send    |
|                      |                    | this data back to the |
|                      |                    | frontend to be        |
|                      |                    | displayed in the live |
|                      |                    | rep counter.          |
+----------------------+--------------------+-----------------------+
| Database             | PostgreSQL         | PostgreSQL provides a |
|                      |                    | relational database   |
|                      | (via Supabase)     | that offers a         |
|                      |                    | structured table with |
|                      |                    | columns. This makes   |
|                      |                    | it suitable for       |
|                      |                    | storing user and      |
|                      |                    | exercise session      |
|                      |                    | data, for them to be  |
|                      |                    | utilised via querying |
|                      |                    | later on to implement |
|                      |                    | our feature of        |
|                      |                    | "Workout History"     |
+----------------------+--------------------+-----------------------+
| Authentication       | Supabase auth      | Supabase Auth         |
|                      |                    | provides secure user  |
|                      |                    | authentication        |
|                      |                    | without requiring us  |
|                      |                    | to build our own      |
|                      |                    | authentication        |
|                      |                    | system.               |
+----------------------+--------------------+-----------------------+
| Hosting              | Render             | Render offers         |
|                      |                    | deployment for both   |
|                      | (frontend &        | frontend and backend  |
|                      | backend)           | services. It supports |
|                      |                    | automatic deployments |
|                      |                    | from Git repositories |
|                      |                    | (based on our latest  |
|                      |                    | commits), which makes |
|                      |                    | it efficient and      |
|                      |                    | easier for us.        |
+----------------------+--------------------+-----------------------+
| Computer Vision      | MediaPipe Tasks    | MediaPipe provides    |
|                      | Vision             | real-time human pose  |
|                      |                    | landmark detection    |
|                      |                    | directly within the   |
|                      |                    | browser. This allows  |
|                      |                    | the coordinates of    |
|                      |                    | the 33 pose landmarks |
|                      |                    | to be extracted       |
|                      |                    | efficiently, enabling |
|                      |                    | our web app to carry  |
|                      |                    | out our rep-counting  |
|                      |                    | logic and give        |
|                      |                    | feedback on their     |
|                      |                    | form too.             |
+----------------------+--------------------+-----------------------+

**How the stack fits together:** The React frontend uses information
from the webcam feed and MediaPipe to extract the user's pose landmark
coordinates in real time. Data such as elbow angle, hip angle and
visibility scores are sent to the Flask backend, which processes the
data using the exercise rep-counting logic and returns the updated valid
rep count to the frontend. Supabase Auth handles user authentication,
while exercise session data and user data are stored in the PostgreSQL
database through Supabase. Both the frontend and backend services are
deployed on Render and communicate through HTTPS.

##  

## 6. System Architecture

**Architecture Diagram:**

![](media/image14.png){width="6.267716535433071in"
height="4.472222222222222in"}

**Explanation:** The system consists of five major components: the React
frontend, MediaPipe pose detection, Flask backend, rep-counting logic,
and Supabase PostgreSQL database and authentication service.

When a user starts a push-up/sit-up session, the React frontend utilises
the user's device webcam and triggers MediaPipe pose detection within
the browser. MediaPipe extracts pose landmark coordinates, which are
used by our TypeScript angle calculation function to compute features
such as elbow angle, hip angle, and visibility scores.

These computed values are sent to the Flask backend through the */pose*
API endpoint. The backend passes the data to the rep-counting functions
in *utils.py*, which determine whether a valid rep has been completed
and return the updated rep count to the frontend for our live rep
counter display.

At the end of the 60s exercise session, the frontend sends the session
results to the */session/save* API endpoint. The backend stores the
exercise session data in Supabase (namely *user_email*, *exercise_type*,
*created_at*, *rep_count* and *id*) , while Supabase authentication
manages user login/sign-up and ensures only authenticated users can
access the pages beyond the login page.

**User Flow / Use Cases:**

[1st key user journey:]{.underline}

Actor: Registered user

Goal: View real-time rep counting results.

Steps:

1.  The user logs into the application.

2.  The user selects an exercise. (either push-up or sit-up)

3.  The frontend utilises the user's device webcam and starts MediaPipe
    pose detection.

4.  User's pose landmark coordinates are sent to our TypeScript angle
    calculation function to calculate elbow angle, hip angle.

5.  Elbow angle, hip angle and visibility scores are sent to the Flask
    backend.

6.  The backend evaluates the data via utils.py to determine if a valid
    rep has been performed by the user and updates the rep count.

7.  The live rep count is updated and displayed on the screen.

Outcome: The user is able to view real-time rep counting while
performing the exercise.

[2nd key user journey:]{.underline}

Actor: Registered user

Goal: Save exercise results after completing a session.

Steps:

1.  The user completes the 60s exercise session.

2.  The frontend sends the session information to the backend through
    the */session/save* API endpoint.

3.  The backend validates the request and stores the session data in
    Supabase.

4.  The session record is associated with the currently logged in
    user\'s email.

Outcome: The completed workout session is stored and saved under the
currently logged in user.

## 7. Design

### 7.1 Design Diagrams

> ![](media/image1.png){width="3.25in" height="3.0208333333333335in"}

Our web app currently stores the users' completed exercise sessions in a
single table. Each record contains the user\'s email, exercise type, rep
count, and the timestamp of the workout session. This design was chosen
so as to save and store users' completed exercise session data. These
records can then be queried in the following Milestone to support
features such as "Workout History"

![](media/image6.png){width="6.267716535433071in" height="5.625in"}

The sequence diagram depicts the interactions between the user, frontend
components, backend server, and database during a push-up session
(assuming the user chose to do push-ups). The user first selects an
exercise from the main page (push-up in this case), after which the
webcam component continuously performs pose detection. The detected pose
landmark coordinates are then utilised by our angle calculation function
to get the elbow and hip angles. These angles along with visibility
scores of key pose landmarks are then forwarded and processed by the
Flask backend to determine the valid rep count, and the completed
session is subsequently stored in Supabase at the end of 60s. This
separation of responsibilities between our various components keeps the
user interface, exercise logic, and data storage independent and easier
to maintain and understand.

### 

### 

###  

### 7.2 Design Principles & Patterns *(Apollo / Artemis)*

**Single Responsibility Principle (SRP):**
![](media/image9.png){width="6.267716535433071in"
height="0.19444444444444445in"}![](media/image12.png){width="4.984375546806649in"
height="0.23910323709536307in"}![](media/image2.png){width="6.267716535433071in"
height="0.1527777777777778in"}

The frontend components are designed such that each component is
responsible for a single concern. For example, the Webcam component
handles the user's device webcam initialisation and pose detection, the
Timer component manages the 10s preparation countdown and 60s session
timer, and the ResultsOverlay component is solely responsible for
displaying the session results and exorcist type at the end of the 60s.
This separation improves readability and maintainability while also
allowing individual components to be modified independently.

**Separation of Concerns (SoC):**

Referencing our system architecture diagram and sequence diagram above,
our web app separates the user interface, rep counting logic, and
session data storage into different layers. React components handle the
user interface and session state, the Flask backend performs the
validation of reps performed by the user and sends the updated rep count
to the frontend, while Supabase manages user authentication and session
data storage. This separation reduces coupling between the various
components we have and makes our web app easier to maintain and extend.

![](media/image37.png){width="1.2518318022747157in"
height="2.2343755468066493in"}

Our overall project folder structure is also neatly organised into the
different directories.

**Don't repeat yourself (DRY):**

![](media/image38.png){width="1.8072922134733158in"
height="1.5274015748031495in"}![](media/image10.png){width="6.267716535433071in"
height="0.75in"}

We implemented reusable components and a utility function to minimise
code duplication throughout our web app. For example, our
*calculateAngle* utility function is used whenever elbow or hip angles
need to be computed, instead of repeated angle calculation logic across
our push-up and sit-up pages. On the other hand, our reusable components
such as Timer, Layout, Webcam, and ResultsOverlay are shared across our
push-up and sit-up pages with their respective roles as mentioned under
SoC. This reduces redundant code and eliminates duplication of any code,
which also makes it easier to maintain/improve on in the future.

**Coding Standards:**

We followed standard naming conventions and style guidelines:

- We avoided using "magic numbers". For example, we defined named
  constants for our angle thresholds and references the constants
  throughout the code instead of hard-coding the numbers everywhere.
  This improves readability by making the purpose of the value explicit
  and simplifies future changes. If the threshold angle needs to be
  updated, then it only needs to be changed in one line of code rather
  than searching for every occurrence of the hard-coded numbers, thereby
  reducing the risk of missing instances or accidentally modifying
  unrelated values.

![](media/image25.png){width="3.026042213473316in"
height="0.4322922134733158in"}![](media/image18.png){width="3.1302088801399823in"
height="0.41940726159230096in"}

- We followed the React JS naming conventions as described in
  [[https://dev.to/kristiyanvelkov/react-js-naming-convention-lcg]{.underline}](https://dev.to/kristiyanvelkov/react-js-naming-convention-lcg).
  For our components, we used PascalCase and gave it descriptive and
  meaningful names (E.g. Timer, Layout, Webcam, ResultsOverlay). For our
  files, we used PascalCase and matched the component name (E.g.
  Timer.tsx, Layout.tsx, Webcam.tsx, ResultsOverlay.tsx). For our state
  variables, we used camelCase and prefixed them with 'is', 'has', or
  'should' to denote boolean values (E.g. isCountingDown,
  isSessionActive) and the corresponding state update functions prefixed
  with 'set' (E.g. setIsCountingDown, setIsSessionActive). For our event
  handlers, we used camelCase and prefixed them with 'handle' (E.g.
  handlePoseDetected, handleSessionStart). For our constants, we used
  uppercase letters with underscores (E.g. VITE_SUPABASE_URL). For our
  utility functions, we used camelCase and chose descriptive names that
  indicate their purpose or functionality (E.g. calculateAngle)

### 7.3 Design Decisions

+----------------+----------------+----------------+-------------------+
| **Decision**   | **Alternatives | **Criteria**   | **Choice &        |
|                | Considered**   |                | Justification**   |
+:==============:+:===============+================+===================+
| Computer       | \- MediaPipe   | Detect body    | We chose          |
| Vision         | Tasks Vision   | pose landmarks | MediaPipe Tasks   |
|                |                | of user        | Vision (Pose      |
|                | \- MediaPipe   | (specifically  | Landmarker) as    |
|                | Holistic       | require        | our web app only  |
|                |                | shoulder, hip, | requires          |
|                |                | knee, wrist    | full-body pose    |
|                |                | and elbow)     | landmarks to      |
|                |                |                | judge users'      |
|                |                |                | exercise form and |
|                |                |                | thus track their  |
|                |                |                | rep count.        |
|                |                |                | MediaPipe         |
|                |                |                | Holistic          |
|                |                |                | additionally      |
|                |                |                | tracks face and   |
|                |                |                | hand landmarks,   |
|                |                |                | which are         |
|                |                |                | unnecessary for   |
|                |                |                | our web app and   |
|                |                |                | would introduce   |
|                |                |                | additional        |
|                |                |                | computational     |
|                |                |                | overhead.         |
|                |                |                | Furthermore, the  |
|                |                |                | MediaPipe Tasks   |
|                |                |                | Vision API        |
|                |                |                | provides a        |
|                |                |                | simpler interface |
|                |                |                | for browser-based |
|                |                |                | applications (as  |
|                |                |                | recommended by    |
|                |                |                | our mentor) and   |
|                |                |                | works well with   |
|                |                |                | our React         |
|                |                |                | frontend. Hence,  |
|                |                |                | we chose          |
|                |                |                | MediaPipe Tasks   |
|                |                |                | Vision over       |
|                |                |                | MediaPipe         |
|                |                |                | Holistic          |
+----------------+----------------+----------------+-------------------+
| Backend server | \- Flask       | Familiarity    | We chose Flask    |
|                |                | with the       | because it is a   |
|                | \- FastAPI     | framework/API, | beginner-friendly |
|                |                | learning       | web framework     |
|                |                | curve,         | that meets the    |
|                |                | suitability    | requirements of   |
|                |                | with our web   | our web app. Our  |
|                |                | app            | backend server    |
|                |                |                | primarily         |
|                |                |                | processes pose    |
|                |                |                | data, performs    |
|                |                |                | rep counting via  |
|                |                |                | validation from   |
|                |                |                | our rep counting  |
|                |                |                | logic, and stores |
|                |                |                | session data,     |
|                |                |                | none of which     |
|                |                |                | really requires   |
|                |                |                | the asynchronous  |
|                |                |                | and faster        |
|                |                |                | performance       |
|                |                |                | offered by        |
|                |                |                | FastAPI.          |
|                |                |                | Additionally, me  |
|                |                |                | and my partner    |
|                |                |                | have learnt Flask |
|                |                |                | in the past via   |
|                |                |                | CS50 and are thus |
|                |                |                | more familiar     |
|                |                |                | with how to       |
|                |                |                | utilise it, which |
|                |                |                | also makes the    |
|                |                |                | learning curve    |
|                |                |                | less steep for    |
|                |                |                | us. Hence, Flask  |
|                |                |                | seemed like the   |
|                |                |                | obvious choice    |
|                |                |                | for us over       |
|                |                |                | FastAPI.          |
+----------------+----------------+----------------+-------------------+
| Database       | \- Supabase    | User           | We chose Supabase |
|                |                | authentication | because it        |
|                | \- Firebase    | services, SQL  | provides both     |
|                |                | database and   | user              |
|                |                | suitability    | authentication    |
|                |                | with our web   | and direct access |
|                |                | app            | to a PostgreSQL   |
|                |                |                | database within a |
|                |                |                | single platform.  |
|                |                |                | Supabase allows   |
|                |                |                | us to interact    |
|                |                |                | with the database |
|                |                |                | using standard    |
|                |                |                | SQL queries and   |
|                |                |                | PostgreSQL        |
|                |                |                | features, making  |
|                |                |                | it easier to      |
|                |                |                | query exercise    |
|                |                |                | session data.     |
|                |                |                | This is essential |
|                |                |                | for future        |
|                |                |                | features such as  |
|                |                |                | workout history,  |
|                |                |                | which require     |
|                |                |                | querying a        |
|                |                |                | user\'s past      |
|                |                |                | exercise session  |
|                |                |                | data.             |
|                |                |                | Additionally,     |
|                |                |                | Supabase\'s       |
|                |                |                | built-in user     |
|                |                |                | authentication    |
|                |                |                | services remove   |
|                |                |                | the need for us   |
|                |                |                | to implement our  |
|                |                |                | own user          |
|                |                |                | authentication    |
|                |                |                | system.           |
|                |                |                | Therefore,        |
|                |                |                | Supabase was      |
|                |                |                | chosen over       |
|                |                |                | Firebase as it    |
|                |                |                | provides direct   |
|                |                |                | control over our  |
|                |                |                | web app's data    |
|                |                |                | management.       |
+----------------+----------------+----------------+-------------------+

## 8. Planning & Version Control

**GitHub Repository:**
[[https://github.com/briancps/GoldGoldGold.git]{.underline}](https://github.com/briancps/GoldGoldGold.git)

### Version Control Practices

**Commit conventions:** We use conventional commits such as feat:, fix:,
refactor:

![](media/image22.png){width="3.2203083989501313in"
height="0.4204560367454068in"}

![](media/image46.png){width="2.5328083989501313in"
height="0.43009951881014874in"}

![](media/image19.png){width="5.397391732283465in"
height="0.5330752405949256in"}

**Branching strategy:**

![-{{git_url\>https://github.com/briancps/GoldGoldGold/blob/main/images/439_Image_8.png}}](media/image39.png){width="5.564076990376203in"
height="0.5987314085739283in"}

![-{{git_url\>https://github.com/briancps/GoldGoldGold/blob/main/images/RJQ_Image_9.png}}](media/image24.png){width="5.538017279090114in"
height="0.5904505686789151in"}

![](media/image41.png){width="5.449475065616798in"
height="0.7108016185476815in"}

Whenever we worked on new features or made any changes, we would first
pull from the remote repository main branch with 'git pull origin main'
to receive the most updated code at that point in time, and create a new
branch with 'git checkout -b *\<branchname\>*' before making the
changes. Once the changes are done locally, they are staged with 'git
add -A' and checked with 'git status'. Then the branch is committed with
'git commit -m "\<*message here\>*"' and pushed back to the remote
repository with 'git push origin *\<branchname\>*', and the relevant
Pull Request is initiated.

**GitHub Issues:**

![](media/image29.png){width="6.267716535433071in"
height="6.208333333333333in"}We made use of GitHub Issues to keep track
of the tasks that we needed to do or rectify any bugs identified,
tagging them with the appropriate labels and assigning them to whoever
is tasked to complete it via assignees. Only when the associated Pull
Request is reviewed and successfully merged by the partner will the
issue be closed.

**Pull Requests:**

![](media/image3.png){width="4.593206474190726in"
height="4.203125546806649in"}

![](media/image13.png){width="5.001558398950131in"
height="0.6928149606299212in"}

Whenever new pieces of code is finalised and pushed from our local
machine to the remote repository, we will initiate a Pull Request
stating the changes made and tagging the associated issue it closes.
Only after the code is reviewed and to our satisfaction, and merge
conflicts (if any) are resolved will the merging proceed and the Pull
Request be closed. The associated branch will also be deleted
thereafter.

##  

## 9. Technical Proof of Concept

**How to access the PoC:**

- Deployed site:
  [[https://goldgoldgold-nq1y.onrender.com]{.underline}](https://goldgoldgold-nq1y.onrender.com)

**What the PoC demonstrates:**

1.  User can sign up, log in, and create a new exercise session
    (push-ups or sit-ups). Sessions are persisted in our PostgreSQL
    database (Supabase).

![](media/image31.png){width="4.183850612423447in"
height="0.4648720472440945in"}

![](media/image44.png){width="6.267716535433071in"
height="0.7361111111111112in"}

2.  Webcam feed, pose detection and rep counting is successfully
    communicated between frontend and backend.

![](media/image4.png){width="2.8838582677165356in"
height="0.46875in"}![](media/image36.png){width="2.9352438757655293in"
height="0.4765715223097113in"}

3.  Results overlay provides a summary of the completed session

![](media/image8.png){width="2.8609372265966755in"
height="2.101913823272091in"}![](media/image5.png){width="2.7607753718285215in"
height="2.091497156605424in"}

**Video Demonstration:**
[[https://drive.google.com/file/d/11-i1bsAervp5Ewfdka0bs_NHBqAKeAdM/view?usp=sharing]{.underline}](https://drive.google.com/file/d/11-i1bsAervp5Ewfdka0bs_NHBqAKeAdM/view?usp=sharing)

##  

## 10. Testing

#### Test Strategy

We adopted a three level testing strategy consisting of unit testing,
integration testing, and system testing. Unit tests are used to verify
the functionality of our individual utility functions and rep-counting
logic, integration tests validate communication between the frontend and
Flask backend server routes. Finally, system testing is performed
through the full end-to-end user workflows, such as logging in, choosing
and performing an exercise session, and saving the exercise session
results.

#### Unit Tests

Link to test files:

[[https://github.com/briancps/GoldGoldGold/tree/88d0df4a8e28bd2c6865be1afe77d1064e3326de/tests]{.underline}](https://github.com/briancps/GoldGoldGold/tree/88d0df4a8e28bd2c6865be1afe77d1064e3326de/tests)

[[https://github.com/briancps/GoldGoldGold/blob/88d0df4a8e28bd2c6865be1afe77d1064e3326de/frontend/src/utils/calculateAngle.test.ts]{.underline}](https://github.com/briancps/GoldGoldGold/blob/88d0df4a8e28bd2c6865be1afe77d1064e3326de/frontend/src/utils/calculateAngle.test.ts)

![](media/image15.png){width="4.354453193350831in"
height="1.3621620734908138in"}

![](media/image26.png){width="6.267716535433071in"
height="0.7361111111111112in"}

![](media/image32.png){width="6.267716535433071in"
height="1.3611111111111112in"}

This ensures that in the event the user performs a partial push-up rep,
whereby they did not go fully down to the proper down position before
going back up to the proper up position, that rep is invalid and thus
the rep count would remain at 0.

**Coverage:**

- All utility functions in src/utils/ are unit tested. Run with npm
  test. (ensure you are in the frontend directory before running the
  command)

- For unit tests under the tests/ directory, ensure you are in the root
  directory and run the command python3 -m pytest

#### Integration Tests

Our integration tests verifies the functionality of our routes by
simulating HTTP requests via a test client and mock object and checking
if the status code returned is as expected.

![](media/image21.png){width="6.267716535433071in" height="4.0in"}

This verifies that our */session/save* route is functional. Whereby in
the event a user's session has ended, the user's exercise data would be
successfully stored in our Supabase database.

#### System Tests

  -----------------------------------------------------------------------------------------
    **S/N**   **Test Case**       **Steps**          **Expected      **Actual    **Pass?**
                                                      Result**       Result**   
  ----------- -------------- ------------------- ------------------ ----------- -----------
       1       Sign up for   Enter an email and  Successful sign up     As           ✓
                new users      password, click    notification is    expected.  
                               Sign Up button    displayed, and the             
                                                 user is redirected             
                                                   to proceed to                
                                                       login.                   

       2        Login with     Enter email and   Redirected to main     As           ✓
                  valid        password, click          page         expected.  
               credentials      Login button                                    

       3        Login with          Enter          Error message        As           ✓
                 invalid      invalid/incorrect   displayed on the   expected.  
               credentials   email and password,    login page.                 
                             click Login button                                 

       4          Route       Enter /pushup at   Redirected to the      As           ✓
                protection   the back of the URL     login page      expected.  
                                to attempt to                                   
                             directly enter the                                 
                             pushup page without                                
                                 logging in                                     

       5         Start a     Select the push-up   10s preparation       As           ✓
                 push-up       option in main     countdown timer    expected.  
                 session     page, allow access  overlay appears on             
                             to webcam and click  live webcam feed              
                                Start button                                    

       6         Push-up      Wait for the 10s    The preparation       As           ✓
               official 60s      preparation      countdown timer    expected.  
                 session     countdown timer to  overlay disappears             
                 duration          finish         and the official              
                                                  60s timer begins              
                                                   the countdown                

       7       Push-up rep     Perform a full       Rep counter         As           ✓
                 counting        push-up rep      increments by 1    expected.  
                             (ensuring full body                                
                             is visible and left                                
                              shoulder, elbow,                                  
                             wrist, hip and knee                                
                               are facing the                                   
                                   webcam)                                      

       8         Push-up      Perform a partial     Rep counter         As           ✓
               partial rep    rep whereby I did  remains unchanged   expected.  
                  count       not go fully down                                 
                               to proper down                                   
                               position before                                  
                              going back up to                                  
                                the proper up                                   
                                  position                                      

       9         Required       Only the left       Rep counter         As           ✓
              landmarks not  shoulder is visible remains unchanged   expected.  
                 in frame       and perform a                                   
                                 push-up rep                                    

      10         Results      Wait for the 60s    Results overlay       As           ✓
                 overlay      timer to run out     appears on the    expected.  
               successfully                      webcam, displayed              
                displayed                        the amount of reps             
                                                  performed in the              
                                                  session and the               
                                                   exercise type                
                                                     completed                  

      11       Session data   Completing a 60s    Record with the       As           ✓
                 saved to          session        relevant session   expected.  
                 Supabase                        data appears as a              
                                                   new row in our               
                                                      Supabase                  
                                                  '*userprofiles*'              
                                                       table                    

      12        Try Again    After completing a   Live rep counter      As           ✓
                  Button       session and the    resets to 0 and    expected.  
                               results overlay        the 10s                   
                              appear, click on      preparation                 
                                the Try Again     countdown timer               
                                   button        overlay appears on             
                                                  the webcam again              

      13          Sit-up      Repeat S/N 5 -12   Same corresponding     As           ✓
                             accordingly but for expected behaviour  expected.  
                                   sit-ups          for sit-ups                 

      14       Exiting the    During a session,  Rep counter should     As           ✓
                 page mid      before the 60s    reset to 0 for the  expected.  
                 session       timer runs out,      new session                 
                               exit the page.    started instead of             
                             Then, return to the starting from the              
                             same exercise page  rep count from the             
                              and start another   session that was              
                                   session       prematurely exited             
  -----------------------------------------------------------------------------------------

##  

## 11. Development Plan

### Planned for Milestone 3 (by 27 July 2026)

- Exercise Form Feedback

<!-- -->

- Create additional posture validation to prompt real-time form feedback
  for push-ups and sit-ups.

  Display feedback messages during exercise sessions.

<!-- -->

- Workout History Dashboard

<!-- -->

- Implement past session data retrieval from Supabase for users

  Develop a "History" tab to display previous workout sessions
  statistics for users.

  Add history page routing.

<!-- -->

- Video Capture and Playback

<!-- -->

- Implement session recording using the webcam stream.

  Store recorded videos to Supabase as video url

  Allow users to replay previous workout recordings via the "History"
  tab by clicking on the video URL

<!-- -->

- Testing

<!-- -->

- Develop pytest test cases for form feedback and past session data
  retrieval functionality.

  Perform integration and system testing of newly added features.

**Risks and mitigations:**

- Neither team member has prior experience in utilising MediaRecorder
  API which is essential for the implementation of our feature of "Video
  Capture". To mitigate this, me and my partner will begin reading
  documentation for it and watching videos on how to use this API.
  Additionally, we can attempt to utilise the API and get familiar with
  it before Milestone #3 begins.
