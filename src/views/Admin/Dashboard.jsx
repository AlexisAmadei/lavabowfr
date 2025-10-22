import { Box, Container, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { ADMIN_MENU_ITEMS } from '@/constants/menuItems'

export default function Dashboard() {
  const [selectedMenuItem, setSelectedMenuItem] = React.useState(ADMIN_MENU_ITEMS[0]);
  return (
    <Container
      display={'flex'}
      flexDirection={'row'}
      height={'100vh'}
      width={'100%'}
      gap={4}
      p={1}
      mr={0}
    >
      <Flex className="sidenav"
        width={'10%'}
        display={'flex'}
        justifyContent={'flex-start'}
        alignItems={'center'}
        direction={'column'}
      >
        <Text fontSize={'1xl'} fontWeight={'bold'} my={8}>
          Lava Admin
        </Text>
        <Flex
          textAlign={"left"}
          width={'100%'}
          direction={'column'}
          gap={1}
        >
          {ADMIN_MENU_ITEMS.map((item) => (
            <Box key={item.path}
              marginTop={4}
              cursor={'pointer'}
              onClick={() => setSelectedMenuItem(item)}
              borderRadius={5}
              backgroundColor={selectedMenuItem.path === item.path ? 'whiteAlpha.900' : 'transparent'}
              color={selectedMenuItem.path === item.path ? 'black' : ''}
              padding={1}
              display={'flex'}
              alignItems={'center'}
            >
              <item.icon size={16} style={{ marginRight: 8 }} />
              <Text fontSize={'md'}>{item.label}</Text>
            </Box>
          ))}
        </Flex>
      </Flex>
      <Flex className="main-content"
        backgroundColor={'whitesmoke'}
        width={'100%'}
        borderRadius={5}
        m={2}
        p={2}
      >
        <Text fontSize={'2xl'} padding={4} color={'black'} ml={4}>
          {selectedMenuItem.label}
        </Text>
        <Flex
          direction={'column'}
        >
          {/* Main dashboard content goes here */}
        </Flex>
      </Flex>
    </Container>
  )
}
