import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Layout from '../components/Layout';
import proper_down_push_up from '../assets/new proper down push-up.png';
import proper_up_push_up from '../assets/new proper up push-up.png';
import proper_down_sit_up from '../assets/new proper down sit-up.png';
import proper_up_sit_up from '../assets/new proper up sit-up.png';

function Guide() {
    const navigate = useNavigate();

    // this protects the /guide route from being accessed without logging in first:
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
            <div style = {container}>
                <div style={{display:'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center',width:'850px', border: '3px solid rgb(206, 169, 36)', padding: '12px 30px', borderRadius: '12px', marginTop: '30px', marginBottom: '20px'}}>
                    <h1 style={{...heading, fontSize: '45px', border:'none', marginBottom:'-20px', marginTop:'0px'}}>About</h1>
                    <p style={{...caption, fontWeight: 'normal', fontFamily:'sans-serif', fontSize: '25px', textAlign:'justify'}}>This page is a guide that explains the proper form and movement criteria that the web application uses to determine whether your push-up or sit-up rep is counted as valid. Our goal is to help you understand the standards being applied and why your rep may be accepted or rejected. All the best!</p>
                    <p style={{...caption, fontWeight: 'normal', fontFamily:'sans-serif', fontSize: '25px', textAlign:'justify'}}>
                    Please note that the official ELISS machine standards are not publicly available. As a result, the criteria used by our application are approximations derived from publicly available guidance on IPPT push-up and sit-up techniques. We developed these thresholds by manually analysing videos demonstrating proper form, measuring key movement characteristics, and iteratively refining the values through testing until they produced results that were both consistent and reasonably strict. While these criteria are designed to closely simulate the ELISS machine, they should not be regarded as the official ELISS standards.
                    </p>
                </div>

                <h1 style = {heading}>Proper Push-up form</h1>
                <p style={{fontFamily: 'sans-serif', color:'white', width: '925px', marginTop:'-35px', marginLeft:'260px', fontSize: '20px'}}>
                    <br></br>• Proper up: Elbows are locked out and straightened at the top of the rep
                    <br></br>• Proper down: Elbows are bent below 90 degrees at the bottom of the rep
                    <br></br>• Throughout: Body is kept straight throughout the whole rep
                </p>
                <div style={imageRow}>
                    <div style={imageContainer}>
                        <img src={proper_up_push_up} style = {image}></img>
                        <p style = {caption}>Proper Push-up Up position</p>
                    </div>

                    <div style={imageContainer}>
                        <img src={proper_down_push_up} style = {image}></img>
                        <p style = {caption}>Proper Push-up Down position</p>
                    </div>
                </div>

                <h1 style = {heading}>Proper Sit-up form</h1>
                <p style={{fontFamily: 'sans-serif', color:'white', width: '925px', marginTop:'-35px', marginLeft:'140px', fontSize: '20px'}}>
                    <br></br>• Proper down: Back is flat on the floor at the bottom of the rep
                    <br></br>• Proper up: Torso is crunched high enough for elbows to touch thighs at the top of the rep
                </p>
                <div style={imageRow}>
                    <div style={imageContainer}>
                        <img src={proper_down_sit_up} style = {image}></img>
                        <p style = {caption}>Proper Sit-up Down position</p>
                    </div>

                    <div style={imageContainer}>
                        <img src={proper_up_sit_up} style = {image}></img>
                        <p style = {caption}>Proper Sit-up Up position</p>
                    </div>
                </div>

                <h1 style = {{...heading, marginBottom:'8px'}}>Movement Criteria for a valid rep</h1>
                <p style = {{...caption, fontSize: '20px'}}>Note: 'Neutral' position is when you are neither in the 'proper up' nor 'proper down' position</p>
                <p style = {{...caption, fontSize: '20px'}}><span style={{color:'rgb(41, 241, 41)'}}>✓</span><span style={{marginLeft:'6px', color:'rgb(206, 169, 36)'}}>For push-ups:</span> Proper up → Neutral → Proper down → Neutral → Proper up</p>
                <p style = {{...caption, fontSize: '20px'}}><span style={{color:'rgb(41, 241, 41)'}}>✓</span><span style={{marginLeft:'6px', color:'rgb(206, 169, 36)'}}>For sit-ups:</span> Proper down → Neutral → Proper up → Neutral → Proper down</p>
            </div>
        </Layout>
    ); 
}

const container: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
};

const heading: React.CSSProperties = {
    fontFamily: 'Bebas Neue', 
    fontWeight: '700', 
    color: 'rgb(206, 169, 36)', 
    marginBottom: '30px', 
    border: '1px solid rgb(209, 169, 36)', 
    padding: '10px', 
    borderRadius: '12px'
}

const imageRow: React.CSSProperties = {
    display:'flex', 
    alignItems: 'center', 
    justifyContent:'center', 
    gap:'20px'
}

const imageContainer: React.CSSProperties = {
    display:'flex', 
    flexDirection:'column', 
    alignItems: 'center', 
    justifyContent:'center', 
    fontSize:'20px'
}

const image: React.CSSProperties = {
    height: '300px',
    width: '450px'
}

const caption: React.CSSProperties = {
    fontFamily: 'Bebas Neue', 
    fontWeight: '700', 
    color: 'white'
}
export default Guide;