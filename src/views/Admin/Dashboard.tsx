import { Box, Flex, Grid, GridItem, Text } from '@chakra-ui/react'
import React from 'react'
import { Link, useLocation, Outlet } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import AdminMenuItems from '@/components/Core/Admin/AdminMenuItems';

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
          <AdminMenuItems />

          <Link to="/" style={{ marginTop: 'auto', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FontAwesomeIcon icon={faHouse} />
            Retour au site
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
          overflow={'auto'}
          pb={8}
        >
          <Outlet />
        </Flex>
      </GridItem>
    </Grid>
  )
}
