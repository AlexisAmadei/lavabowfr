import { Box, Flex } from '@chakra-ui/react'
import LavaTypo from '@/components/Design/LavaTypo'
import aboutSection from '@/assets/img/about-section.webp'
import './styles/AboutSection.css'
import useIsMobile from '../../hooks/useIsMobile'
import Section from '../Design/Section'
import { Fragment } from 'react'
import { useTranslation } from '@/i18n/useTranslation'

export default function AboutSection() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <Section id='about' contained={true} title={t.about.title}>
      <Flex
        className='about-section'
        direction={'column'}
        alignItems={'flex-start'}
        textAlign={'center'}
        width={'100%'}
      >

        <Flex gap={16} direction={isMobile ? 'column' : 'row'} width={'100%'}>
          <Box flexBasis={'2/3'}>
            <LavaTypo variant='p' textAlign={isMobile ? 'center' : 'left'}>
              {t.about.paragraphs.map((paragraph, index) => (
                <Fragment key={index}>
                  {paragraph}
                  {index < t.about.paragraphs.length - 1 && <><br /><br /></>}
                </Fragment>
              ))}
            </LavaTypo>
          </Box>

          <Box className='about-section-image' border={'none'} overflow={'hidden'} flexBasis={'1/3'}>
            <img src={aboutSection} alt="About Lava Bow" title="About Lava Bow" />
          </Box>
        </Flex>
      </Flex>
    </Section>
  )
}
