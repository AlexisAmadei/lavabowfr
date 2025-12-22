import { useState, useEffect } from 'react';

/**
 * Custom hook to determine if the device is mobile based on window width.
 * @param {number} overrideWidth override value for the isMobile trigger
 * @returns {boolean}
 */
const useIsMobile = (overrideWidth: number = 1024): boolean | null => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= overrideWidth);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, [overrideWidth]);

    return isMobile;
};

export default useIsMobile;