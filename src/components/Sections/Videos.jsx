import React, { useEffect } from 'react'
import Section from '@/components/Design/Section'
import { Box, Flex } from '@chakra-ui/react'
import LavaTypo from '../Design/LavaTypo'
import useIsMobile from '../../hooks/useIsMobile'

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

const videoList = [
    {
        link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=0",
    },
    {
        link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
    },
    {
        link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
    },
    {
        link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
    },
    {
        link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
    },
    {
        link: "https://www.youtube.com/embed/Rbszi6x8mXE?controls=1",
    },
]

export default function Videos() {
    const [maxHeight, setMaxHeight] = React.useState();
    const isMobile = useIsMobile();

    useEffect(() => {
        const ref = document.getElementById('featured-video');
        if (ref) {
            setMaxHeight(ref.clientHeight);
        }
    }, []);

    return (
        <Section id='videos'>
            <Flex direction={'column'} gap={8} width={'100%'} alignItems={'center'}>
                <LavaTypo variant={'h1'}>Vidéos</LavaTypo>

                <Flex justifyContent={'flex-start'} direction={isMobile ? "column" : "row"} gap={3} height={'100%'}>
                    <Flex direction={'column'} gap={3} id='featured-video'>
                        <LavaTypo variant={'h2'}>Dernier clip</LavaTypo>
                        <Box sx={styles.videoContainer}>
                            <iframe id="ytplayer" type="text/html" width={isMobile ? "100%" : "996"} height={isMobile ? "200" : "600"}
                                src="https://www.youtube.com/embed/Rbszi6x8mXE?autoplay=1&controls=1"
                                name='youtube-embed' loading='lazy'
                            ></iframe>
                        </Box>
                    </Flex>

                    <Flex
                        direction={'column'}
                        maxHeight={maxHeight ?? '400px'}
                        gap={3}
                    >
                        <LavaTypo variant={'h3'}>Autres vidéos</LavaTypo>
                        <Box
                            className='video-list'
                            display={isMobile ? 'grid' : 'flex'}
                            direction={'column'}
                            flexDirection={isMobile ? 'unset' : 'column'}
                            gap={3}
                            overflowY={'auto'}
                            justifyContent={'space-between'}

                            rowGap={'24px'}
                            columnGap={'24px'}
                            gridTemplateRows={'93.00px minmax(0, 1fr)'}
                            gridTemplateColumns={'repeat(2, minmax(0, 1fr))'}
                        >
                            {videoList.map((video, index) => (
                                <iframe key={index} id="ytplayer" type="text/html" width={isMobile ? '165px' : '320px'} height={isMobile ? '93px' : '180px'}
                                    src={video.link}
                                    name='youtube-embed' loading='lazy'
                                ></iframe>
                            ))}
                        </Box>
                    </Flex>

                </Flex>
            </Flex>
        </Section>
    )
}
