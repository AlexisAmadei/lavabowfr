import LavaTypo from '@/components/Design/LavaTypo'
import Logo from '@/components/Design/Logo'
import { Flex, Menu } from '@chakra-ui/react'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const contextMenuItems = [
  { name: 'Télécharger notre logo en .svg' },
  { name: 'Télécharger notre logo en .png' },
  { name: 'Télécharger notre press kit' },
]

export default function ContextMenu() {
  return (
    <Menu.Root>
      <Menu.ContextTrigger>
        <Logo h={'76'} w={'76'} />
      </Menu.ContextTrigger>

      <Menu.Positioner backgroundColor={'transparent'}>
        <Menu.Content
          backgroundColor={'#171717ff'}
          color={'white'}
          borderRadius={'16px'}
          padding={3}
        >
          <Flex
            direction='column'
            gap={1}
          >
            <LavaTypo variant='accent' size={12} style={{ marginLeft: '8px ' }}>LAVA BOW Design System</LavaTypo>
            {contextMenuItems.map((item, index) => (
              <Flex key={index}
                borderRadius={'10px'}
                padding={2}
                gap={4}
                justifyContent={'space-between'}
                _hover={{ backgroundColor: '#ffffff27', cursor: 'pointer' }}
              >
                <LavaTypo variant='p' size={14}>{item.name}</LavaTypo>
                <FontAwesomeIcon icon={faDownload} />
              </Flex>
            ))}
          </Flex>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
