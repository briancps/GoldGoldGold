import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function History() {
    const navigate = useNavigate();

    // this protects the /history route from being accessed without logging in first:
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

    return <div>History Page</div>; // placeholder first, to be changed
}

export default History;