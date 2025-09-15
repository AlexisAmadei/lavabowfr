import { Box, Field, Flex, IconButton, Input, InputGroup } from '@chakra-ui/react'
import React from 'react'
import './styles/LavaInput.css'
import { ArrowIcon } from './Icons';
import LavaTypo from '@/components/Design/LavaTypo';

export default function LavaInput({ type, placeholder, error, value, setEmail, onClick }) {
    return (
        <Flex className='lava-input' alignItems={'center'} justifyContent={'center'} gap={2} flexDirection={'row'}>
            <Field.Root invalid={error}>

                <Input
                    placeholder={placeholder}
                    type={type}
                    value={value}
                    onChange={(e) => setEmail(e.target.value)}
                    size={'xl'}
                    // color={'white'}
                    variant={'flushed'}
                    _placeholder={{ color: "white" }}
                />
                <Field.ErrorText>
                    <LavaTypo variant='bold'>Met un vrai mail par contre</LavaTypo>
                </Field.ErrorText>
            </Field.Root>
            <Box>
                <IconButton onClick={() => onClick(value)} variant={'ghost'} rounded={'full'} aria-label='Send'>
                    <ArrowIcon boxSize={6} color={'white'} />
                </IconButton>
            </Box>
        </Flex>
    )
}
