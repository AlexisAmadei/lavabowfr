import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import { Flex } from '@chakra-ui/react'
import React from 'react'

interface ItemCardProps {
  item: {
    name: string;
    price: number;
    description: string;
  };
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Flex
      direction={'column'}
      padding={3}
      height={'550px'}
      width={'300px'}
      backgroundColor={'white'}
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
      >
        Ajouter au panier
      </LavaButton>
    </Flex>
  )
}
