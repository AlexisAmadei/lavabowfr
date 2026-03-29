import AppBar from '@/components/Core/AppBar/AppBar'
import LavaTypo from '@/components/Design/LavaTypo'
import Contact from '@/components/Sections/Contact'
import Footer from '@/components/Sections/Footer'
import ShopItemCard from '@/components/Sections/Shop/ShopItemCard'
import { fetchMerchItems, MerchItem } from '@/utils/supabase/shop'
import { Box, Container, Flex, Grid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function Shop() {
  const [items, setItems] = useState<MerchItem[]>([])

  useEffect(() => {
    async function loadItems() {
      const merchItems = await fetchMerchItems(true);
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
      p={0}
      paddingTop={100}
    >
      {/* <CompactAppBar /> */}
      <AppBar />
      <Flex
        direction={'column'}
        alignItems={'center'}
      >
        <LavaTypo variant='h1' textAlign='center'>Soutiens nous, en étant trop stylé</LavaTypo>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap={4} mt={10} px={16}>
          {items.length > 0 ? (
            items.map((item, index) => (
              <ShopItemCard key={index} item={item} isAdminView={false} />
            ))
          ) : (
            <Box gridColumn={'1 / -1'} textAlign='center' py={10}>
              <LavaTypo variant='h2' textAlign='center'>Aucun article disponible pour le moment. Restez à l&apos;écoute !</LavaTypo>
            </Box>
          )}
        </Grid>
      </Flex>
      <Contact />
      <Footer />
    </Container>
  )
}
