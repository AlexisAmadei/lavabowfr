import MediaLinks from '@/components/Core/AppBar/MediaLinks'
import HeroTypo from '@/components/Design/HeroTypo'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import Logo from '@/components/Design/Logo'
import { AbsoluteCenter, Box, Dialog, Flex } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { Link } from 'react-router'

export default function Unsubscribe() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const button = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = button.left + button.width / 2;
    const buttonCenterY = button.top + button.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distanceX = mouseX - buttonCenterX;
    const distanceY = mouseY - buttonCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // If mouse is within 250px of the button, move it away
    if (distance < 250) {
      const angle = Math.atan2(distanceY, distanceX);
      const moveDistance = 250 - distance;

      setButtonPosition({
        x: -Math.cos(angle) * moveDistance,
        y: -Math.sin(angle) * moveDistance
      });
    } else {
      setButtonPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setButtonPosition({ x: 0, y: 0 });
  };

  return (
    <AbsoluteCenter
      flexDirection={'column'}
      gap={6}
      width={'100%'} height={'100%'}
      backgroundColor={'var(--Background-bg-brand)'}
      overflow={'hidden'}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Flex
        position={'absolute'} top={0}
        left={0}
        width={'100%'}
        height={'100%'}
        zIndex={-1}
        opacity={0.1}
        overflow={'hidden'}
        display={'flex'}
        flexDirection={'column'}
        direction={'column'}
        alignItems={'center'}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <HeroTypo key={index} repeated={true} />
        ))}
      </Flex>

      <Link to={'/'}>
        <Box transition="transform 1s ease" _hover={{ transform: 'rotate(1080deg)' }} transformOrigin="center" display="inline-block" cursor="pointer">
          <Logo h={'70'} w={'70'} />
        </Box>
      </Link>
      <MediaLinks />
      <LavaTypo variant={'h1'} styles={{ marginBottom: 0 }}>Nonnnn ne nous quittes pas stp</LavaTypo>
      <LavaTypo variant={'h4'} styles={{ marginBottom: "40px" }}>Bon ok on te laisse partir mais on se revoit en concert 🫶🏻</LavaTypo>
      <Box
        ref={buttonRef}
        transform={`translate(${buttonPosition.x}px, ${buttonPosition.y}px)`}
        transition="transform 0.1s ease-out"
      >
        <LavaButton color='secondary' size='large' onClick={() => setIsDialogOpen(true)}>Je me désinscris</LavaButton>
      </Box>

      <Dialog.Root open={isDialogOpen} onOpenChange={(e) => !e.open && setIsDialogOpen(false)} placement={'center'}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title>
                <LavaTypo variant={'h3'} styles={{color: 'var(--Background-bg-brand)'}}>Oops !</LavaTypo>
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <LavaTypo variant={'p'} styles={{ color: 'var(--Background-bg-brand)' }}>Il semble que le dev a oublié de terminer cette fonctionnalité</LavaTypo>
            </Dialog.Body>
            <Dialog.Footer />
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </AbsoluteCenter>
  )
}
