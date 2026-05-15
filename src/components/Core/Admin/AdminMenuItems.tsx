import AdminContent from "@/views/Admin/AdminContent";
import AdminMerchandise from "@/views/Admin/Content/AdminMerchandise";
import AdminSales from "@/views/Admin/Sales/AdminSales";
import AdminUsers from "@/views/Admin/AdminUsers/AdminUsers";
import CloudStatus from "@/views/Admin/CloudStatus/CloudStatus";
import { Box, Flex, Text } from "@chakra-ui/react";
import { faCloud, faCube, faDatabase, faReceipt, faShoppingCart, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router";
import useIsMobile from "@/hooks/useIsMobile";
import AdminGlobalVars from "@/views/Admin/Content/AdminGlobalVars";

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
      label: 'Sales',
      icon: <FontAwesomeIcon icon={faReceipt} />,
      path: '/admin/dashboard/sales',
      component: AdminSales
    },
    {
      label: 'Global Variables',
      icon: <FontAwesomeIcon icon={faCube} />,
      path: '/admin/dashboard/global-vars',
      component: AdminGlobalVars
    },
    {
      label: 'Cloud Status',
      icon: <FontAwesomeIcon icon={faCloud} />,
      path: '/admin/dashboard/supabase-status',
      component: CloudStatus
    }
  ];

  const isMobile = useIsMobile();
  const [selectedMenuItem, setSelectedMenuItem] = useState(menuItems[0]);

  return (
    <Flex
      width="100%"
      direction="column"
      gap={1}
    >
      {menuItems.map((item) => (
        <Link
          key={item.path}
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
            <Box mr={isMobile ? 0 : 2}>
              {item.icon}
            </Box>
            {!isMobile && (
              <Text fontSize="md">{item.label}</Text>
            )}
          </Box>
        </Link>
      ))}
    </Flex>
  )
}