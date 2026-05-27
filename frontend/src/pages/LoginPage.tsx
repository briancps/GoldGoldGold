import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import logo from '../assets/logo.png';
import ippt from '../assets/ippt_gold.webp';
import "@fontsource/bebas-neue";

function LoginPage() {
    /*
    useState allows us to add a state variable to our component

    const [state, setState] = useState(initialState)

    In this case, we only use it for text and boolean, and thus we set the initial state to be an empty string and boolean false respectively
    */
    const [email, setEmail] = useState(''); // Store user's email input
    const [password, setPassword] = useState(''); // Store user's password input
    const [isSignUp, setIsSignUp] = useState(false); // Determines whether the user is signing up or logging in
    const [loading, setLoading] = useState(false); // Tracks whether a login / sign up process is underway
    const [error, setError] = useState(''); // Tracks if any error is thrown during user authentication
    const navigate = useNavigate(); // To allow navigation to other routes

    const handleSubmit = async() => {
        // Reset any previous error
        setError('');
        // Indicates that a user authentication request is underway
        setLoading(true);

        try {
            /*
            According to documentation, it is usually 
            const {data, error} = await supabase.auth.signUp({email, password}).

            However, since we won't be using data here, we can exclude it and only focus on error
            */
            if (isSignUp) {
                const {error} = await supabase.auth.signUp({email, password});
                if (error) {
                    throw error;
                }
                toast.success('Sign up successful! Proceed to Login'); // Notification in the browser to alert user to verify their email
                setIsSignUp(false);
            } else {
                const {error} = await supabase.auth.signInWithPassword({email, password});
                if (error) {
                    throw error;
                }
                navigate('/main'); // Upon successful sign in, bring user to the Main page.
            }
        } catch (error : any) {
            setError(error.message);
        } finally { // this block would always run regardless if an error is thrown or not
            setLoading(false);
        }
    };

    // If user were to hit the 'Enter' key, it would also submit the form
    /*
    React.KeyboardEvent tells TypeScript that this event comes from a keyboard interaction in React
    <HTMLInputElement> provides further information that this event is coming from an <input> field
    */
    const handleEnterKey = (event : React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };
    return (
        <>
            <Toaster 
                position = 'top-center'
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'black',
                        color: "rgb(206, 169, 36)",
                        border: "1px solid rgba(255,200,0,0.4)",
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'Bebas Neue'
                    }
                }}></Toaster>
                {/* Design the notification to be shown when a user signs up and has to verify their email before logging in */}

            <div style = {{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'black',
            }}> {/* This is for the outer container */}
                <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                    {/* This is to contain all the elements in the center of the webapp */}
                    <div style = {{textAlign: 'center'}}>
                        {/* This is to contain the logo, title and tagline */}
                        <img src = {logo} alt = 'GoldGoldGold' style = {{width: '275px', marginBottom: '-52px'}}></img>
                        <h1 style = {{
                            fontSize: '32px',
                            fontWeight: '700',
                            fontFamily: 'Bebas Neue',
                            color: 'rgb(206, 169, 36)',
                            letterSpacing: '0.5px',
                            marginBottom: '12px'
                        }}>
                            Your Personal IPPT Trainer
                        </h1>

                        <div style = {{display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-10px'}}>
                            {/* This is to make the ippt golden badge appear beside our tagline */}
                            <p style = {{fontSize: '22px', fontFamily: 'Bebas Neue', color: 'white', marginLeft: '13.2px'}}> One Step Closer to GOLD </p>
                            <img src = {ippt} style = {{width: '60px', height: '40px'}}></img>
                        </div>
                    </div>

                    <div style = {{
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        background: 'black', 
                        border: '1px solid grey', 
                        borderRadius: '16px',
                        padding: '32px',
                        paddingRight: '58px',
                        width: '300px'}}>
                    {/* This is to contain elements to allow users to sign in, sign up or login */}
                        <h2 style = {{
                            fontSize: '22px',
                            fontFamily: 'Bebas Neue',
                            fontWeight: '700',
                            color: 'white',
                            marginTop: '-10px',
                            marginLeft: '24.88px'
                        }}>
                            {/* Uses Javascript to access the variable isSignUp, to check if the user is signing up for an account or signing in to an existing one */}
                            {isSignUp ? 'Create an account' : 'Login to start training 💪'}
                        </h2>

                        <div style = {{marginTop: '-10px', marginBottom: '15px'}}>
                            {/* Text caption for our input fields (email and password accordingly) */}
                            <label style = {{
                                display: 'block',
                                fontSize: '13px',
                                fontFamily: 'Bebas Neue',
                                color: 'white',
                                marginLeft: '25px'
                            }}>
                                Email
                            </label>

                            <input 
                                type = 'email' 
                                value = {email} 
                                onChange = {event => setEmail(event.target.value)}
                                onKeyDown = {handleEnterKey}
                                style = {{
                                    boxSizing: 'border-box',
                                    width: '300px',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    padding: '10px 14px',
                                    fontSize: '14px',
                                    marginLeft: '25px'
                                }}>
                            </input>
                            {/* Updates the corresponding state variable whenever the user types (email in this case) */}
                            {/* When user hits the 'Enter' key, submit whatever was written in the respective input fields accordingly */}
                        </div>

                        <div style = {{marginBottom: '15px'}}>
                            <label style = {{
                                display: 'block',
                                fontSize: '13px',
                                fontFamily: 'Bebas Neue',
                                color: 'white',
                                marginLeft: '25px'
                            }}>
                                Password
                            </label>

                            <input 
                                type = 'password' 
                                value = {password} 
                                onChange = {event => setPassword(event.target.value)}
                                onKeyDown = {handleEnterKey}
                                style = {{
                                    boxSizing: 'border-box',
                                    width: '300px',
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    padding: '10px 14px',
                                    fontSize: '14px',
                                    marginLeft: '25px'
                                }}>
                            </input>
                        </div>

                        <button
                            onClick = {handleSubmit}
                            disabled = {loading}
                            style = {{
                                width: '100%',
                                fontSize: '15px',
                                fontWeight: '700',
                                fontFamily: 'Bebas Neue',
                                background: loading ? 'rgba(255,200,0,0.4)' : 'rgb(206, 169, 36)',
                                border: 'none',
                                transition: 'background 0.2s',
                                padding: '12px',
                                paddingRight: '32px',
                                borderRadius: '8px',
                                marginLeft: '25.8px',
                                marginTop: '12px',
                            }}>
                                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
                        </button>
                        {/* Upon the button being manually clicked, submit whatever was written in the respective input fields accordingly */}
                        {/* When a user authentication is underway, that is when the variable loading is true, we disable the button so that the user can't access/use it.
                            This prevents multiple authentication requests while the page is processing the current user authentication request */}

                        <p style = {{color: 'white', fontSize: '13px', fontFamily: 'Bebas Neue', marginLeft: '14.5px', marginTop: '30px'}}>
                            {isSignUp ? 'Already have an existing account? ' : "Don't have an account yet? "}

                            {/* Since I only wish to edit the style of this specific text, create a span to do so */}
                            <span 
                                onClick = { () => setIsSignUp(!isSignUp)}
                                style = {{
                                    color : 'rgb(206, 169, 36)',
                                    cursor: 'pointer',
                                    fontFamily: 'Bebas Neue'
                                }}>
                                    {isSignUp ? ' Login' : ' Sign up'}
                            </span>
                            {/* When user clicks on the Login/Sign Up text in this case, it would set the variable isSignUp to the opposite of its initial boolean value. 
                                This is to allow toggling between signing up and logging in for users */}
                        </p>
                        
                        {/* We check if any error is encountered. If so, we would display the error message to the user. Else, we do nothing */}
                        {error ? <div style = {{fontSize: '15px', fontFamily: 'Bebas Neue', color: 'red', marginLeft: '20px', marginTop: '8px'}}> {'Error: ' + error} </div> : null}
                    </div>
                </div>
            </div>
        </>
    );
}
export default LoginPage; // this line means we are making the LoginPage function available for other files to import and use.