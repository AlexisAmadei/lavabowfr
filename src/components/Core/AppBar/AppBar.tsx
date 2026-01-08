import { ElementType } from 'react'
import LavaButton from '@/components/Design/LavaButton'
import { Flex } from '@chakra-ui/react'
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

  const handleNav = (link: string) => {
    if (link.startsWith('#')) {
      scrollToSection(link)
    } else {
      navigate(link)
    }
  }

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
        const Icon = (('endIcon' in item && item.endIcon) ? item.endIcon : item.icon) as ElementType | undefined;
        if (!item.subItems) {
          return (
            <LavaButton
              key={item.name}
              variant={item.variant as 'filled' | 'outlined' | 'text'}
              className="app-bar__button"
            >
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.link);
                }}
              >
                {item.name}
              </a>
              {Icon && (
                <span className='app-bar__icon-on-hover' style={{ transition: 'all 0.3 ease' }}>
                  <Icon />
                </span>
              )}
            </LavaButton>
          )
        } else if (item.subItems) {
          return (
            <SubMenu key={item.name}
              item={item}
              parentName={item.name}
              subItems={item.subItems}
              handleNav={handleNav}
            />
          );
        }
      })}
    </Flex>
  )
}