import { ElementType } from 'react'
import LavaButton from '@/components/Design/LavaButton'
import { Box, Flex } from '@chakra-ui/react'
import useMenuItems from '@/hooks/useMenuItems'
import { scrollToSection } from '@/utils/navigation'
import MediaLinks from './MediaLinks'
import useIsMobile from '@/hooks/useIsMobile'
import { useLocation, useNavigate } from 'react-router'
import { SubMenu } from './SubMenus'
import './AppBar.css'
import Logo from '@/components/Design/Logo'
import ContextMenu from '@/components/Design/ContextMenu'
import OnlineCounter from '../Hero/OnlineCounter'
import Player from '@/components/Design/Player'

export default function AppBar() {
  const isMobile = useIsMobile(1250);
  const navigate = useNavigate();
  const path = useLocation();
  const menuItems = useMenuItems();
  const normalizeRoute = (route: string) => route === '/' ? '/' : route.replace(/^\/+|\/+$/g, '');
  const currentRoute = normalizeRoute(path.pathname);

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
      justifyContent={'space-between'}
      alignItems={'center'}
      px={16}
    >
      {!isMobile && (
        <Box
          display={'inline-flex'}
          alignItems={'center'}
          gap={4}
        >
          <Flex alignItems={'center'} gap={3}>
            <ContextMenu>
              <Logo h={'70'} w={'70'} />
            </ContextMenu>
            <OnlineCounter />
          </Flex>
          <MediaLinks padding='8px' size='lg' />
          <Player />
        </Box>
      )}

      <Box
        display={'inline-flex'}
        alignItems={'center'}
        gap={4}
      >
        <Box display={'inline-flex'} gap={4} alignItems={'center'}>
          {menuItems.map(item => {
            const Icon = (('endIcon' in item && item.endIcon) ? item.endIcon : item.icon) as ElementType | undefined;
            if (!item.subItems && normalizeRoute(item.link) !== currentRoute) {
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
        </Box>
      </Box>
    </Flex>
  )
}