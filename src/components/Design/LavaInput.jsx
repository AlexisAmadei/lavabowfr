import React from 'react'
import { Field, Flex, IconButton, Input, InputGroup } from '@chakra-ui/react'
import { ArrowIcon } from './Icons';
import LavaTypo from '@/components/Design/LavaTypo';
import './styles/LavaInput.css'

export default function LavaInput({ type, placeholder, error, value, setEmail, onClick, variant, fullWidth }) {
  const endIcon = (
    <IconButton onClick={() => onClick(value)} variant={'ghost'} rounded={'full'} aria-label='Send' className='lava-input-button'>
      <ArrowIcon boxSize={6} color={'white'} />
    </IconButton>
  )

  return (
    <Flex className={`lava-input ${variant}`} alignItems={'center'} justifyContent={'center'} gap={2} flexDirection={'row'}>
      <Field.Root invalid={error}>
        <InputGroup endElement={endIcon}>
          <Input
            placeholder={placeholder}
            type={type}
            value={value}
            onChange={(e) => setEmail(e.target.value)}
            size={'xl'}
            borderRadius={'50px'}
            _placeholder={{ color: "white" }}
            width={fullWidth ? '100%' : 'auto'}
          />
        </InputGroup>
        <Field.ErrorText>
          <LavaTypo variant='bold'>Mets un vrai mail par contre</LavaTypo>
        </Field.ErrorText>
      </Field.Root>
    </Flex>
  )
}
