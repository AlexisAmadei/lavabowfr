import { Box, Flex, ProgressCircle, SkeletonText } from "@chakra-ui/react";
import { faCompactDisc, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import LavaTypo from "./LavaTypo";

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [title, setTitle] = useState<string | undefined>();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  function formatFileName(fileName: string) {
    // return fileName.replace(/_/g, ' ').replace('.mp3', '');
    return fileName;
  }

  const updateAudioProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  useEffect(() => {
    const interval = setInterval(updateAudioProgress, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    const sourceElement = audioRef.current.querySelector('source');
    if (sourceElement) {
      const src = sourceElement.getAttribute('src') || '';
      setTitle(formatFileName(src.split('/').pop() || 'Unknown Title'));
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error('Play failed:', error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <Box height={'100%'} display={'inline-flex'} alignItems={'center'}
      gap={2}
      backgroundColor={'var(--Background-bg-brand)'}
      padding={'6px 6px'}
      borderRadius={50}
    >

      <audio ref={audioRef} loop>
        <source id="lava-player" src="https://ygwmuznptpmxwjwwiite.supabase.co/storage/v1/object/public/lavabowfr/player/Horse_Pink_Poney.mp3" type="audio/mpeg" />
      </audio>

      <Box
        animation={isPlaying ? 'spin' : 'none'}
        animationDuration='1s'
        animationIterationCount='infinite'
        animationTimingFunction='linear'
      >
        <FontAwesomeIcon icon={faCompactDisc} size='2xl' />
      </Box>

      {title ? (
        <Box
          maxWidth={'150px'}
          overflow={'hidden'}
          whiteSpace={'nowrap'}
          css={{
            maskImage: 'linear-gradient(to right, black 0%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 80%, transparent 100%)',
          }}
        >
          <LavaTypo variant="h4" size={'14px'} style={{ }}>
            {title}
          </LavaTypo>
        </Box>
      ) : (
        <SkeletonText noOfLines={1} variant={'shine'} width={'150px'} />
      )}

      <Flex
        alignItems={'center'}
        position={'relative'}
        width='40px'
        height='40px'
        onClick={() => setIsPlaying(!isPlaying)}
        cursor='pointer'
      >
        <ProgressCircle.Root value={audioProgress}>
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