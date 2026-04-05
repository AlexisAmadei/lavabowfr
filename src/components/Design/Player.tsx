import { Box, Flex, ProgressCircle, SkeletonText } from "@chakra-ui/react";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import LavaTypo from "./LavaTypo";
import { fetchDataFromTable } from "@/utils/supabase/supabase";

export default function Player({ isMobile } : { isMobile?: boolean } = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [title, setTitle] = useState<string | undefined>();
  const [playerData, setPlayerData] = useState<any[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const updateAudioProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Play failed:', error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTrackEnd = () => {
    if (playerData.length > 0) {
      // Move to next track
      const nextIndex = (currentTrackIndex + 1) % playerData.length;
      setCurrentTrackIndex(nextIndex);
      setTitle(playerData[nextIndex].title || 'Unknown Title');
      // Reset progress and auto-play the next track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const fetchPlayerTable = async () => {
      const data = await fetchDataFromTable('music_player');

      if (data && data.length > 0) {
        setPlayerData(data);

        // Pick a random track on load
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentTrackIndex(randomIndex);
        setTitle(data[randomIndex].title || 'Unknown Title');
      } else {
        console.error('Failed to fetch player data');
      }
    }
    fetchPlayerTable();

    const interval = setInterval(updateAudioProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update audio source and title when track index changes
    if (playerData.length > 0 && audioRef.current) {
      const currentTrack = playerData[currentTrackIndex];
      setTitle(currentTrack.title || 'Unknown Title');

      // Force audio source update
      const sourceElement = audioRef.current.querySelector('source');

      if (sourceElement) {
        sourceElement.src = currentTrack.audio_link;

        audioRef.current.oncanplay = () => {
          setIsPlaying(true);
        };

        audioRef.current.onerror = () => {
          console.error('Failed to load audio');
          setIsPlaying(false);
        };

        audioRef.current.load();
      }
    }
  }, [currentTrackIndex, playerData]);

  if(playerData.length === 0) {
    return null;
  }

  return (
    <Box
      height={'100%'}
      width={isMobile ? '100%' : 'auto'}
      display={'inline-flex'} alignItems={'center'} gap={2}
      justifyContent={isMobile ? 'space-between' : 'flex-start'}
      padding={'6px 6px'}
      borderRadius={50}
      backdropFilter={'brightness(50%)'}
    >

      <audio
        ref={audioRef}
        onEnded={handleTrackEnd}
        onTimeUpdate={updateAudioProgress}
      >
        {playerData.length > 0 && (
          <source
            id="lava-player"
            src={playerData[currentTrackIndex].audio_link}
            type="audio/mp3"
          />
        )}
      </audio>

      <Box
        animation={isPlaying ? 'spin' : 'none'}
        animationDuration='5s'
        animationIterationCount='infinite'
        animationTimingFunction='linear'
      >
        {playerData[currentTrackIndex]?.cover_link && (
          <img src={playerData[currentTrackIndex]?.cover_link} alt={playerData[currentTrackIndex]?.title || 'Unknown Title'} height={'40px'} width={'40px'} style={{ borderRadius: '50px'}} />
        )}
      </Box>

      {title ? (
        <Box
          width={isMobile ? 'auto' : '150px'}
          maxWidth={'200px'}
          whiteSpace={'nowrap'}
          overflow={'hidden'}
          css={{
            maskImage: 'linear-gradient(to right, black 0%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 0%, black 80%, transparent 100%)',
          }}
        >
          <LavaTypo variant="h4" size={'14px'} style={{ userSelect: 'none' }}>
            {title}
          </LavaTypo>
        </Box>
      ) : (
        <SkeletonText noOfLines={1} variant={'shine'} width={isMobile ? '50px' : '150px'} />
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
          <ProgressCircle.Circle css={{ "--thickness": "4px" }}>
            <ProgressCircle.Track />
            <ProgressCircle.Range strokeLinecap="round" stroke={'var(--Background-bg-brand)'} />
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