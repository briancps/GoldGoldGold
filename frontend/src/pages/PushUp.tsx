import { useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import Layout from "../components/Layout";
import Webcam from "../components/Webcam";
import {calculateAngle} from "../utils/angleFunction"

/*
We wish for the users to have their left shoulder, left elbow and left wrist facing the camera to count their reps.
Thus, the pose landmarks we would be reading would be corresponding to those 3 points.

Left shoulder - 11; Left elbow - 13; Left wrist - 15;
*/

function PushUp() {
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
    const currTime = Date.now();
    // If the last time data was sent to flask was < 100ms, don't send another request yet and just return.
    if (currTime - lastSentRef.current < 100) {
      return;
    }
    lastSentRef.current = currTime;

    const pushUpAngle = calculateAngle(poseLandmarks[11], poseLandmarks[13], poseLandmarks[15]);

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/pose`, {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({
          user_email : userEmailRef.current,
          exercise_type : 'push-up',
          angle : pushUpAngle
        })
      });
    } catch (err) {
      console.error("Data failed to send: ", err);
    }
  }
  return (
    <Layout>
      <div style = {{
        display : 'flex',
        flexDirection : 'column',
        alignItems : 'center',
        justifyContent : 'center'
      }}>
        <h1 style = {{
          fontSize : '40px',
          fontWeight : '700',
          fontFamily : 'Bebas Neue',
          color: "rgb(206, 169, 36)",
          marginTop : '60px',
          marginBottom : '-50px'
        }}>
          Push-Up
        </h1>

        <Webcam poseDetected={handlePoseDetected}></Webcam>
      </div>
    </Layout>
  )
}

export default PushUp