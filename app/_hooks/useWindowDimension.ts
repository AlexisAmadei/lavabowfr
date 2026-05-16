import { useEffect, useState } from "react";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

function useWindowDimension() {
    const [windowDimension, setWindowDimension] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimension(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimension;
}

export default useWindowDimension;