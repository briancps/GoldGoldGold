import { useState, useEffect } from "react";

interface TimerProps {
    isActive: boolean; // controls whether the timer system should run
    onTimeUp: () => void; // callback function that is triggered when the 60s exercise session timer finishes
    onCountdownEnd: () => void; // callback function that is triggered when the 10s preparation timer finishes
}

function Timer({ isActive, onTimeUp, onCountdownEnd }: TimerProps) {
    const [countdown, setCountdown] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);

    // when session becomes active, start the 10s countdown first for user to prepare and get into position
    useEffect(() => {
        if (!isActive) {
            setCountdown(null);  // resets countdown back to null
            setTimeLeft(60);  // resets timeLeft back to 60
            return;
        }

        setCountdown(10);
    }, [isActive]);

    // preparation phase — 10 seconds before main timer starts
    useEffect(() => {
        if (countdown === null) { // only runs while countdown exists
            return;
        }

        // when reaches 0, hide countdown + call parent callback + allow main timer to begin
        if (countdown === 0) {
            setCountdown(null);
            onCountdownEnd();
            return;
        }

        // ticks down 1 second
        const timeout = setTimeout(() => {
            setCountdown(prev => (prev !== null ? prev - 1 : null)); 
        }, 1000);

        // this cleans up to prevent multiple timeouts from running simultaneously and accumulating
        return () => clearTimeout(timeout);
    }, [countdown]);

    // main 60s exercise session timer — only runs after countdown reaches null (i.e. finished) and isActive === true
    useEffect(() => {
        if (!isActive || countdown !== null) {
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { // when the timer is going to end
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                return prev - 1; // ticks down 1 second
            });
        }, 1000);

        return () => clearInterval(interval); // cleanup
    }, [isActive, countdown]);

    return (
        <>
            {/* countdown preparation overlay — shown during the 10s preparation phase */}
            {countdown !== null && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    borderRadius: '16px',
                    zIndex: 10
                }}>
                    <p style={{
                        fontSize: '50px',
                        color: 'white',
                        fontFamily: 'Bebas Neue',
                        margin: 0
                    }}>
                        Get into position!
                    </p>
                    <span style={{
                        fontSize: '80px',
                        fontWeight: '700',
                        fontFamily: 'Bebas Neue',
                        color: 'rgb(206, 169, 36)'
                    }}>
                        {countdown}<span style={{ fontSize: '52px' }}>s</span>
                    </span>
                </div>
            )}

            {/* main timer display — only shown once 10s preparation timer is done and main timer is running */}
            {countdown === null && (
                <span style={{ fontSize: '40px', color: 'white', fontFamily: 'Bebas Neue' }}>
                    Time: {timeLeft}<span style={{ fontSize: '28px' }}>s</span>
                </span>
            )}
        </>
    );
}

export default Timer;