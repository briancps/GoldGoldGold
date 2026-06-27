import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import Layout from "../components/Layout";
import Webcam from "../components/Webcam";
import { calculateAngle } from "../utils/angleFunction";
import Timer from "../components/Timer";
import ResultsOverlay from "../components/ResultsOverlay";

/*
We wish for the users to have their left shoulder, left elbow and left wrist facing the camera to count their reps.
Thus, the pose landmarks we would be reading would be corresponding to those 3 points.
Left shoulder - 11; Left elbow - 13; Left wrist - 15;
*/

function PushUp() {
  const navigate = useNavigate();

  useEffect(
    () => {
        const checkAuth = async () => { // this function checks if the user is logged in
            const { data: { session } } = await supabase.auth.getSession();
            // the above asks supabase "is there a currently logged in user?", which it returns an object like { data: { session: ... } }
            // we then unpack that object to only extract the session value directly
            if (!session) {   // if there is no session, redirect back to login page
                navigate('/');
            }
        }
        checkAuth() // actually calling the defined function above
    },
    [] // recall that the empty [] here means "only run this once when the page first loads"
  );

  // Track if the user has started a session
  const [isSessionActive, setIsSessionActive] = useState(false);
  // Track when session has ended for the overlay to appear
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  // Track the 10s countdown preparation for user to get into position
  const [isCountingDown, setIsCountingDown] = useState(false);

  // To ensure React has the latest boolean value on whether the session is active or not
  const isSessionActiveRef = useRef(false);
  const isCountingDownRef = useRef(false);

  useEffect(() => {
    isSessionActiveRef.current = isSessionActive;
  }, [isSessionActive]);

  useEffect(() => {
    isCountingDownRef.current = isCountingDown;
  }, [isCountingDown]);

  // Needed to re-render React to display the live rep counter
  const [repCount, setRepCount] = useState(0);
  // Since state updates are asynchronous, reading repCount immediately may result in inaccuracy (wrong/old value). Thus, we need
  // this ref to always hold the most updated rep count value, this is to ensure the correct final rep count is saved at end of session
  const repCountRef = useRef(0)

  // This means every time React re-renders due to changes in repCount, update current value of repCountRef to updated value of repCount
  useEffect(() => {
    repCountRef.current = repCount
  }, [repCount])

  // To send the user email to the backend to store in Supabase.
  // <string | null> is for TypeScript to recognise that it can be either of type string or null since the intial value would be null.
  const userEmailRef = useRef<string | null>(null);

  // We use useEffect so as to fetch the user's email after the component renders and NOT during rendering.
  useEffect(() => {
    const getUserEmail = async () => {
      // We are destructuring here to get the session directly from response.data
      const {data : {session}} = await supabase.auth.getSession();
      // Store the current user's email into our variable
      // ?? operator is used to ensure that if session?.user.email were to be null or undefined, we would assign the variable to null instead
      userEmailRef.current = session?.user.email ?? null;
    };

    // Since useEffect cannot be async, we have to define an async function within useEffect and call it after defining this async function
    getUserEmail();
  }, []) // recall that the empty [] here means "only run this once when the component first renders"


  // To prevent sending requests to Flask backend server excessively (every frame), we have to set up a throttle.
  // Set initial timestamp of last sent data to Flask to be 0.
  const lastSentRef = useRef(0);


  const handlePoseDetected = async (poseLandmarks : any) => {
    // If session has yet to be started, we don't send any data yet
    if (!isSessionActiveRef.current || isCountingDownRef.current) {
      return;
    }

    const currTime = Date.now();
    // If the last time data was sent to flask was < 100ms, don't send another request yet and just return.
    if (currTime - lastSentRef.current < 100) {
      return;
    }
    lastSentRef.current = currTime;

    const leftShoulder = poseLandmarks[11];
    const leftElbow = poseLandmarks[13];
    const leftWrist = poseLandmarks[15];
    const leftHip = poseLandmarks[23];
    const leftKnee = poseLandmarks[25];

    const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    // To ensure user's back is straight for a proper push-up form
    const hipAngle = calculateAngle(leftShoulder, leftHip,leftKnee);

    try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/pose`, {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({
      user_email : userEmailRef.current,
      exercise_type : 'push-up',
      elbow_angle : elbowAngle,
      hip_angle : hipAngle,
      // We have to ensure all landmarks are visible to count as a valid rep
      shoulder_visibility: leftShoulder.visibility,
      elbow_visibility: leftElbow.visibility,
      wrist_visibility: leftWrist.visibility,
      hip_visibility: leftHip.visibility,
      knee_visibility: leftKnee.visibility
      })
    });

    const data = await response.json();
    // If data.count is null/undefined, we return a default value of 0
    setRepCount(data['Valid Count'] ?? 0);
    } catch (err) {
      console.error("Data failed to send: ", err);
    }
  }

  const handleHomeButton = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/session/reset`, {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({})
    })
    setRepCount(0);
    repCountRef.current = 0;
    lastSentRef.current = 0;
    setIsSessionEnded(false);
    setIsSessionActive(false);
    setIsCountingDown(false);
    isSessionActiveRef.current = false;
    isCountingDownRef.current = false;
    navigate('/main')
  }

  // This is to reset when user clicks "Start" or "Try Again". This ensures the new session starts afresh for the current user
  const handleSessionStart = async () => {
    setRepCount(0);
    repCountRef.current = 0;
    lastSentRef.current = 0;
    setIsSessionEnded(false);
    setIsSessionActive(true);
    setIsCountingDown(true);
    isSessionActiveRef.current = true;
    isCountingDownRef.current = true;
  }

  // This is to handle when the 10s countdown preparation is up
  const handleCountdownEnd = () => {
    setIsCountingDown(false);
    isCountingDownRef.current = false;
  }

  const handleSessionEnded = async () => {
    setIsSessionEnded(true);
    setIsSessionActive(false);
    isSessionActiveRef.current = false;

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/session/save`, {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({
      user_email : userEmailRef.current,
      exercise_type : 'push-up',
      rep_count : repCountRef.current
      })
    })
  }
  return (
    <Layout onHomeButton={handleHomeButton}>
      <div style = {{
        display : 'flex',
        flexDirection : 'column',
        alignItems : 'center',
        justifyContent : 'center',
        gap : '16px',
        padding : '24px 20px',
        marginLeft : '6px'
      }}>
        <h1 style = {{
          fontSize : '40px',
          fontWeight : '700',
          fontFamily : 'Bebas Neue',
          color: "rgb(206, 169, 36)",
          margin : 0,
          alignSelf : 'flex-start',
          marginBottom : '-60px',
          border : '1px solid rgb(206, 169, 36)',
          padding: '8px 12px',
          borderRadius : '12px'
        }}>
          Push-Up
        </h1>

        <div style = {{
          position : 'relative',
          display : 'flex',
          flexDirection : 'column',
          alignItems : 'center',
          gap : '8px'}}>

          <div style = {{
          display : 'flex',
          gap : '32px',
          alignItems : 'center',
          marginRight : '27px'
          }}>
            <Timer isActive = {isSessionActive} onTimeUp = {handleSessionEnded} onCountdownEnd = {handleCountdownEnd}></Timer>

            <span style = {{
            fontSize : '40px',
            color: "white",
            fontFamily : 'Bebas Neue',
            }}>
              Reps: {repCount}
            </span>
          </div>


          {(!isSessionActive && !isSessionEnded) ?
          <button
            onClick={handleSessionStart}
            style = {{
            padding : '12px 32px',
            fontSize : '24px',
            fontWeight : '700',
            fontFamily : 'Bebas Neue',
            background : 'rgb(206, 169, 36)',
            border : 'none',
            borderRadius : '8px',
            color : 'black',
            cursor : 'pointer',
            marginRight : '27px'
            }}>
              Start
            </button> : null}

          <Webcam poseDetected={handlePoseDetected} exerciseType="push-up"></Webcam>
          
          {isSessionEnded ? <ResultsOverlay exerciseType="Push-Up" repCount={repCount} onTryAgain={handleSessionStart}></ResultsOverlay> : null}
        </div>
      </div>
    </Layout>
  )
}

export default PushUp;