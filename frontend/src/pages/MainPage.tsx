import { useEffect, useRef, useState } from 'react';
// useEffect: runs code after the component loads (or when something changes)
    /* 
        useEffect(
            () => { ... },  // 1st input: a function containing the code to run
            []              // 2nd input: a dependency array - controls when it runs. empty [] means run once only when page first loads. [someValue] means re-run everytime someValue changes
        )
    */
// useRef: takes in the initial value of the ref; gives you direct access to an HTML element without causing a re-render
// useState: takes in the initial value as input; stores a value that can change over time, and re-renders the UI when it changes
import { PoseLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function MainPage() {
    const videoRef = useRef<HTMLVideoElement>(null); // null is the initial value of the ref. So before the page loads, videoRef.current = null (nothing there yet)
    // then after the page loads, videoRef.current = the actual video element
    const canvasRef = useRef<HTMLCanvasElement>(null); // canvas is like a whiteboard placed in front of the projector - it shows the video image + draws the skeleton on top
    const [isLoading, setIsLoading] = useState(true);
    // useState returns 2 things (the value and the setter function). So we use [] to unpack both into separate named variables in one line
    // this is known as array destructuring
    const [loadingMessage, setLoadingMessage] = useState('Loading MediaPipe');
    const navigate = useNavigate();

    // for logging out:
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = async () => {
        setIsLoggingOut(true)
        await supabase.auth.signOut();  // calls supabase's built-in signOut() function
        navigate('/');  // redirect user back to login page
    };
    /*
    async and await is used for operations that take time (like fetching data / accessing webcam / loading models)
    it waits for slow operations to finish before continuing
    without async/await your code will move on before the operation finishes
    async is just the label you put on a function to tell JavaScript "this function contains await inside it"
    */

    // this protects the /main route from being accessed without logging in first:
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

    useEffect(
        () => {
            let poseLandmarker: PoseLandmarker;  // will hold the MediaPipe model once loaded
            let animationId: number;  // will hold the id of the animation loop (needed to cancel it later)

            const setup = async () => {
                try {
                    setLoadingMessage('Loading MediaPipe...');
                    const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
                    setLoadingMessage('Loading pose model...');
                    poseLandmarker = await PoseLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task'
                            }, // ^ where to download the model from
                            runningMode: 'VIDEO', // default would have been single images
                            numPoses: 1. // to detect only one person
                        }
                    );
                    // above 12 lines is referenced from the documentation and guide

                    setLoadingMessage('Starting webcam...');
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    videoRef.current!.srcObject = stream; // the ! after .current tells TypeScript "I know this is not null anymore at this point, trust me"
                    videoRef.current!.play()
                    // above 4 lines essentially updates loading message, requests webcam access from the browser, then feeds the webcam stream into the <video> element and starts playing it

                    videoRef.current!.onloadeddata = () => {
                        setIsLoading(false);
                        detect(); // declared later
                    }
                    // above 4 lines waits until the webcam video has actually loaded data before setting isLoading to false (hides loading screen) and starting the detect() loop

                } catch (err: any) {
                    setLoadingMessage('Error: ' + err.message);
                }
            }

            const detect = () => {
                const canvas = canvasRef.current;
                const video = videoRef.current;
                if (!canvas || !video) {  // if either is missing, stop immediately
                    return;
                }
                const context = canvas.getContext('2d'); // gets the 2D drawing context from the canvas
                if (!context) {
                    return;
                }
                const drawingUtils = new DrawingUtils(context);  // DrawingUtils is MediaPipe's helper for drawing landmarks and connectors

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                // above 2 lines makes the canvas exactly same size as video so the skeleton aligns perfectly

                context.drawImage(video, 0 , 0); 
                // syntax: drawImage(img, x, y), where img is the image/video element to use, x and y are the x- and y-coordinates for where to place the image on canvas
                // draws the current webcam frame onto the canvas - this is what makes you visible on screen

                const results = poseLandmarker.detectForVideo(video, performance.now());
                // above runs pose detection on the current video frame. performance.now() gives the current timestamp
                // in milliseconds, which MediaPipe needs to track movement across frames
                /* returns the following:
                {
                landmarks: [...],  // we will need this landmarks later
                worldLandmarks: [...],
                segmentationMasks: [...]
                }
                */
               // Note: results.landmarks is an array of ALL detected poses, where each pose is itself an array of body landmark objects
               // Eg. results.landmarks[0] returns the array of all landmarks for the first detected person
               // Eg. results.landmarks[0][2] returns the third landmark object of the first detected person
                if (results.landmarks) { // first check whether the pose detector found any body landmarks
                    for (const poseLandmarks of results.landmarks) { // for...of syntax to iterate over each item (called landmarks) in results.landmarks one at a time
                        // draws the dots
                        drawingUtils.drawLandmarks(poseLandmarks, {
                            color: '#ffc800',  // outline colour of the dots
                            fillColor: '#ffc800', // colour to fill the dots with
                            radius: 4 // dot size in pixels
                        })
                        // draws the lines in white to join related dots, creating the skeletal overlay
                        drawingUtils.drawConnectors(poseLandmarks, PoseLandmarker.POSE_CONNECTIONS, {
                            color: '#ffffff',
                            lineWidth: 2 // thickness of connector lines
                        })
                    }
                    sendPoseData(results.landmarks[0]); // declared later, sends the landmarks to Flask
                    // indexing [0] for the first detected person
               }
               animationId = requestAnimationFrame(detect);
            }
            setup(); // kicks everything off when the page loads
            return () => cancelAnimationFrame(animationId); 
            // line above is a cleanup function that runs when the user navigates away, by cancelling the animation loop so it doesn't keep running in the background
        },
        [] // recall that the empty [] here means "only run this once when the page first loads"
    );

    const sendPoseData = async (poseLandmarks: any) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await fetch('http://localhost:5000/pose', {  // fetch is the browser's built-in function for making HTTP requests
                method: 'POST', // sending data, not retrieving
                headers: { 'Content-Type': 'application/json' }, // tells Flask the data is in JSON format
                body: JSON.stringify({ 
                    pose_landmarks: poseLandmarks,
                    user_id: session?.user.id // the ? after session means if session is null, it will safely return undefined instead of crashing (if we did not put ?)
                }) // converts the poselandmarks object and user id to a JSON string to send
            })
        } catch (err) { // if Flask isn't running or the request fails, log the error without crashing the app
            console.error('Failed to send pose data:', err);
        }
    }

    return (
        <div style = {{
            minHeight: '100vh',
            background: 'black',
            display: 'flex',
            flexDirection: 'column'
        }}>
        {/* This is to stack the navigation bar and webcam feed in the web app vertically */}
            <div style = {{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 32px',
                borderBottom: '1px solid grey'
            }}>
            {/* This is for the navigation bar. justify-content: 'space-between' is to ensure the logo and logout button are on opposite ends of the navigation bar */}
                <div style = {{display: 'flex', alignItems: 'center'}}>
                {/* This is for the logo and our product's name */}
                    <img src = {logo} alt = 'GoldGoldGold' style = {{width: '90px', height: '90px'}}></img>

                    <span style = {{
                        fontSize: '20px',
                        fontWeight: '700',
                        fontFamily: 'Bebas Neue',
                        color: 'rgb(206, 169, 36)'
                    }}>
                        GoldGoldGold
                    </span>
                </div>

                <button
                    onClick = {handleLogout}
                    style = {{
                        height: '50px',
                        width: isLoggingOut ? '150px' : '100px',
                        padding: '8px 16px',
                        fontSize: '15px',
                        fontWeight: '700',
                        fontFamily: 'Bebase Neue',
                        background: 'rgb(206, 169, 36)',
                        border: '1px solid grey',
                        borderRadius: '8px',
                        color: 'black'
                    }}>
                {/* This is for the logout button */}
                    {isLoggingOut ? 'Logging Out...' : 'Logout'}
                </button>
            </div>
            
            {/* This is to contain and display the webcam feed */}
            <div style = {{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
                marginTop: '65px'
            }}>
                {/* This is to display the loading message as the webcam feed is being set up to be displayed */}
                {isLoading ? 
                    <div>
                        <div style = {{
                            fontSize: '18px',
                            color: 'rgb(206, 169, 36)',
                            marginRight: '30px',
                            marginBottom: '20px'
                        }}>
                            {loadingMessage}
                        </div>
                    </div> : null}
                
                {/* This is to contain the webcam feed */}
                <div style = {{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgb(206, 169, 36)',
                    width: '640px',
                    height: '480px'
                }}>
                    {/* To hide the raw webcam feed we set display to none */}
                    <video ref = {videoRef} style={{display: 'none'}}></video>

                    {/* Allows skeletal overlay to be drawn */}
                    <canvas ref = {canvasRef} style={{width: '640px', height: '480px', transform: 'scaleX(-1)'}}></canvas>
                </div>

                {/* When webcam feed is finished setting up and is displayed for user to see */}
                {!isLoading ? 
                    <p style = {{
                        fontSize: '18px',
                        fontWeight: '700',
                        fontFamily: 'Bebas Neue',
                        color: 'white',
                        marginRight: '30px',
                        marginTop: '20px'
                    }}>
                        Move back for more accurate detection!
                    </p> : null}
            </div>
        </div>
    )    
}
export default MainPage; // this line means we are making the MainPage function available for other files to import and use.