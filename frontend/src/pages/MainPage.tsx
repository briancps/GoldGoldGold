import { useEffect } from 'react';
// useEffect: runs code after the component loads (or when something changes)
    /* 
        useEffect(
            () => { ... },  // 1st input: a function containing the code to run
            []              // 2nd input: a dependency array - controls when it runs. empty [] means run once only when page first loads. [someValue] means re-run everytime someValue changes
        )
    */
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import pushUp from '../assets/push-up image.png';
import sitUp from '../assets/sit-up image.png';

function MainPage() {
    const navigate = useNavigate();
    
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

   return (
    <Layout>
        <div style = {{
            display : 'flex',
            flexDirection : 'column',
            alignItems : 'center',
            justifyContent : 'center',
        }}>
            <h1 style = {{
                fontSize : '36px',
                fontWeight : '700',
                fontFamily : 'Bebas Neue',
                color: 'rgb(206, 169, 36)',
                marginTop : '150px',
                marginLeft : '15px'
            }}>
                Choose Your Exercise
            </h1>

            {/* This is to make the push-up and sit-up option to be side by side */}
            <div style = {{
                display : 'flex',
                marginTop : '20px',
                gap: '40px',
                marginLeft : '20px'
            }}>
                <button
                    onClick = {() => navigate('/pushup')}
                    style = {{
                        fontSize : '25px',
                        fontWeight : '700',
                        fontFamily : 'Bebas Neue',
                        backgroundColor : 'black',
                        color : 'rgb(206, 169, 36)',
                        border : '1px solid rgb(206, 169, 36)',
                        borderRadius : '12px',
                        padding : '32px 48px',
                        cursor : 'pointer'
                    }}>
                        <img src = {pushUp} alt = 'PushUp' style = {{marginBottom : '20px', width : '170px', height : '120px'}}></img>
                        <p style = {{marginBottom : '-5px'}}>Push-up</p>
                </button>

                <button
                    onClick = {() => navigate('/situp')}
                    style = {{
                        fontSize : '25px',
                        fontWeight : '700',
                        fontFamily : 'Bebas Neue',
                        backgroundColor : 'black',
                        color : 'rgb(206, 169, 36)',
                        border : '1px solid rgb(206, 169, 36)',
                        borderRadius : '12px',
                        padding : '32px 48px',
                        cursor : 'pointer'
                    }}>
                        <img src = {sitUp} alt = 'PushUp' style = {{marginLeft : '15px', marginRight : '15px', marginBottom : '20px', width : '140px', height : '140px'}}></img>
                        <p style = {{marginBottom : '-5px'}}>Sit-up</p>
                </button>
            </div>

            <p style = {{
                color : 'white',
                fontSize : '18px',
                fontWeight : '700',
                fontFamily : 'Bebas Neue',
                marginTop : '40px',
                marginLeft : '24px'}}> 
                Get started on the 60s statics training of your choice! 
            </p>
        </div>
    </Layout>
   )
}
export default MainPage; // this line means we are making the MainPage function available for other files to import and use.