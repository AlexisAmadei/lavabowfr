import Section from '@/components/Design/Section'
import { Box, Carousel, Flex, IconButton } from '@chakra-ui/react'
import LavaTypo from '@/components/Design/LavaTypo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { PictureItem } from '@/types/types'

export default function MobilePictures({ pictures }: { pictures: PictureItem[] }) {
  return (
    <Section id='photos' title='Lava Bow en photos'>

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
  )
}
