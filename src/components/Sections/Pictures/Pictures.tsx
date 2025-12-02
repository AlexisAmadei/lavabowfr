import { Box, Flex } from '@chakra-ui/react'
import { lazy, Suspense, useEffect, useState } from 'react'
import './Pictures.css'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { fetchPicturesContent } from '@/utils/supabase/pictures'
import useIsMobile from '@/hooks/useIsMobile'
import type { PictureItem } from '@/types/types'
import useWindowDimension from '@/hooks/useWindowDimension'

export default function Pictures() {
  const [pictures, setPictures] = useState<PictureItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  const isMobile = useIsMobile();
  const { height } = useWindowDimension();

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

  const handleActive = (id: number | undefined) => setActiveId(id || null);

  // Use fixed container height
  const containerHeight = 600;

  // Each image gets its own vertical position with spacing
  const imageItemHeight = height - (height * 0.5);
  const imageGap = 40; // Gap between images
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
    <Section id="photos" title="Lava Bow en photos">
      <Flex
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
            >
              <LavaTypo
                variant={'h2'}
                onClick={() => handleActive(photo.id)}
                styles={{
                  opacity: activeId === photo.id ? 1 : 0.5,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {photo.title}
              </LavaTypo>
              <LavaTypo
                variant={'p'}
                style={{
                  textWrap: 'nowrap'
                }}
              >
                {new Date(photo.date || '').toLocaleDateString('fr-FR').replace(/\//g, '.')}
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
                <img
                  src={photo.link || `https://placehold.co/640x400`}
                  style={{
                    width: '100%',
                    height: '100%',
                    opacity: activeId === photo.id ? 1 : 0.5,
                    objectFit: 'cover'
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Flex>
    </Section>
  )
}
