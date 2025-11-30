import './styles/Section.css'
import { Flex } from '@chakra-ui/react'
import LavaTypo from './LavaTypo'
import useIsMobile from '@/hooks/useIsMobile'

export default function Section({ children, bgImage, bgColor, id, contained, title, position = 'unset'}: {
  children: React.ReactNode;
  bgImage?: string;
  bgColor?: string;
  id?: string;
  contained?: boolean;
  title?: string;
  position?: React.CSSProperties['position'];
}) {
  const isMobile = useIsMobile();
  return (
    <div className='lava-section' id={id}
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundColor: bgColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maxWidth: contained ? '1700px' : '100%',
        width: '100%',
        position: position,
      }}
    >
      {title && (
        <Flex gap={3} direction={'column'} alignItems={'center'} marginBottom={isMobile ? '8px' : '24px'}>
          <LavaTypo variant={'h1'} textAlign='center'>{title}</LavaTypo>
        </Flex>
      )}
      {children}
    </div>
  )
}
