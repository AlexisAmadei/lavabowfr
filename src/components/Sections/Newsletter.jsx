import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaInput from '@/components/Design/LavaInput'
import bgPic from '@/assets/img/newsletter.webp'
import Section from '@/components/Design/Section'

export default function Newsletter() {
    const [error, setError] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [submitted, setSubmitted] = React.useState(false);

    const handleSubmit = (email) => {
        if (!email) {
            setError(true);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError(true);
            return;
        }
        setError(false);
        console.log('Email submitted:', email);
        setEmail('');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    }

    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setError(false);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [error]);

    return (
        <Section bgImage={bgPic}>
            <Flex gap={8} direction={'column'} alignItems={'center'} position={'relative'}>

                <Flex gap={3} direction={'column'} alignItems={'center'}>
                    <LavaTypo variant={'h2'}>Newsletter</LavaTypo>
                    <LavaTypo variant={'text'}>Deviens un LAVA FAN et ne rate plus aucune actualité !</LavaTypo>
                </Flex>

                <Box width={'100%'} maxWidth={'400px'} position={'relative'}>
                    <LavaInput
                        type='email'
                        placeholder='Email'
                        error={error}
                        value={email}
                        setEmail={setEmail}
                        onClick={() => handleSubmit(email)}
                    />
                    {submitted &&
                        <Box
                            position={'absolute'}
                            top={'100%'}
                            left={'50%'}
                            transform={'translateX(-50%)'}
                            mt={4}
                            whiteSpace={'nowrap'}
                        >
                            <LavaTypo variant='bold'>Merci pour ton inscription !</LavaTypo>
                        </Box>
                    }
                </Box>
            </Flex>
        </Section>
    )
}
