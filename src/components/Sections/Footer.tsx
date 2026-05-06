import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from '../Design/LavaTypo'
import LavaInput from '../Design/LavaInput'
import lb_footer from '@/assets/footer/lb_footer.svg'
import useIsMobile from '@/hooks/useIsMobile'
import ClipboardElement from '../Core/ClipboardElement'
import { useTranslation } from '@/i18n/useTranslation'

export default function Footer() {
  const isMobile = useIsMobile();
  const [error, setError] = React.useState(false);
  const { t } = useTranslation();

  return (
    <Flex
      paddingTop={isMobile ? 4 : 8}
      style={{
        backgroundColor: 'var(--main-accent)',
        width: '100%',
      }}
      direction={'column'}
      justifyContent={'space-between'}
      height={'auto'}
      gap={2}
    >
      <Flex className='footer-infos' direction={isMobile ? 'column' : 'row'} width={'100%'} justifyContent={'space-evenly'} gap={isMobile ? 4 : 0} mb={!isMobile ? 16 : 6}>
        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          alignItems={'flex-start'}
          gap={!isMobile ? 6 : 0}
          justifyContent={'center'}
          paddingX={4}
        >
          <LavaTypo variant={'h3'}>{t.footer.booking}</LavaTypo>
          <ClipboardElement text='lavabow.band@gmail.com' />
        </Flex>

        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          gap={!isMobile ? 6 : 0}
          alignItems={'flex-start'}
          paddingX={4}
          height={'68px'}
        >
          <LavaTypo variant={'h3'}>{t.footer.socials}</LavaTypo>
          <Flex flexDirection={'row'} gap={1} alignItems={'center'} zIndex={100}>
            <a className="footer-link" href='https://www.instagram.com/lavabow/' target='_blank' rel='noopener noreferrer'>
              <LavaTypo>Instagram</LavaTypo>
            </a>
            ,
            <a className="footer-link" href='https://www.facebook.com/lavabow' target='_blank' rel='noopener noreferrer'>
              <LavaTypo>Facebook</LavaTypo>
            </a>
            ,
            <a className="footer-link" href='https://www.youtube.com/@lavabow' target='_blank' rel='noopener noreferrer'>
              <LavaTypo>YouTube</LavaTypo>
            </a>
          </Flex>
        </Flex>

        <Flex flexBasis={'1/3'}
          flexDirection={'column'}
          alignItems={'flex-start'}
          paddingX={4}
          m={0}
        >
          <LavaTypo variant={'h3'}>{t.footer.newsletter}</LavaTypo>
          <Box width={'100%'}>
            <LavaInput
              liquidGlass={false}
              placeholder={t.footer.emailPlaceholder}
              variant={'subtle'}
              error={error}
              setError={setError}
            />
          </Box>
        </Flex>
      </Flex>

      <Flex width={'100%'} flex={1} alignItems={'flex-end'} justifyContent={'center'}>
        <img src={lb_footer} alt='Logo Lavabow Footer' style={{ width: '100%', height: 'auto' }} title='Logo Lavabow Footer' />
      </Flex>
      <Box zIndex={1000} p={0} mt={1} py={2}>
        <LavaTypo textAlign='center' variant='p' size={12}>
          {t.footer.copyright}
        </LavaTypo>
      </Box>
    </Flex>
  )
}
