import { MenuItem } from "@/lib/menuItems";
import { Menu, Portal } from "@chakra-ui/react";

interface SubMenuProps {
  parentName: string
  subItems: MenuItem[]
  handleNav: (link: string) => void,
  open?: boolean
}

export const SubMenu = ({ parentName, subItems, handleNav, open }: SubMenuProps) => {
  return (
    <Menu.Root
      closeOnSelect={true}
      open={open}
      onOpenChange={() => {}}
    >
      <Menu.Trigger asChild>
        <span style={{ cursor: 'pointer' }}>
          {parentName}
        </span>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
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
