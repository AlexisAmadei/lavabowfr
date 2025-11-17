import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import './Pictures.css'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'

const fakePhotos = [
  { id: 1, src: 'https://placehold.co/600x337', alt: 'Côme se fracasse la cheville' },
  { id: 2, src: 'https://placehold.co/600x337', alt: 'Légende' },
  { id: 3, src: 'https://placehold.co/600x337', alt: 'Légende' },
];

export default function Pictures() {
  const [activeId, setActiveId] = React.useState(fakePhotos[0].id);

  const handleActive = (id) => setActiveId(id);

  // Use fixed container height
  const containerHeight = 600; // px
  const itemCount = fakePhotos.length;

  // Each image gets its own vertical position with spacing
  const imageItemHeight = 337; // Height per image including spacing
  const imageGap = 40; // Gap between images
  const totalImageHeight = imageItemHeight + imageGap;

  // Text items have different spacing
  const textItemSpacing = 80; // Natural spacing between text items

  const activeIndex = fakePhotos.findIndex(photo => photo.id === activeId);

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
            {fakePhotos.map((photo, index) => (
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
                  {photo.alt}
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
            {fakePhotos.map((photo, index) => (
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
                  src={photo.src}
                  alt={photo.alt}
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
