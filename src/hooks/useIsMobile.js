import { useState, useEffect } from 'react';

/**
 * 
 * @param {number} overrideWidth override value for the isMobile trigger
 * @returns {boolean}
 */
const useIsMobile = (overrideWidth) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= (overrideWidth || 1024));
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    return isMobile;
};

export default useIsMobile;