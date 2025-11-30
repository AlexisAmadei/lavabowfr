import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import LavaInput from '@/components/Design/LavaInput'
import bgPic from '@/assets/img/newsletter.webp'
import Section from '@/components/Design/Section'

export default function Newsletter() {
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
          <LavaTypo variant={'p'} styles={{ textAlign: 'center' }}>Deviens un LAVA FAN et ne rate plus aucune actualité !</LavaTypo>
        </Flex>

        <Box width={'100%'} maxWidth={'400px'} position={'relative'}>
          <LavaInput
            liquidGlass={true}
            placeholder='Email'
            error={error}
            setError={setError}
          />
        </Box>

      </Flex>
    </Section>
  )
}
