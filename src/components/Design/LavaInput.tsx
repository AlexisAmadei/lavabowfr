import React, { useEffect } from 'react'
import { Field, Flex, IconButton, Input, InputGroup, Icon } from '@chakra-ui/react'
import { ArrowIcon } from './Icons';
import './styles/LavaInput.css'
import { insertNewsletterItem } from '@/utils/supabase/newsletter';
import { toaster } from '../ui/toaster';
import GlassSurface from '../react-bits/GlassSurface/GlassSurface';

function checkEmailFormat(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
      if (!checkEmailFormat(email)) {
        setError(true);
        toaster.create({
          title: 'Mets un vrai mail par contre !',
          type: 'error',
        });
        return;
      }

      const { error } = await insertNewsletterItem(email.toLowerCase().trim());
      if (error) {
        setError(true);
        if (error === 'invalid') {
          toaster.create({
            title: 'Mets un vrai mail par contre !',
            type: 'error',
          });
          return;
        } else if (typeof error !== 'string' && error.message.includes('duplicate key value')) {
          toaster.create({
            title: 'Tu es déjà inscrit(e) à la newsletter !',
            type: 'info',
          });
        }
      } else {
        setEmail('');
        toaster.create({
          title: 'Inscription réussie ! (On va quand même vérifier ce que t\'as donné comme mail 🥸)',
          type: 'success',
        });
      }
    } catch (err: unknown) {
      const error = err as { message?: string } | undefined
      if (error?.message?.includes?.('duplicate key value')) {
        toaster.create({
          title: 'Tu es déjà inscrit(e) à la newsletter !',
          type: 'info',
        });
      }
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

  useEffect(() => {
    if (error) {
      setError(true);
    }
  }, [error, setError]);

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
          >
            <InputGroup endElement={endIcon} className={`lava-input ${variant || ''}`}>
              <Input
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size={'xl'}
                borderRadius={'50px'}
                borderColor={'transparent'}
                _placeholder={{ color: "gray.400", fontWeight: '500' }}
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
              _placeholder={{ color: "gray.400", fontWeight: '500' }}
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
