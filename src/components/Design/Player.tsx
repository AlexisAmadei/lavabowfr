import { Box, Flex, ProgressCircle, SkeletonText } from "@chakra-ui/react";
import { faCompactDisc, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import LavaTypo from "./LavaTypo";
import { fetchDataFromTable } from "@/utils/supabase/supabase";

export default function Player() {
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
    const interval = setInterval(updateAudioProgress, 500);
    return () => clearInterval(interval);
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
        audioRef.current.load();
      }
    }
  }, [currentTrackIndex, playerData]);

  return (
    <Box height={'100%'} display={'inline-flex'} alignItems={'center'}
      gap={2}
      // backgroundColor={'var(--Background-bg-brand)'}
      padding={'6px 6px'}
      borderRadius={50}
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
        animationDuration='1s'
        animationIterationCount='infinite'
        animationTimingFunction='linear'
      >
        <FontAwesomeIcon icon={faCompactDisc} size='2xl' color="var(--Background-bg-brand)" />
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
          <LavaTypo variant="h4" size={'14px'} style={{ userSelect: 'none' }}>
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
      <img src={playerData[currentTrackIndex]?.cover_link || "https://placehold.co/40x40/png"} alt="LavaBow Logo" style={{ borderRadius: '4px', height: '40px', width: '40px' }} />
    </Box>
  );
}