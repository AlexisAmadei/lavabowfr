import React from 'react'
import { Field, Flex, IconButton, Input, InputGroup, Icon } from '@chakra-ui/react'
import { ArrowIcon } from './Icons';
import './styles/LavaInput.css'
import { toaster } from '../ui/toaster';
import GlassSurface from '../react-bits/GlassSurface/GlassSurface';


export default function LavaInput({ placeholder, setError, error, variant, liquidGlass }: {
  placeholder?: string;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  variant?: string;
  liquidGlass?: boolean;
}) {
  const [email, setEmail] = React.useState('');

  const insertEmail = async (email: string) => {
    try {
      const res = await fetch('/api/mailchimp/addcontact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      if (res.status === 409) {
        setError(true);
        toaster.create({
          title: 'Tu es déjà inscrit(e) à la newsletter !',
          type: 'info',
        });
      } else if (res.status === 400) {
        setError(true);
        toaster.create({
          title: 'Mets un vrai mail par contre !',
          type: 'error',
        });
      } else if (!res.ok) {
        setError(true);
        toaster.create({
          title: 'Une erreur est survenue, réessaie !',
          type: 'error',
        });
      } else {
        setEmail('');
        toaster.create({
          title: 'Inscription réussie !',
          type: 'success',
        });
      }
    } catch {
      setError(true);
      toaster.create({
        title: 'Une erreur est survenue, réessaie !',
        type: 'error',
      });
    }
  }

  const handleSubmit = () => {
    if (!email) {
      setError(true);
      toaster.create({
        title: 'Faut écrire un truc par contre...🤓☝️',
        type: 'info',
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(true);
      toaster.create({
        title: 'Mets un vrai mail par contre !',
        type: 'error',
      });
      return;
    }
    insertEmail(email);
  }

  const endIcon = (
    <IconButton onClick={handleSubmit} variant={'ghost'} rounded={'full'} aria-label='Send' className='lava-input-button'>
      <Icon as={ArrowIcon} boxSize={6} color={'white'} />
    </IconButton>
  )

  return (
    <Flex alignItems={'center'} justifyContent={'center'} gap={2} flexDirection={'row'} width={'100%'} maxWidth={'400px'}>
      <Field.Root invalid={error} width={'100%'}>
        {liquidGlass ? (

          <GlassSurface
            // @ts-expect-error Allow string width to be passed to GlassSurface
            width={'100%'}
            height={60}
            borderRadius={50}
            blur={4}
          >
            <InputGroup endElement={endIcon} className={`lava-input ${variant || ''}`}>
              <Input
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size={'xl'}
                borderRadius={'50px'}
                borderColor={'transparent'}
                _placeholder={{ color: "gray.100", fontWeight: '500' }}
                width={'100%'}
                _focusVisible={{ outline: 'none' }}
              />
            </InputGroup>
          </GlassSurface>
        ) : (
          <InputGroup endElement={endIcon} className={`lava-input ${variant || ''}`}>
            <Input
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={'xl'}
              borderColor={'transparent'}
              borderBottomColor={'white'}
              _placeholder={{ color: "gray.100", fontWeight: '500' }}
              width={'100%'}
              _focusVisible={{ outline: 'none' }}
            />
          </InputGroup>
        )
        }
      </Field.Root>
    </Flex>
  )
}
