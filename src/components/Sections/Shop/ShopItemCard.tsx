import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import useIsMobile from '@/hooks/useIsMobile';
import { op } from '@/lib/openpanel';
import { MerchItem } from '@/utils/supabase/shop';
import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from '@/i18n/useTranslation';

export default function ShopItemCard({ item, isAdminView }: { item: MerchItem, isAdminView: boolean }) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  function formatTags(tag: string) {
    return `${tag.charAt(0).toUpperCase()}${tag.slice(1).replace(/_/g, ' ')}`;
  }

  return (
    <Flex
      direction={'column'}
      padding={3}
      height={isMobile ? '' : '550px'}
      width={'300px'}
      backgroundColor={!isAdminView ? 'white' : 'gray.50'}
      justifyContent={'space-between'}
    >
      <Flex id='item-details' color={'black'}
        direction={'column'}
        gap={2}
        textAlign={'left'}
        position={'relative'}
        mb={2}
      >
        <Box id="item-tags"
          position={'absolute'}
          top={'6px'}
          right={'6px'}
          display={'flex'}
          flexDirection={'column'}
          gap={2}
          width={'fit-content'}
          zIndex={9999}
        >
          {item.tags?.map((tag, index) => (
            <span key={index}
              style={{
                padding: '4px 8px',
                borderRadius: '100px',
                backgroundColor: 'var(--tertiary-accent)',
                color: 'white',
                textAlign: 'center',
                fontSize: '12px'
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
              {t.shop.outOfStock}
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

        <LavaTypo color='gray' style={{ textAlign: 'left'}}>{item.description}</LavaTypo>
      </Flex>

      <LavaButton
        variant='filled'
        disabled={isAdminView || item.out_of_stock}
      >
        {item.out_of_stock ? (
          <span style={{ textDecoration: 'none', color: 'inherit' }}>
            {t.shop.outOfStockBuy}
          </span>
        ) : (
          <a
            target='_blank'
            rel='noopener noreferrer'
            href={item.stripe_paylink}
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => op.track(`shop_item`, { itemName: item.name })}
          >
            {t.shop.buy}
          </a>
        )}
      </LavaButton>

    </Flex>
  )
}
