import React from 'react'
import Section from '@/components/Design/Section'
import { Box, Flex } from '@chakra-ui/react'
import LavaTypo from '../Design/LavaTypo'

const styles = {
    videoContainer: {
        position: 'relative',
        paddingBottom: '56.25%' /* 16:9 aspect ratio */,
        paddingTop: 25,
        height: 0,
    },
    iframe: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: 0,
    }
}

export default function Videos() {
    return (
        <Section>
            <Flex direction={'column'} gap={8} width={'100%'} alignItems={'center'}>
                <LavaTypo variant={'h1'}>Videos</LavaTypo>

                <Flex justifyContent={'center'} direction={'row'} gap={3}>
                    <Flex direction={'column'} gap={3} justifyContent={'flex-start'}>
                        <LavaTypo variant={'h2'}>Dernier clip</LavaTypo>
                        <Box sx={styles.videoContainer}>
                            <iframe id="ytplayer" type="text/html" width="996" height="560"
                                src="https://www.youtube.com/embed/Rbszi6x8mXE?autoplay=1&controls=1"
                                frameborder="0" allowfullscreen>
                            </iframe>
                        </Box>
                    </Flex>
                    <Flex className='video-list' direction={'column'} gap={3} maxHeight={'700px'} overflowY={'auto'}>
                        <iframe id="ytplayer" type="text/html" width="320" height="180"
                            src="https://www.youtube.com/embed/Rbszi6x8mXE?controls=0"
                            frameborder="0" allowfullscreen>
                        </iframe>
                        <iframe id="ytplayer" type="text/html" width="320" height="180"
                            src="https://www.youtube.com/embed/Rbszi6x8mXE?controls=1"
                            frameborder="0" allowfullscreen>
                        </iframe>
                        <iframe id="ytplayer" type="text/html" width="320" height="180"
                            src="https://www.youtube.com/embed/Rbszi6x8mXE?controls=1"
                            frameborder="0" allowfullscreen>
                        </iframe>
                        <iframe id="ytplayer" type="text/html" width="320" height="180"
                            src="https://www.youtube.com/embed/Rbszi6x8mXE?controls=1"
                            frameborder="0" allowfullscreen>
                        </iframe>
                        <iframe id="ytplayer" type="text/html" width="320" height="180"
                            src="https://www.youtube.com/embed/Rbszi6x8mXE?controls=1"
                            frameborder="0" allowfullscreen>
                        </iframe>
                        <iframe id="ytplayer" type="text/html" width="320" height="180"
                            src="https://www.youtube.com/embed/Rbszi6x8mXE?controls=1"
                            frameborder="0" allowfullscreen>
                        </iframe>
                    </Flex>
                </Flex>
            </Flex>
        </Section>
    )
}
