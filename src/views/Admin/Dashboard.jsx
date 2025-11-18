import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import React from 'react'
import { ADMIN_MENU_ITEMS } from '@/constants/menuItems'
import { Link, Outlet, useLocation } from 'react-router';
import { BsHouseFill } from 'react-icons/bs';

export default function Dashboard() {
  const location = useLocation();

  return (
    <Grid
      templateColumns="repeat(8, 1fr)"
      minH="100vh"
      gap={0}
      backgroundColor={'var(--tertiary-accent)'}
    >
      <GridItem
        colSpan={1}
        h="100vh"
        p={4}
        borderRight="1px solid"
        borderColor="whiteAlpha.400"
      >
        <Flex
          className="sidenav"
          h="100%"
          direction="column"
          alignItems="flex-start"
        >
          <Text fontSize="xl" fontWeight="bold" mb={8}>
            Lava Admin
          </Text>
          <Flex
            width="100%"
            direction="column"
            gap={1}
          >
            {ADMIN_MENU_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  cursor="pointer"
                  borderRadius={5}
                  backgroundColor={location.pathname === item.path ? 'whiteAlpha.900' : 'transparent'}
                  color={location.pathname === item.path ? 'black' : 'inherit'}
                  p={2}
                  display="flex"
                  alignItems="center"
                  transition="all 0.2s"
                  _hover={{
                    backgroundColor: location.pathname === item.path ? 'whiteAlpha.900' : 'whiteAlpha.200'
                  }}
                >
                  <item.icon size={16} style={{ marginRight: 8 }} />
                  <Text fontSize="md">{item.label}</Text>
                </Box>
              </Link>
            ))}
          </Flex>

          <Link to="/" style={{ marginTop: 'auto', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BsHouseFill /> Retour au site
          </Link>
        </Flex>
      </GridItem>

      <GridItem
        colSpan={7}
        h="100vh"
        p={4}
      >
        <Flex
          className="main-content"
          backgroundColor="white"
          h="100%"
          borderRadius={5}
          px={4}
          pr={0}
          direction="column"
        >
          <Flex
            direction="column"
            flex={1}
            overflowY="auto"
          >
            <Outlet />
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  )
}
