import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaInput from '@/components/Design/LavaInput'
import bgPic from '@/assets/img/newsletter.webp'
import Section from '@/components/Design/Section'
import { insertNewsletterItem } from '@/utils/supabase/newsletter'

export default function Newsletter() {
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState(false);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <Section bgImage={bgPic} id='newsletter'>
      <Flex gap={8} direction={'column'} alignItems={'center'} position={'relative'}>

        <Flex gap={3} direction={'column'} alignItems={'center'}>
          <LavaTypo variant={'h2'}>Newsletter</LavaTypo>
          <LavaTypo variant={'text'} styles={{ textAlign: 'center' }}>Deviens un LAVA FAN et ne rate plus aucune actualité !</LavaTypo>
        </Flex>

        <Box width={'100%'} maxWidth={'400px'} position={'relative'}>
          <LavaInput
            type='email'
            placeholder='Email'
            fullWidth={true}
            error={error}
            setError={setError}
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
