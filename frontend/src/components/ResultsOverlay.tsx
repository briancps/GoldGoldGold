import { useNavigate } from "react-router-dom";

interface ResultOverlayProps {
    exerciseType : string; // exercise type to be displayed on overlay at the end of session
    repCount : number; // final rep count to be displayed to user at the end of session
    onTryAgain : () => void // callback field so that when user clicks "Try Again" it calls a function defined in the parent component
}

// takes in 3 arguments of type ResultOverlayProps as defined above
function ResultsOverlay({ exerciseType, repCount, onTryAgain } : ResultOverlayProps) {
    const navigate = useNavigate();
    return (
        <div style = {{
            /*
            This is to position the overlay relative to its nearest positioned parent container. 

            In this case, results overlay and webcam component would be wrapped in a parent div with position : 'relative'.
            So, by making position : 'absolute' here, it ensures the overlay would be displayed over the webcam feed.

            We set top, bottom, left and right to be 0 to ensure the overlay stretches to fill up the parent div container
            */
            position : 'absolute',
            top : 0,
            bottom : 0,
            left : 0,
            right : 0,
            display : 'flex',
            flexDirection : 'column',
            alignItems : 'center',
            justifyContent : 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        }}>
            <h1 style = {{
                fontSize : '32px',
                fontWeight : '700',
                fontFamily : 'Bebas Neue',
                color: 'rgb(206, 169, 36)'
            }}>
                Session Completed!
            </h1>

            <p style = {{
                fontSize : '20px',
                fontFamily : 'Bebas Neue',
                color : 'white'
            }}>
                Exercise Type : {exerciseType}
            </p>

            <p style = {{
                fontSize : '20px',
                fontFamily : 'Bebas Neue',
                color : 'white',
            }}>
                Rep Count : {repCount}
            </p>

            <div style = {{
                display : 'flex',
                gap : '16px',
                marginLeft : '25px',
                marginTop : '10px'
            }}>
                <button 
                    onClick = {onTryAgain}
                    style = {{
                        padding : '12px 32px',
                        fontSize : '18px',
                        fontWeight : '700',
                        fontFamily : 'Bebas Neue',
                        background : 'rgb(206, 169, 36)',
                        border : 'none',
                        borderRadius : '8px',
                        color : 'black',
                        cursor : 'pointer'
                    }}>
                        Try Again
                </button>

                <button
                    onClick = {() => navigate('/main')}
                    style = {{
                        padding : '12px 32px',
                        fontSize : '18px',
                        fontWeight : '700',
                        fontFamily : 'Bebas Neue',
                        background : 'rgb(206, 169, 36)',
                        border : 'none',
                        borderRadius : '8px',
                        color : 'black',
                        cursor : 'pointer'
                    }}>
                        Change Exercise
                </button>
            </div>
        </div>
    );
}

export default ResultsOverlay;