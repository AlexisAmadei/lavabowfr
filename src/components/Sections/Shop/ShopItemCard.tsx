import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import { MerchItem } from '@/utils/supabase/shop';
import { Flex } from '@chakra-ui/react'

export default function ShopItemCard({ item, isAdminView }: { item: MerchItem, isAdminView: boolean }) {
  return (
    <Flex
      direction={'column'}
      padding={3}
      height={'550px'}
      width={'300px'}
      backgroundColor={!isAdminView ? 'white' : 'gray.50'}
      justifyContent={'space-between'}
    >
      <Flex id='item-details' color={'black'}
        direction={'column'}
        gap={2}
        textAlign={'left'}
      >
        <img src='https://placehold.co/300x300' alt='Merchandise Item' />
        <Flex justifyContent={'space-between'}>
          <LavaTypo variant='h3' color='var(--main-accent)' style={{ fontWeight: 'normal' }}>{item.name}</LavaTypo>
          <LavaTypo variant='h3' color='var(--main-accent)'>{item.price}€</LavaTypo>
        </Flex>
        <LavaTypo color='gray'>{item.description}</LavaTypo>
      </Flex>
      <LavaButton
        variant='filled'
        disabled={isAdminView}
      >
        Ajouter au panier
      </LavaButton>
    </Flex>
  )
}
