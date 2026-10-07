'use client';

import { useState, type ReactNode } from 'react';
import { Flex, Grid, GridItem, IconButton, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faAnglesRight, faHouse } from '@fortawesome/free-solid-svg-icons';
import AdminMenuItems from '@/components/Core/Admin/AdminMenuItems';
import { Tooltip } from '@/components/ui/tooltip';
import useIsMobile from '@/hooks/useIsMobile';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [userCollapsed, setUserCollapsed] = useState(false);
  const collapsed = isMobile || userCollapsed;

  return (
    <Grid
      templateColumns={collapsed ? '72px 1fr' : '1fr 7fr'}
      minH="100vh"
      gap={0}
      backgroundColor={'var(--tertiary-accent)'}
    >
      <GridItem
        h="100vh"
        p={4}
        minW={0}
        transition="all 0.2s"
        borderRight="1px solid"
        borderColor="whiteAlpha.400"
      >
        <Flex
          className="sidenav"
          h="100%"
          direction="column"
          alignItems={collapsed ? 'center' : 'flex-start'}
        >
          <Flex
            w="100%"
            alignItems="center"
            justifyContent={collapsed ? 'center' : 'space-between'}
            mb={8}
            minH={8}
          >
            {!collapsed && (
              <Text fontSize="xl" fontWeight="bold" whiteSpace="nowrap">
                Lava Admin
              </Text>
            )}
            {!isMobile && (
              <IconButton
                aria-label={collapsed ? 'Déplier le menu' : 'Replier le menu'}
                size="xs"
                variant="ghost"
                color="inherit"
                _hover={{ backgroundColor: 'whiteAlpha.200' }}
                onClick={() => setUserCollapsed((c) => !c)}
              >
                <FontAwesomeIcon icon={collapsed ? faAnglesRight : faAnglesLeft} />
              </IconButton>
            )}
          </Flex>
          <AdminMenuItems collapsed={collapsed} />

          <Tooltip
            content="Retour au site"
            positioning={{ placement: 'right' }}
            disabled={!collapsed}
          >
          <Link
            href="/"
            style={{
              marginTop: 'auto',
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FontAwesomeIcon icon={faHouse} />
            {!collapsed && <span>Retour au site</span>}
          </Link>
          </Tooltip>
        </Flex>
      </GridItem>

      <GridItem h="100vh" p={4} minW={0}>
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
          {children}
        </Flex>
      </GridItem>
    </Grid>
  );
}
