import { Box, Input, InputGroup } from '@chakra-ui/react'
import React from 'react'
import { LuMail } from 'react-icons/lu'
import './styles/LavaInput.css'
import { HiArrowRight } from 'react-icons/hi2';

export default function LavaInput({ type, placeholder }) {
    const [email, setEmail] = React.useState('');

    return (
        <Box className='lava-input'>
            <InputGroup startElement={<LuMail color='white' />}>
                <Input
                    placeholder={placeholder}
                    type={type}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} variant={'flushed'}
                    size={'xl'}
                />
            </InputGroup>
            <HiArrowRight className='lava-input-icon' />
        </Box>
    )
}
