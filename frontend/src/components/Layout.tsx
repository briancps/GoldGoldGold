// Since ReactNode is a TypeScript type and verbatimModuleSyntax requires type only imports to be explicitly marked, we have to include the type keyword to signal to the compiler to erase it after compilation.
import { useState, type ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

// Defines what props the Layout component expects to receive
interface LayoutProps {
    // children prop refers to anything within <Layout></Layout>
    // ReactNode here allows the content within <Layout></Layout> to be any valid React renderable content
    children : ReactNode;
}

// The parameter here is the props object as defined above.

/*
    We destructure this via {children} to allow children to be used directly instead of props.children

    We then have to include the type annotation to tell TypeScript that this component expect props that match
    the LayoutProps type as defined above
*/
function Layout({children} : LayoutProps) {
    const navigate = useNavigate();

    // for logging out:
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = async () => {
        setIsLoggingOut(true)
        setTimeout(() => {navigate('/')}, 500);  // redirect user back to login page
        await supabase.auth.signOut();  // calls supabase's built-in signOut() function
    };

    //for home button
    const handleHomeButton = () => {
        navigate('/main');
    };

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
                
                <div style = {{
                    display : 'flex',
                    gap : '12px'
                }}>
                    <button
                        onClick = {handleHomeButton}
                        style = {{
                            height: '50px',
                            width: isLoggingOut ? '150px' : '100px',
                            padding: '8px 16px',
                            fontSize: '15px',
                            fontWeight: '700',
                            fontFamily: 'Bebas Neue',
                            background: 'rgb(206, 169, 36)',
                            border: '1px solid grey',
                            borderRadius: '8px',
                            color: 'black'
                        }}>
                            𖠿 Home
                    </button>

                    <button
                        onClick = {handleLogout}
                        style = {{
                            height: '50px',
                            width: isLoggingOut ? '150px' : '100px',
                            padding: '8px 16px',
                            fontSize: '15px',
                            fontWeight: '700',
                            fontFamily: 'Bebas Neue',
                            background: 'rgb(206, 169, 36)',
                            border: '1px solid grey',
                            borderRadius: '8px',
                            color: 'black'
                        }}>
                    {/* This is for the logout button */}
                        {isLoggingOut ? 'Logging Out...' : '⏻ Logout'}
                    </button>
                </div>
                
            </div>
            
            {/* This is to display the page specific content */}
            {children}
        </div>
    )
}

export default Layout; // this line means we are making the Layout function available for other files to import and use.
