import React from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import { FaPlay } from 'react-icons/fa';
import '@/components/Core/CursorButton/CursorButton.css';

export default function CursorButton() {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [defaultPosition, setDefaultPosition] = React.useState({ x: 0, y: 0 });
    const [isFollowingMouse, setIsFollowingMouse] = React.useState(false);
    const heroRef = React.useRef(null);

    const currentPosition = isFollowingMouse ? mousePosition : defaultPosition;

    const followButtonStyle = {
        position: 'absolute',
        left: 0,
        top: 0,
        transform: `translate(${currentPosition.x - 50}px, ${currentPosition.y - 25}px)`,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 1,
        transition: isFollowingMouse
            ? 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease'
            : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease', // Slower transition when returning to default
    };

    React.useEffect(() => {
        const heroElement = heroRef.current?.parentElement; // Get the hero container

        if (!heroElement) return;

        const handleMouseMove = (event) => {
            if (!isFollowingMouse) return; // Only track mouse when following

            const rect = heroElement.getBoundingClientRect();
            const x = event.clientX - rect.left; // Position relative to hero
            const y = event.clientY - rect.top;  // Position relative to hero

            setMousePosition({ x, y });
        };

        const handleMouseEnter = () => {
            setIsFollowingMouse(true);
        };

        const handleMouseLeave = () => {
            setIsFollowingMouse(false);
            // Button will smoothly return to default position
        };

        // Initialize default position based on hero size
        const rect = heroElement.getBoundingClientRect();
        const centerX = rect.width / 2;   // Center horizontally
        const centerY = rect.height / 2;  // Center vertically

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

    return (
        <div ref={heroRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <LavaButton variant={'outlined'} className='follow-mouse-button' style={followButtonStyle}>
                <FaPlay />
                <LavaTypo>Voir le clip</LavaTypo>
            </LavaButton>
        </div>
    )
}
