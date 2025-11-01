import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import { signInUser } from '@/utils/supabase/users';
import { AbsoluteCenter, Flex, Input } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);

  const handleSubmit = async (e) => {
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
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
    }
  };

  return (
    <AbsoluteCenter>
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
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap={4} width={'500px'}>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input placeholder="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <LavaButton type="submit" variant="filled" marginTop={4} width="100%">
              <LavaTypo variant="text" size="18px">Se connecter</LavaTypo>
            </LavaButton>
          </Flex>
        </form>
        {error && <LavaTypo variant="text" styles={{ color: 'red' }} size={16}>{error}</LavaTypo>}
      </Flex>
    </AbsoluteCenter>
  )
}
