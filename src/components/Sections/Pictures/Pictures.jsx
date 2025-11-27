import { Box, Carousel, Flex, IconButton } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import './Pictures.css'
import Section from '@/components/Design/Section'
import LavaTypo from '@/components/Design/LavaTypo'
import { fetchPicturesContent } from '@/utils/supabase/pictures'
import useIsMobile from '@/hooks/useIsMobile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
// import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export default function Pictures() {
  const [pictures, setPictures] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const isMobile = useIsMobile();

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
  const imageItemHeight = 400; // Height per image including spacing
  const imageGap = 40; // Gap between images
  const totalImageHeight = imageItemHeight + imageGap;

  // Text items have different spacing
  const textItemSpacing = 80; // Natural spacing between text items

  const activeIndex = pictures.findIndex(photo => photo.id === activeId);

  if (pictures.length === 0) {
    return null;
  }
  console.log('Rendering Pictures with', pictures.length, 'items. Active ID:', activeId);

  if (isMobile) {
    return (
      <Section id='photos' styles={{ marginTop: '60px' }} title='Lava Bow en photos'>

        <Carousel.Root
          slideCount={pictures.length}
          width={'100%'}
          maxW="md"
          mx="auto"
          allowMouseDrag
          snapType="mandatory"
          loop={true}
        >
          <Carousel.ItemGroup>
            {pictures.map((photo, index) => (
              <Carousel.Item key={photo.id} index={index} snapAlign="center">
                <Flex direction={'column'} alignItems={'center'} gap={4}>
                  <Box width="100%" aspectRatio="16/9" overflow="hidden" borderRadius="2px">
                    <img
                      src={photo.link}
                      alt={photo.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  <LavaTypo variant={'h3'}>{photo.title}</LavaTypo>
                </Flex>
              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>

          <Carousel.Control justifyContent={'center'} gap="4" mt="4">
            <Carousel.PrevTrigger asChild>
              <IconButton size="sm" aria-label="Previous">
                <FontAwesomeIcon icon={faAngleLeft} color='white' />
              </IconButton>
            </Carousel.PrevTrigger>

            <Carousel.IndicatorGroup>
              {pictures.map((_, index) => (
                <Carousel.Indicator key={index} index={index} />
              ))}
            </Carousel.IndicatorGroup>

            <Carousel.NextTrigger asChild>
              <IconButton size="sm" aria-label="Next">
                <FontAwesomeIcon icon={faAngleRight} color='white' />
              </IconButton>
            </Carousel.NextTrigger>

          </Carousel.Control>
        </Carousel.Root>
      </Section>
    );
  }

  return (
    <Section id="photos" styles={{ marginTop: '60px' }}>
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
