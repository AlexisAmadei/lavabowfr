import LavaButton from "@/components/Design/LavaButton";
import { MenuItem } from "@/lib/menuItems";
import { Menu, Portal } from "@chakra-ui/react";
import { faBars, faBarsStaggered } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

interface SubMenuProps {
  item: MenuItem
  parentName: string
  subItems: MenuItem[]
  handleNav: (link: string) => void,
}

export const SubMenu = ({ item, parentName, subItems, handleNav }: SubMenuProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };
  return (
    <Menu.Root
      closeOnSelect={true}
      open={open}
    >
      <Menu.Trigger asChild>
        <LavaButton
          key={item.name}
          variant={item.variant as 'filled' | 'outlined' | 'text'}
          className="app-bar__button"
          onMouseEnter={() => handleMouseEnter()}
          onMouseLeave={() => handleMouseLeave()}
          style={{ backgroundColor: 'white', color: 'black' }}
        >
          {parentName}
          <FontAwesomeIcon icon={open ? faBarsStaggered : faBars} />
        </LavaButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            padding={2}
            borderRadius={'16px'}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
          >
            {subItems.map((subItem) => (
              <Menu.Item
                key={subItem.name}
                value={subItem.name}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(subItem.link);
                  setOpen(false);
                }}
                borderRadius={'8px'}
                cursor={'pointer'}
                color={'#ED00E1'}
                fontSize={'18px'}
                _hover={{
                  backgroundColor: '#ED00E1',
                  color: 'white'
                }}
              >
                {subItem.name}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
