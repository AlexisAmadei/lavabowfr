import React, { useEffect } from 'react'
import { Field, Flex, IconButton, Input, InputGroup } from '@chakra-ui/react'
import { ArrowIcon } from './Icons';
import LavaTypo from '@/components/Design/LavaTypo';
import './styles/LavaInput.css'
import { insertNewsletterItem } from '@/utils/supabase/newsletter';
import { toaster } from '../ui/toaster';
import GlassSurface from '../react-bits/GlassSurface/GlassSurface';

export default function LavaInput({ type, placeholder, setError, error, variant, fullWidth, fontColor }) {

  const [submitted, setSubmitted] = React.useState(false);
  const [timeout, setTimeout] = React.useState(null);
  const [email, setEmail] = React.useState('');

  const insertEmail = async (email) => {
    try {
      const { data, error } = await insertNewsletterItem(email);
      if (error) {
        setError(true);
        if (error === 'invalid') {
          toaster.create({
            title: 'Mets un vrai mail par contre !',
            type: 'error',
          });
          return;
        } else if (error.message.includes('duplicate key value')) {
          toaster.create({
            title: 'Tu es déjà inscrit(e) à la newsletter !',
            type: 'info',
          });
        }
      } else {
        setEmail('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        toaster.create({
          title: 'Inscription réussie ! (On va quand même vérifier ce que t\'as donné comme mail 🥸)',
          type: 'success',
        });
      }
    } catch (error) {
      if (error.message.includes('duplicate key value')) {
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
  }, [error]);

  const endIcon = (
    <IconButton onClick={handleSubmit} variant={'ghost'} rounded={'full'} aria-label='Send' className='lava-input-button'>
      <ArrowIcon boxSize={6} color={'white'} />
    </IconButton>
  )

  return (
    <Flex alignItems={'center'} justifyContent={'center'} gap={2} flexDirection={'row'}>
      <Field.Root invalid={error}>
        <GlassSurface
          width={400}
          height={60}
          borderRadius={50}
          className="my-custom-class"
        >
          <InputGroup endElement={endIcon} className={`lava-input ${variant || ''}`}>
            <Input
              placeholder={placeholder}
              type={type}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size={'xl'}
              borderRadius={'50px'}
              borderColor={'transparent'}
              _placeholder={{ color: "gray.400", fontWeight: '500' }}
              width={fullWidth ? '100%' : 'auto'}
              _focusVisible={{ outline: 'none'}}
            />
          </InputGroup>
        </GlassSurface>
      </Field.Root>
    </Flex>
  )
}
