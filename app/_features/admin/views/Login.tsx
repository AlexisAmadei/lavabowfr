'use client';

import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import useIsMobile from '@/hooks/useIsMobile';
import { signInUser } from '@/utils/supabase/users';
import { AbsoluteCenter, Flex, Input } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const isMobile = useIsMobile();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError('Email et mot de passe sont requis.');
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      const response = await signInUser(email, password);
      if (response.error) {
        setError(response.error.message);
      } else {
        // Redirect to admin dashboard or perform other actions upon successful login
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
      console.warn('Login error:', err);
    }
  };

  return (
    <AbsoluteCenter w={'100%'} p={4}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        p={6}
        borderRadius="md"
        border={"1px solid gray"}
        gap={4}
      >
        <LavaTypo variant={"h2"}>T'as rien à faire ici !</LavaTypo>
        <form onSubmit={handleSubmit} style={{ width:'100%'}}>
          <Flex direction="column" gap={4} width={!isMobile ? '500px' : '100%'}>
            <Input width={'100%'} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input width={'100%'} placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <LavaButton type="submit" variant="filled">
              <LavaTypo size="18px">Se connecter</LavaTypo>
            </LavaButton>
          </Flex>
        </form>
        {error && <LavaTypo styles={{ color: 'red' }} size={16}>{error}</LavaTypo>}
      </Flex>
    </AbsoluteCenter>
  )
}
