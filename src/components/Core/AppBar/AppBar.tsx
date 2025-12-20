import LavaButton from '@/components/Design/LavaButton'
import { Flex } from '@chakra-ui/react'
import { ElementType } from 'react'
import './AppBar.css'
import menuItems from '@/lib/menuItems'
import { scrollToSection } from '@/utils/navigation'
import MediaLinks from './MediaLinks'
import useIsMobile from '@/hooks/useIsMobile'

export default function AppBar() {
  const isMobile = useIsMobile(1250);
  return (
    <Flex className='app-bar'
      as={'nav'}
      direction={'row'}
      mt={6}
      position={'fixed'}
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      justifyContent={'center'}
      gap={4}
    >
      {!isMobile && (
        <MediaLinks />
      )}
      {menuItems.map(item => {
        const Icon = (('endIcon' in item && item.endIcon) ? item.endIcon : item.icon) as ElementType | undefined
        return (
          <LavaButton
            key={item.name}
            variant={item.variant as 'filled' | 'outlined' | 'text'}
            className="app-bar__button"
          >
            <a
              href={item.link}
              onClick={(e) => {
                e.preventDefault()
                scrollToSection(item.link)
              }}
            >
              {item.name}
            </a>
            {Icon && (
              <span className="app-bar__icon-on-hover">
                <Icon strokeWidth={1} size={30} />
              </span>
            )}
          </LavaButton>
        )
      })}
    </Flex>
  )
}