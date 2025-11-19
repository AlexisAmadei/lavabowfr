import { Box, Flex } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import './Pictures.css'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { fetchPicturesContent } from '@/utils/supabase/pictures'

export default function Pictures() {
  const [pictures, setPictures] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const loadPictures = async () => {
      await fetchPicturesContent(setPictures);
    };
    loadPictures();
  }, []);

  useEffect(() => {
    if (pictures.length > 0 && !activeId) {
      setActiveId(pictures[0].id);
    }
  }, [pictures, activeId]);

  const handleActive = (id) => setActiveId(id);

  // Use fixed container height
  const containerHeight = 600; // px

  // Each image gets its own vertical position with spacing
  const imageItemHeight = 337; // Height per image including spacing
  const imageGap = 40; // Gap between images
  const totalImageHeight = imageItemHeight + imageGap;

  // Text items have different spacing
  const textItemSpacing = 80; // Natural spacing between text items

  const activeIndex = pictures.findIndex(photo => photo.id === activeId);

  if (pictures.length === 0) {
    return null;
  }

  return (
    <Section title="Pictures" styles={{ marginTop: '60px' }}>
      <Flex gap={3} direction={'column'} alignItems={'center'} marginBottom={'48px'}>
        <LavaTypo variant={'h2'}>Lava Bow en photos</LavaTypo>
      </Flex>

      <Flex
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        maxHeight={`${containerHeight}px`}
        overflow={'hidden'}
        width={'100%'}
      >
        <Box flex="1" height={`${containerHeight}px`} position={'relative'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Box position={'relative'} width={'100%'} height={'100%'}>
            {pictures.map((photo, index) => (
              <Box
                key={photo.id}
                position={'absolute'}
                top={`calc(50% + ${(index - activeIndex) * textItemSpacing}px)`}
                transform={'translateY(-50%)'}
                width={'100%'}
                transition={'top 0.6s ease-in-out, opacity 0.3s ease'}
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
              </Box>
            ))}
          </Box>
        </Box>

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
              >
                <img
                  src={photo.link}
                  alt={photo.title}
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
