import React from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import { FaPlay } from 'react-icons/fa';
import './CursorButton.css';

export default function CursorButton() {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [defaultPosition, setDefaultPosition] = React.useState({ x: 0, y: 0 });
    const [isFollowingMouse, setIsFollowingMouse] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const [isUnfilling, setIsUnfilling] = React.useState(false);
    const [fillProgress, setFillProgress] = React.useState(0);
    const heroRef = React.useRef(null);
    const pressStartTime = React.useRef(null);
    const animationFrame = React.useRef(null);

    const currentPosition = isFollowingMouse ? mousePosition : defaultPosition;

    const followButtonStyle = {
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate(${currentPosition.x - 50}px, ${currentPosition.y - 25}px)`,
        zIndex: 9999,
        pointerEvents: 'auto',
        opacity: 1,
        '--fill-progress': `${fillProgress}%`,
        transition: isFollowingMouse
            ? 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
    };

    React.useEffect(() => {
        const heroElement = heroRef.current?.parentElement;

        if (!heroElement) return;

        const handleMouseMove = (event) => {
            if (!isFollowingMouse) return;

            const rect = heroElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            setMousePosition({ x, y });
        };

        const handleMouseEnter = () => {
            setIsFollowingMouse(true);
        };

        const handleMouseLeave = () => {
            setIsFollowingMouse(false);
        };

        // Initialize default position based on hero size
        const rect = heroElement.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        setDefaultPosition({ x: centerX, y: centerY });

        // Set initial position to default
        if (!isFollowingMouse) {
            setMousePosition({ x: centerX, y: centerY });
        }

        heroElement.addEventListener('mousemove', handleMouseMove);
        heroElement.addEventListener('mouseenter', handleMouseEnter);
        heroElement.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            heroElement.removeEventListener('mousemove', handleMouseMove);
            heroElement.removeEventListener('mouseenter', handleMouseEnter);
            heroElement.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isFollowingMouse]);

    // Animation loop for fill progress
    React.useEffect(() => {
        const updateProgress = () => {
            if (isPressed && pressStartTime.current) {
                const elapsed = Date.now() - pressStartTime.current;
                const duration = 1000;
                const progress = Math.min((elapsed / duration) * 100, 100);
                setFillProgress(progress);

                if (progress < 100) {
                    animationFrame.current = requestAnimationFrame(updateProgress);
                }
            }
        };

        const unfillAnimation = () => {
            if (!isPressed && fillProgress > 0) {
                setIsUnfilling(true);
                const unfillDuration = 300;
                const startProgress = fillProgress;
                const startTime = Date.now();
                const step = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.max(startProgress - (elapsed / unfillDuration) * startProgress, 0);
                    setFillProgress(progress);
                    if (progress > 0) {
                        animationFrame.current = requestAnimationFrame(step);
                    } else {
                        setIsUnfilling(false);
                    }
                };
                step();
            }
        };

        if (isPressed) {
            animationFrame.current = requestAnimationFrame(updateProgress);
        } else {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
                unfillAnimation();
            }
        }

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }
        };
    }, [isPressed]);

    const handleMouseDown = () => {
        setIsPressed(true);
        setIsUnfilling(false); // Stop unfilling if we press again
        pressStartTime.current = Date.now() - (fillProgress / 100) * 1000; // Resume from current progress using 1000ms duration
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    return (
        <div ref={heroRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <LavaButton 
                variant={'outlined'} 
                className={`follow-mouse-button ${isPressed || isUnfilling ? 'pressed' : ''}`}
                style={followButtonStyle}
                onMouseDown={(e) => {
                    console.log('LavaButton onMouseDown triggered');
                    handleMouseDown();
                }}
                onMouseUp={(e) => {
                    console.log('LavaButton onMouseUp triggered');
                    handleMouseUp();
                }}
                onMouseLeave={(e) => {
                    console.log('LavaButton onMouseLeave triggered');
                    handleMouseUp();
                }}
            >
                <FaPlay />
                <LavaTypo>Voir le clip</LavaTypo>
            </LavaButton>
        </div>
    )
}
