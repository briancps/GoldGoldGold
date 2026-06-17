import { useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import Layout from "../components/Layout";
import Webcam from "../components/Webcam";
import { calculateAngle } from "../utils/angleFunction";

/*
We wish for the users to have their left shoulder, left hip and left knee facing the camera to count their reps.
Thus, the pose landmarks we would be reading would be corresponding to those 3 points.

Left shoulder - 11; Left hip - 23; Left knee - 25;
*/

function SitUp() {
  // To send the user email to the backend to store in Supabase.
  // <string | null> is for TypeScript to recognise that it can be either of type string or null since the intial value would be null.
  const userEmailRef = useRef<string | null>(null);

  // We use useEffect so as to fetch the user's email after the component renders and NOT during rendering.
  useEffect(() => {
    const getUserEmail = async () => {
      // We are destructuring here to get the session directly from response.data
      const {data: {session}} = await supabase.auth.getSession();
      // Store the current user's email into our variable
      userEmailRef.current = session?.user.email ?? null;
      // the ?? operator above is 'nullish coalescing'. It returns its RHS operand when its LHS operand is null or undefined. Otherwise, it returns the LHS operand.
      // it means: "use session?.user.email if it is not null and not undefined. Otherwise use null"
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

    const sitUpAngle = calculateAngle(poseLandmarks[11], poseLandmarks[23], poseLandmarks[25]);
    // recall landmarks are Left shoulder - 11; Left hip - 23; Left knee - 25;

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/pose`, {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({
          user_email : userEmailRef.current,
          exercise_type : 'sit-up',
          angle : sitUpAngle
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
          Sit-Up
        </h1>

        <Webcam poseDetected={handlePoseDetected}></Webcam>
      </div>
    </Layout>
  )
}

export default SitUp;