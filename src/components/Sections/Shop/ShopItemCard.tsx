import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import useIsMobile from '@/hooks/useIsMobile';
import { op } from '@/lib/openpanel';
import { MerchItem } from '@/utils/supabase/shop';
import { addItem } from '@/utils/cart';
import { Box, Flex } from '@chakra-ui/react'
import { useTranslation } from '@/i18n/useTranslation';
import { toaster } from '@/components/ui/toaster';

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function ShopItemCard({ item, isAdminView }: { item: MerchItem, isAdminView: boolean }) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const priceCents = typeof item.price_cents === 'number'
    ? item.price_cents
    : Math.round(Number(item.price) * 100);
  const formattedPrice = priceFormatter.format(priceCents / 100);

  const isOutOfStock = item.stock === 0 || item.out_of_stock;
  const canAdd = !isAdminView && !isOutOfStock && item.id !== undefined;

  function formatTags(tag: string) {
    return `${tag.charAt(0).toUpperCase()}${tag.slice(1).replace(/_/g, ' ')}`;
  }

  const handleAddToCart = () => {
    if (!canAdd || item.id === undefined) return;
    const added = addItem(String(item.id), item.stock ?? null);
    if (added) {
      toaster.create({
        title: t.cart.addedToast,
        description: t.cart.addedToastDescription(item.name),
        type: 'success',
      });
      op.track('shop_add_to_cart', { itemName: item.name, itemId: item.id });
    } else {
      toaster.create({
        title: t.cart.stockReachedToast,
        description: t.cart.stockReachedToastDescription,
        type: 'info',
      });
    }
  };

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
          {isOutOfStock && (
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
          <LavaTypo variant='h3' color='var(--main-accent)'>{formattedPrice}</LavaTypo>
        </Flex>

        <LavaTypo color='gray' style={{ textAlign: 'left' }}>{item.description}</LavaTypo>
      </Flex>

      <LavaButton
        variant='filled'
        disabled={!canAdd}
        onClick={handleAddToCart}
      >
        {isOutOfStock ? t.shop.outOfStockBuy : t.shop.addToCart}
      </LavaButton>

    </Flex>
  )
}
