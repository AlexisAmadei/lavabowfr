import { Box, Input, InputGroup } from '@chakra-ui/react'
import React from 'react'
import { LuMail } from 'react-icons/lu'

export default function LavaInput() {
    const [email, setEmail] = React.useState('');

    return (
        <Box>
            <InputGroup startElement={<LuMail />}>
                <Input
                    placeholder="Email"
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} variant={'flushed'}
                    size={'xl'}
                />
            </InputGroup>
        </Box>
    )
}
