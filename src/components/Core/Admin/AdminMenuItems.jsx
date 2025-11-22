import AdminContent from "@/views/Admin/AdminContent";
import AdminMerchandise from "@/views/Admin/AdminMerchandise";
import AdminUsers from "@/views/Admin/AdminUsers";
import CloudStatus from "@/views/Admin/CloudStatus/CloudStatus";
import { Box, Flex, Text } from "@chakra-ui/react";
import { faCloud, faDatabase, faShoppingCart, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router";

export default function AdminMenuItems() {
  const menuItems = [
    {
      label: 'Contenus',
      icon: <FontAwesomeIcon icon={faDatabase} />,
      path: '/admin/dashboard',
      component: AdminContent
    },
    {
      label: 'CRM',
      icon: <FontAwesomeIcon icon={faUsers} />,
      path: '/admin/dashboard/users',
      component: AdminUsers
    },
    {
      label: 'Merchandising',
      icon: <FontAwesomeIcon icon={faShoppingCart} />,
      path: '/admin/dashboard/merchandise',
      component: AdminMerchandise
    },
    {
      label: 'Cloud Status',
      icon: <FontAwesomeIcon icon={faCloud} />,
      path: '/admin/dashboard/supabase-status',
      component: CloudStatus
    }
  ];

  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0]);

  return (
    <Flex
      width="100%"
      direction="column"
      gap={1}
    >
      {menuItems.map((item) => (
        <Link
          to={item.path}
          style={{ textDecoration: 'none' }}
        >
          <Box
            key={item.path}
            cursor="pointer"
            onClick={() => setSelectedMenuItem(item)}
            borderRadius={5}
            backgroundColor={selectedMenuItem.path === item.path ? 'whiteAlpha.900' : 'transparent'}
            color={selectedMenuItem.path === item.path ? 'black' : 'inherit'}
            p={2}
            display="flex"
            alignItems="center"
            transition="all 0.2s"
            _hover={{
              backgroundColor: selectedMenuItem.path === item.path ? 'whiteAlpha.900' : 'whiteAlpha.200'
            }}
          >
            <Box mr={2}>
              {item.icon}
            </Box>
            <Text fontSize="md">{item.label}</Text>
          </Box>
        </Link>
      ))}
    </Flex>
  )
}