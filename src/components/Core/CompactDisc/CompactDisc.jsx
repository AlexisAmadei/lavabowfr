// CompactDisc.jsx
import React from 'react';
import { Box } from '@chakra-ui/react';
import './CompactDisc.css';

export default function CompactDisc() {
    return (
        <Box className='cd-container' width={'100%'}>
            <Box className='cd'>
                <Box className='cd-inner'>
                    <Box className='cd-label'>
                        <Box className='cd-hole'></Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}