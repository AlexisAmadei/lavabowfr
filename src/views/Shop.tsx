import CompactAppBar from '@/components/Core/AppBar/CompactAppBar'
import LavaTypo from '@/components/Design/LavaTypo'
import ShopItemCard from '@/components/Sections/Shop/ShopItemCard'
import { fetchMerchItems, MerchItem } from '@/utils/supabase/shop'
import { Container, Flex, Grid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function Shop() {
  const [items, setItems] = useState<MerchItem[]>([])

  useEffect(() => {
    async function loadItems() {
      const merchItems = await fetchMerchItems()
      setItems(merchItems)
    }
    loadItems()
  }, [])

  return (
    <Container
      backgroundColor={'var(--Background-bg-brand)'}
      minHeight={'100vh'}
      maxW={'100vw'}
      alignItems={'center'}
      justifyContent={'center'}
      paddingTop={'100px'}
      paddingBottom={8}
    >
      <CompactAppBar />
      <Flex
        direction={'column'}
        alignItems={'center'}
      >
        <LavaTypo variant='h1' textAlign='center'>Soutiens nous, en étant trop stylé</LavaTypo>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap={4} mt={10}>
          {/* Example merchandise items */}
          {items.map((item, index) => (
            <ShopItemCard key={index} item={item} isAdminView={false} />
          ))}
        </Grid>
      </Flex>
    </Container>
  )
}
