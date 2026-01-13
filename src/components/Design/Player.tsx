import { Box, Flex, ProgressCircle, SkeletonText } from "@chakra-ui/react";
import { faCompactDisc, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Box height={'100%'} display={'inline-flex'} alignItems={'center'}
      gap={2}
      backgroundColor={'var(--Background-bg-brand)'}
      padding={'6px 6px'}
      borderRadius={50}
    >

      <Box
        animation={isPlaying ? 'spin' : 'none'}
        animationDuration='1s'
        animationIterationCount='infinite'
        animationTimingFunction='linear'
      >
        <FontAwesomeIcon icon={faCompactDisc} size='2xl' />
      </Box>

      <SkeletonText noOfLines={1} variant={'shine'} width={'150px'} />

      <Flex
        alignItems={'center'}
        position={'relative'}
        width='40px'
        height='40px'
        onClick={() => setIsPlaying(!isPlaying)}
        cursor='pointer'
      >
        <ProgressCircle.Root value={30}>
          <ProgressCircle.Circle css={{ "--thickness": "5px" }}>
            <ProgressCircle.Track />
            <ProgressCircle.Range strokeLinecap="round" stroke={'var(--main-accent)'} />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <Box
          position='absolute'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} style={{ padding: 0, margin: 0 }} />
        </Box>
      </Flex>
    </Box>
  );
}