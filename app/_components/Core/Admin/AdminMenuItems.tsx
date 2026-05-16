'use client';

import { Box, Flex, Text } from "@chakra-ui/react";
import { faCloud, faCube, faDatabase, faReceipt, faShoppingCart, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useIsMobile from "@/hooks/useIsMobile";

const menuItems = [
  {
    label: 'Contenus',
    icon: <FontAwesomeIcon icon={faDatabase} />,
    path: '/admin/dashboard',
  },
  {
    label: 'CRM',
    icon: <FontAwesomeIcon icon={faUsers} />,
    path: '/admin/dashboard/users',
  },
  {
    label: 'Merchandising',
    icon: <FontAwesomeIcon icon={faShoppingCart} />,
    path: '/admin/dashboard/merchandise',
  },
  {
    label: 'Sales',
    icon: <FontAwesomeIcon icon={faReceipt} />,
    path: '/admin/dashboard/sales',
  },
  {
    label: 'Global Variables',
    icon: <FontAwesomeIcon icon={faCube} />,
    path: '/admin/dashboard/global-vars',
  },
  {
    label: 'Cloud Status',
    icon: <FontAwesomeIcon icon={faCloud} />,
    path: '/admin/dashboard/supabase-status',
  }
];

export default function AdminMenuItems() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  return (
    <Flex
      width="100%"
      direction="column"
      gap={1}
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            style={{ textDecoration: 'none' }}
          >
            <Box
              cursor="pointer"
              borderRadius={5}
              backgroundColor={isActive ? 'whiteAlpha.900' : 'transparent'}
              color={isActive ? 'black' : 'inherit'}
              p={2}
              display="flex"
              alignItems="center"
              transition="all 0.2s"
              _hover={{
                backgroundColor: isActive ? 'whiteAlpha.900' : 'whiteAlpha.200'
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
        );
      })}
    </Flex>
  )
}
