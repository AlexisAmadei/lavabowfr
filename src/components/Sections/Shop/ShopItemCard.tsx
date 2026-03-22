import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import { MerchItem } from '@/utils/supabase/shop';
import { Box, Flex } from '@chakra-ui/react'
import { Link } from 'react-router';

export default function ShopItemCard({ item, isAdminView }: { item: MerchItem, isAdminView: boolean }) {
  function formatTags(tag: string) {
    return `${tag.charAt(0).toUpperCase()}${tag.slice(1).replace(/_/g, ' ')}`;
  }

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
        position={'relative'}
      >
        <Box id="item-tags"
          position={'absolute'}
          top={'6px'}
          right={'6px'}
          display={'flex'}
          flexDirection={'column'}
          gap={2}
          width={'fit-content'}
        >
          {item.tags?.map((tag, index) => (
            <span key={index}
              style={{
                padding: '4px 6px',
                borderRadius: '100px',
                backgroundColor: 'var(--tertiary-accent)',
                color: 'white',
              }}
            >
              {formatTags(tag)}
            </span>
          ))}
        </Box>

        <Box
          position={'relative'}
        >
          {item.out_of_stock && (
            <LavaTypo
              variant='h4'
              color='white'
              style={{
                fontWeight: 'normal',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'var(--Background-bg-brand)',
                padding: '8px 8px',
                borderRadius: '4px',
                zIndex: 1
              }}
            >
              HORS STOCK
            </LavaTypo>
          )}
          <img
            src={item.image_url || 'https://placehold.co/300x300'}
            alt={item.name}
            style={{ width: '100%', height: '300px', objectFit: 'cover' }}
          />
        </Box>

        <Flex justifyContent={'space-between'} gap={4} textWrap={'balance'}>
          <LavaTypo variant='h3' color='var(--main-accent)' style={{ fontWeight: 'normal' }}>{item.name}</LavaTypo>
          <LavaTypo variant='h3' color='var(--main-accent)'>{item.price}€</LavaTypo>
        </Flex>

        <LavaTypo color='gray'>{item.description}</LavaTypo>
      </Flex>

      <LavaButton
        variant='filled'
        disabled={isAdminView || item.out_of_stock}
      >
        {item.out_of_stock ? (
          <span style={{ textDecoration: 'none', color: 'inherit' }}>
            Out of Stock
          </span>
        ) : (
          <Link
            target='_blank'
            to={item.stripe_paylink}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            Acheter
          </Link>
        )}
      </LavaButton>

    </Flex>
  )
}
