import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Layout from '../components/Layout';
import replay from '../assets/replay_button.png';

// Create type here to rep the data to be displayed in the History page.
// This is required to create an array of objects for all the sessions that the user completes to display all the relevant data on the History page
type Session = {
    exercise_type : string;
    rep_count : number;
    created_at : string;
    video_url : string | null; // Allow null for now since video_url has yet to be implemented.
}

function History() {
    const navigate = useNavigate();
    // Ensures TypeScript knows that the data that this state will store is an array of Session objects to rep past session data of users
    const [session, setSession] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectVideo, setSelectVideo] = useState<string | null>(null);


    const fetchSessionHistory = async(userEmail : string) => {
        try {
            // Sends the user email to the backend 
            // encodeURIComponent is used to ensure the special characters in the user emails would not cause errors to arise when data is being sent to the backend
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/session/history?user_email=${encodeURIComponent(userEmail)}`);
            const data = await response.json();
            setSession(data.Sessions ?? []);
        } catch(err) {
            setError("Failed to fetch session history");
        } finally {
            setIsLoading(false);
        }
    }

    // Since created_at would return an ISO date format, for better readability, we convert it to the conventional form
    const formatDate = (isoString : string) => {
        return new Date(isoString).toLocaleDateString('en-SG', {
            year : 'numeric',
            month : 'long',
            day : 'numeric',
            hour : '2-digit',
            minute : '2-digit',
            hour12 : true
        })
    }

    // this protects the /history route from being accessed without logging in first:
    useEffect(
        () => {
            const checkAuth = async () => { // this function checks if the user is logged in
                const { data: { session } } = await supabase.auth.getSession();
                // the above asks supabase "is there a currently logged in user?", which it returns an object like { data: { session: ... } }
                // we then unpack that object to only extract the session value directly
                if (!session) {   // if there is no session, redirect back to login page
                    navigate('/');
                    return;
                }
                // The ! is to guarantee that it would be a string and non-null
                fetchSessionHistory(session.user.email!)
            }
            checkAuth() // actually calling the defined function above
        },
        [] // recall that the empty [] here means "only run this once when the page first loads"
    );

    const handleHomeButton = async () => {
        navigate('/main');
    }

    return (
        <Layout onHomeButton={handleHomeButton}>
            <div style = {{
                display : 'flex',
                flexDirection : 'column',
                alignItems : 'center',
                gap : '24px',
                padding : '32px 20px',
                width : '100%'
            }}>
                <h1 style = {{
                    fontSize : '40px',
                    fontWeight : '700',
                    fontFamily : 'Bebas Neue',
                    color : 'rgb(206, 169, 36)',
                    margin : '0',
                    marginTop : '-9px'
                }}>
                    Workout History
                </h1>

                {isLoading ? <p style = {{color : 'white', fontFamily : 'Bebas Neue', fontSize : '20px', fontWeight : '700'}}>Loading Sessions...</p> : null}
                {error ? <p style = {{color : 'red', fontFamily : 'Bebas Neue', fontSize : '20px', fontWeight : '700'}}>{error}</p> : null}
                {/* In the event that the user has yet to complete any sessions */}
                {(!isLoading && !error && session.length == 0) ? <p style = {{color : 'white', fontFamily : 'Bebas Neue', fontSize : '20px', fontWeight : '700'}}>No Sessions Completed Yet!</p> : null}

                {(!isLoading && session.length > 0) ? 
                    <table style={{
                        width : '100%',
                        borderCollapse : 'collapse',
                        fontFamily : 'Bebas Neue',
                        fontWeight : '700',
                    }}>
                        <thead>
                            <tr style = {{borderBottom : '2px solid rgb(206, 169, 36)'}}>
                                <th style = {thStyle}>Date</th>
                                <th style = {thStyle}>Exercise</th>
                                <th style = {thStyle}>Reps</th>
                                <th style = {{...thStyle, borderRight : 'none'}}>Video Playback</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* session is the current Session object in the array, and index is the position of the object in the array */}
                            {session.map((session, index) => (
                                <tr key = {index} style = {{borderBottom : '1px solid rgba(255, 255, 255, 0.1)', backgroundColor : index % 2 == 0 ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}}>
                                    <td style = {tdStyle}>{formatDate(session.created_at)}</td>
                                    <td style = {tdStyle}>{session.exercise_type}</td>
                                    <td style = {tdStyle}>{session.rep_count}</td>
                                    <td style = {{...tdStyle, borderRight : 'none'}}>
                                        {session.video_url ? 
                                            <button 
                                                onClick = {() => setSelectVideo(session.video_url)}
                                                style = {{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5px',
                                                    padding: '6px 16px',
                                                    fontSize: '16px',
                                                    fontFamily: 'Bebas Neue',
                                                    background: 'rgb(206, 169, 36)',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    color: 'black',
                                                    cursor: 'pointer'
                                                }}> Watch <img src ={replay} style = {{width: '16px', height: '16px', transform: 'translateY(-1.4px)'}}></img>
                                            </button> : <span style = {{fontSize : '16px'}}>No Recording</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table> : null}

                    {selectVideo ? 
                        <div 
                            onClick={() => setSelectVideo(null)}
                            style = {{
                                position : 'fixed',
                                inset : 0, // To ensure the overlay covers the screen
                                background : 'rgba(0, 0, 0, 0.9)',
                                display : 'flex',
                                flexDirection : 'column',
                                alignItems : 'center',
                                justifyContent : 'center',
                                gap : '16px',
                                zIndex : 100 // Ensures the video overlay would appear above the table
                            }}>
                                <p style = {{color : 'white', fontFamily : 'Bebas Neue', fontSize :'16px'}}>
                                    Click anywhere to close
                                </p>

                                {/* require stopPropagation to allow users to click on the video control buttons without exiting the video */}
                                <video 
                                    src = {selectVideo}
                                    controls
                                    autoPlay
                                    onClick={event => event.stopPropagation()} 
                                    style = {{
                                        maxHeight : '80vh',
                                        maxWidth : '90vw',
                                        borderRadius : '12px',
                                        border : '1px solid rgb(206, 169, 36)'
                                    }}></video>
                        </div> : null}
            </div>
        </Layout>
    )
}

const thStyle : React.CSSProperties = {
    padding : '12px 16px',
    textAlign : 'center',
    fontSize : '18px',
    color : 'white',
    fontWeight : '700',
    borderRight : '1px solid rgba(206, 169, 36, 0.3)',
}

const tdStyle : React.CSSProperties = {
    padding: '12px 16px',
    textAlign : 'center',
    fontSize: '18px',
    color: 'white',
    fontWeight : '700',
    borderRight : '1px solid rgba(206, 169, 36, 0.3)'
}

export default History;