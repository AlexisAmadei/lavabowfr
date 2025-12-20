import CompactAppBar from '@/components/Core/AppBar/CompactAppBar'
import LavaTypo from '@/components/Design/LavaTypo'
import ItemCard from '@/components/Sections/Shop/ItemCard'
import { Container, Flex, Grid } from '@chakra-ui/react'

const FAKE_ITEMS = [{
  name: 'T-Shirt Lavabow',
  price: 19.99,
  description: 'Un t-shirt confortable et stylé pour montrer votre soutien à Lavabow.',
}, {
  name: 'Casquette Lavabow',
  price: 14.99,
  description: 'Une casquette élégante pour compléter votre tenue Lavabow.',
}, {
  name: 'Hoodie Lavabow',
  price: 39.99,
  description: 'Un hoodie chaud et douillet pour les jours plus frais.',
}]

export default function Shop() {
  return (
    <Container
      backgroundColor={'var(--Background-bg-brand)'}
      minHeight={'100vh'}
      maxW={'100vw'}
      alignItems={'center'}
      justifyContent={'center'}
      paddingTop={'100px'}
    >
      <CompactAppBar />
      <Flex
        direction={'column'}
        alignItems={'center'}
      >
        <LavaTypo variant='h1' textAlign='center'>Soutiens nous, en étant trop stylé</LavaTypo>

        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr 1fr' }} gap={4} mt={10}>
          {/* Example merchandise items */}
          {FAKE_ITEMS.map((item, index) => (
            <ItemCard key={index} item={item} />
          ))}
        </Grid>
      </Flex>
    </Container>
  )
}
