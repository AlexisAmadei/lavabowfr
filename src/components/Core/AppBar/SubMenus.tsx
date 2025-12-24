import { MenuItem } from "@/lib/menuItems";
import { Menu, Portal } from "@chakra-ui/react";
import { useRef, useState } from "react";

interface SubMenuProps {
  parentName: string
  subItems: MenuItem[]
  handleNav: (link: string) => void
}

export const SubMenu = ({ parentName, subItems, handleNav }: SubMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <Menu.Root
      closeOnSelect={true}
      open={isOpen}
      onOpenChange={(e) => setIsOpen(e.open)}
    >
      <Menu.Trigger asChild>
        <span
          style={{ cursor: 'pointer' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {parentName}
        </span>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {subItems.map((subItem) => (
              <Menu.Item
                key={subItem.name}
                value={subItem.name}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(subItem.link);
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
