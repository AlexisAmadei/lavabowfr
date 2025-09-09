import React from 'react'
import LavaButton from './Design/LavaButton'
import LavaTypo from './Design/LavaTypo'
import { FaPlay } from 'react-icons/fa';
import './styles/CursorButton.css';

export default function CursorButton() {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    const followButtonStyle = {
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${mousePosition.x - 50}px, ${mousePosition.y - 25}px)`,
        zIndex: 9999,
        pointerEvents: 'none',
    };

    React.useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <LavaButton variant={'outline'} className='follow-mouse-button' style={followButtonStyle}>
            <FaPlay />
            <LavaTypo>Voir le clip</LavaTypo>
        </LavaButton>
    )
}
