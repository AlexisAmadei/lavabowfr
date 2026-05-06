import { Box, Flex, Image } from '@chakra-ui/react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import './Pictures.css'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { fetchPicturesContent } from '@/utils/supabase/pictures'
import useIsMobile from '@/hooks/useIsMobile'
import type { PictureItem } from '@/types/types'
import { useTranslation } from '@/i18n/useTranslation'

export default function Pictures() {
  const [pictures, setPictures] = useState<PictureItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useTranslation();

  const isMobile = useIsMobile();

  useEffect(() => {
    const loadPictures = async () => {
      await fetchPicturesContent(setPictures);
    };
    loadPictures();
  }, []);

  useEffect(() => {
    if (pictures.length > 0 && !activeId) {
      setActiveId(pictures[0].id || null);
    }
  }, [pictures, activeId]);

  useEffect(() => {
    const measureContainer = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    measureContainer();
    window.addEventListener('resize', measureContainer);
    return () => window.removeEventListener('resize', measureContainer);
  }, []);

  const handleActive = (id: number | undefined) => setActiveId(id || null);

  // Use fixed container height
  const containerHeight = 600;

  // Calculate responsive image height and gap based on container width
  const imageItemHeight = Math.max(400, containerWidth * 0.75); // Scale with container width, minimum 400px
  const imageGap = Math.max(60, containerWidth * 0.12); // Gap scales with container width, minimum 60px
  const totalImageHeight = imageItemHeight + imageGap;

  // Text items have different spacing
  const textItemSpacing = 80; // Natural spacing between text items

  const activeIndex = pictures.findIndex(photo => photo.id === activeId);

  if (pictures.length === 0) {
    return null;
  }

  if (isMobile) {
    const MobilePictures = lazy(() => import('./MobilePictures'));
    return (
      <Suspense fallback={null}>
        <MobilePictures pictures={pictures} />
      </Suspense>
    );
  }

  return (
    <Section id="photos" title={t.pictures.title}>
      <Flex
        ref={containerRef}
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        maxHeight={`${containerHeight}px`}
        overflow={'hidden'}
        width={'100%'}
        gap={4}
      >
        <Flex
          flex="1"
          height={`${containerHeight}px`}
          position={'relative'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          {pictures.map((photo, index) => (
            <Box
              key={photo.id}
              position={'absolute'}
              top={`calc(50% + ${(index - activeIndex) * textItemSpacing}px)`}
              transform={'translateY(-50%)'}
              width={'100%'}
              transition={'top 0.6s ease-in-out, opacity 0.3s ease'}
              display={'flex'}
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'flex-end'}
              gap={4}
            >
              <LavaTypo
                variant={'h2'}
                onClick={() => handleActive(photo.id)}
                styles={{
                  opacity: activeId === photo.id ? 1 : 0.2,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {photo.title}
              </LavaTypo>
              <LavaTypo
                variant={'p'}
                style={{
                  textWrap: 'nowrap',
                  opacity: activeId === photo.id ? 1 : 0.2,
                  cursor: 'pointer',
                }}
                textAlign='right'
              >
                {new Date(photo.date || '').toLocaleDateString(language === 'en' ? 'en-GB' : 'fr-FR').replace(/\//g, '.')}
              </LavaTypo>
            </Box>
          ))}
        </Flex>

        <Box
          flex="1"
          height={`${containerHeight}px`}
          position={'relative'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Box position={'relative'} width={'100%'} height={'100%'}>
            {pictures.map((photo, index) => (
              <Box
                key={photo.id}
                position={'absolute'}
                top={`calc(50% + ${(index - activeIndex) * totalImageHeight}px)`}
                transform={'translateY(-50%)'}
                width={'100%'}
                height={`${imageItemHeight}px`}
                transition={'top 0.6s ease-in-out, opacity 0.3s ease'}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                onClick={() => handleActive(photo.id)}
                cursor={'pointer'}
              >
                <Box width="70%" height="90%">
                  <Image
                    src={photo.link || `https://placehold.co/640x400`}
                    alt={photo.title || 'Picture'}
                    borderRadius="2px"
                    aspectRatio={'16/9'}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    title='Gallerie Photo'
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Flex>
    </Section>
  )
}
