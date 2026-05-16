import Section from '../Design/Section'
import LavaTypo from '../Design/LavaTypo'
import { Flex } from '@chakra-ui/react'
import MediaLinks from '../Core/AppBar/MediaLinks'
import ClipboardElement from '../Core/ClipboardElement'

import Frogs from '@/assets/img/contact/3frogs.svg'
import Car from '@/assets/img/contact/car.svg'
import useIsMobile from '@/hooks/useIsMobile'
import { useTranslation } from '@/i18n/useTranslation'
import { useGetGlobalVar } from '@/hooks/useGetGlobalVar'

export default function Contact() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const contact_email = useGetGlobalVar('CONTACT_EMAIL') || 'contact@lavabow.fr';
  const contact_phone = useGetGlobalVar('CONTACT_PHONE') || '';

  return (
    <Section id={'contact'} bgColor={'var(--Background-bg-brand)'} title={t.contact.title} position='relative'>
      <LavaTypo textAlign='center' variant='p'>
        {t.contact.intro}
      </LavaTypo>

      <Flex
        gap={6}
        alignItems={'center'}
        justifyContent={'center'}
        mt={8}
        width={"100%"}
        maxWidth={'1000px'}
        direction={isMobile ? 'column' : 'row'}
      >
        <Flex
          width="100%"
          alignItems={'center'}
          justifyContent={'center'}
          bgColor={'white'}
          borderRadius={'50px'}
          p={2}
          px={8}
          height={'57px'}
        >
          <ClipboardElement text={contact_email} color='var(--main-accent)' />
        </Flex>

        <Flex
          width="100%"
          alignItems={'center'}
          justifyContent={'center'}
          bgColor={'white'}
          borderRadius={'50px'}
          p={2}
          px={8}
          height={'57px'}
        >
          <ClipboardElement text={contact_phone} color='var(--main-accent)' />
        </Flex>

        <Flex
          className='social-pill'
          alignItems={'center'}
          justifyContent={'center'}
          width="100%"
          bgColor={'white'}
          borderRadius={'50px'}
          p={2}
          height={'fit-content'}
        >
          <MediaLinks content='media' color='var(--main-accent)' size='2xl' padding='0' />
        </Flex>
      </Flex>

      <Flex
        width={'100%'}
        justifyContent={'space-between'}
        alignItems={'flex-end'}
        position={'absolute'}
        bottom={0}
        height={isMobile ? '38px' : 'unset'}
      >
        <img src={Car.src} alt='Contact Car' style={{ maxHeight: '100%'}} title='Contact Car' />
        <img src={Frogs.src} alt='Contact Frogs' style={{ maxHeight: '100%'}} title='Contact Frogs' />
      </Flex>
    </Section>
  )
}
