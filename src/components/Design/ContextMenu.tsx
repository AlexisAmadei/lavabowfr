import { Flex, Menu } from '@chakra-ui/react'
import LavaTypo from './LavaTypo'
import Logo from './Logo'
import Divider from './Divider'

const lavaIdentity = [
  { name: 'Télécharger notre logo en .svg', asset_link: 'https://ygwmuznptpmxwjwwiite.supabase.co/storage/v1/object/public/lavabowfr/brand_assets/lavabow_logo.svg' },
  { name: 'Télécharger notre logo en .png', asset_link: 'https://ygwmuznptpmxwjwwiite.supabase.co/storage/v1/object/public/lavabowfr/brand_assets/lavabow_logo.png' },
]

export default function ContextMenu({ children }: { children?: React.ReactNode }) {

  const handleDownload = async (item: { name: string, asset_link: string }) => {
    try {
      const filename = item.asset_link.split('/').pop() || 'download';

      // For cross-origin URLs, fetch and create blob
      const response = await fetch(item.asset_link);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: open in new tab if download fails
      window.open(item.asset_link, '_blank');
    }
  }

  return (
    <Menu.Root>
      <Menu.ContextTrigger>
        {children}
      </Menu.ContextTrigger>

      <Menu.Positioner backgroundColor={'transparent'} p={0} m={0}>
        <Menu.Content
          backgroundColor={'#171717ff'}
          color={'white'}
          borderRadius={'16px'}
          p={0}
        >
          <Flex
            direction='column'
            gap={1}
            padding={3}
          >
            <LavaTypo variant='accent' size={12} style={{ marginLeft: '8px ' }}>LAVA identity</LavaTypo>
            {lavaIdentity.map((item, index) => (
              <Flex
                key={index}
                padding={2}
                gap={4}
                justifyContent={'flex-start'}
                _hover={{ backgroundColor: '#ffffff27', cursor: 'pointer' }}
                borderRadius={6}
                onClick={async () => { await handleDownload(item) }}
              >
                <Logo h='15' w='15' />
                <LavaTypo variant='p' size={14} color='white'>{item.name}</LavaTypo>
              </Flex>
            ))}
          </Flex>

          <Divider orientation='horizontal' color='white' />
          <Flex
            direction='column'
            gap={1}
            padding={3}
          >
            <LavaTypo variant='accent' size={12} style={{ marginLeft: '8px ' }}>LAVA Brand</LavaTypo>
            <Flex
              padding={2}
              gap={4}
              justifyContent={'flex-start'}
              borderRadius={6}
              _hover={{ backgroundColor: '#ffffff27', cursor: 'pointer' }}
              onClick={async() => { await handleDownload({ name: 'Télécharger notre Press Kit', asset_link: "https://ygwmuznptpmxwjwwiite.supabase.co/storage/v1/object/public/lavabowfr/brand_assets/lavabow_presskit.pdf"})}}
            >
              <Logo h='15' w='15' />
              <LavaTypo variant='p' size={14}>Télécharger notre Press Kit</LavaTypo>
            </Flex>
          </Flex>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
