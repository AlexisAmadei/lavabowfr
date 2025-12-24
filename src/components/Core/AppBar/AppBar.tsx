import LavaButton from '@/components/Design/LavaButton'
import { Flex } from '@chakra-ui/react'
import { ElementType, useState, useRef } from 'react'
import menuItems from '@/lib/menuItems'
import { scrollToSection } from '@/utils/navigation'
import MediaLinks from './MediaLinks'
import useIsMobile from '@/hooks/useIsMobile'
import { useNavigate } from 'react-router'
import { SubMenu } from './SubMenus'
import './AppBar.css'

export default function AppBar() {
  const isMobile = useIsMobile(1250);
  const navigate = useNavigate();
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNav = (link: string) => {
    if (link.startsWith('#')) {
      scrollToSection(link)
    } else {
      navigate(link)
    }
  }

  const handleMouseEnter = (itemName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenMenuKey(itemName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenuKey(null);
    }, 150);
  };

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
        <MediaLinks padding='4px' size='lg' />
      )}
      {menuItems.map(item => {
        const Icon = (('endIcon' in item && item.endIcon) ? item.endIcon : item.icon) as ElementType | undefined
        return (
          <LavaButton
            key={item.name}
            variant={item.variant as 'filled' | 'outlined' | 'text'}
            className="app-bar__button"
            onMouseEnter={() => item.subItems && handleMouseEnter(item.name)}
            onMouseLeave={() => item.subItems && handleMouseLeave()}
          >
            {!item.subItems && (
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.link);
                }}
              >
                {item.name}
              </a>
            )}
            {item.subItems && (
              <SubMenu
                parentName={item.name}
                subItems={item.subItems}
                handleNav={handleNav}
                open={openMenuKey === item.name}
              />
            )}
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