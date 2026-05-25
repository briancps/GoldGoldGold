import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import toast, { Toaster } from 'react-hot-toast'

function LoginPage() {
    /*
    useState allows us to add a state variable to our component

    const [state, setState] = useState(initialState)

    In this case, we only use it for text and boolean, and thus we set the intial state to be an empty string and boolean false respectively
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
        // Indicates that an user authentication request is underway
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
                toast.success('Verify your email to complete sign up!') // Notification in the browser to alert user to verify their email
            } else {
                const {error} = await supabase.auth.signInWithPassword({email, password});
                if (error) {
                    throw error;
                }
                navigate('/main'); // Upon successful sign in, bring user to the Main page.
            }
        } catch (error) {
            setError(error.message);
        } finally { // this block would always run regardless if an error is thrown or not
            setLoading(false);
        }
    };

    // If user were to hit the 'Enter' key, it would also submit the form
    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };
    return (
        <div>Login Page</div>
    );
}
export default LoginPage; // this line means we are making the LoginPage function available for other files to import and use.