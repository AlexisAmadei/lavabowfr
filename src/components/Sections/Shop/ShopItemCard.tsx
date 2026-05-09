import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import useIsMobile from '@/hooks/useIsMobile';
import { op } from '@/lib/openpanel';
import { MerchItem, SIZE_VALUES, SizeValue } from '@/utils/supabase/shop';
import { addItem } from '@/utils/cart';
import { Box, createListCollection, Flex, Portal, Select } from '@chakra-ui/react'
import { useMemo, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { toaster } from '@/components/ui/toaster';

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

interface SizeOption {
  size: SizeValue;
  stock: number | null;
  outOfStock: boolean;
}

export default function ShopItemCard({ item, isAdminView }: { item: MerchItem, isAdminView: boolean }) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [selectedSize, setSelectedSize] = useState<SizeValue | null>(null);

  const priceCents = typeof item.price_cents === 'number'
    ? item.price_cents
    : Math.round(Number(item.price) * 100);
  const formattedPrice = priceFormatter.format(priceCents / 100);

  const hasSizes = (item.sizes?.length ?? 0) > 0;

  // Sized items expose every configured size in catalog order, even out-of-stock ones
  // (rendered disabled) so the buyer sees the full size run instead of a hole.
  const sizeOptions: SizeOption[] = useMemo(() => {
    if (!hasSizes) return [];
    const byKey = new Map((item.sizes ?? []).map((s) => [s.size, s.stock] as const));
    return SIZE_VALUES.filter((s) => byKey.has(s)).map((s) => {
      const stock = byKey.get(s) ?? null;
      return {
        size: s,
        stock,
        outOfStock: typeof stock === 'number' && stock <= 0,
      };
    });
  }, [item.sizes, hasSizes]);

  const allSizesOut = hasSizes && sizeOptions.every((opt) => opt.outOfStock);
  const isOutOfStock = hasSizes
    ? allSizesOut || item.out_of_stock
    : item.stock === 0 || item.out_of_stock;

  const sizeCollection = useMemo(
    () => createListCollection({
      items: sizeOptions,
      itemToString: (opt) => opt.size,
      itemToValue: (opt) => opt.size,
      isItemDisabled: (opt) => opt.outOfStock,
    }),
    [sizeOptions],
  );

  const selectedSizeStock = useMemo(() => {
    if (!selectedSize) return null;
    return sizeOptions.find((s) => s.size === selectedSize)?.stock ?? null;
  }, [selectedSize, sizeOptions]);

  const canAdd = !isAdminView
    && !isOutOfStock
    && item.id !== undefined
    && (!hasSizes || selectedSize !== null);

  function formatTags(tag: string) {
    return `${tag.charAt(0).toUpperCase()}${tag.slice(1).replace(/_/g, ' ')}`;
  }

  const handleAddToCart = () => {
    if (!canAdd || item.id === undefined) return;
    if (hasSizes && !selectedSize) {
      toaster.create({
        title: t.shop.sizeRequired,
        type: 'info',
      });
      return;
    }
    const stockForLine = hasSizes ? selectedSizeStock : (item.stock ?? null);
    const added = addItem(String(item.id), stockForLine, selectedSize ?? undefined);
    if (added) {
      toaster.create({
        title: t.cart.addedToast,
        description: t.cart.addedToastDescription(item.name),
        type: 'success',
      });
      op.track('shop_add_to_cart', { itemName: item.name, itemId: item.id, size: selectedSize ?? null });
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
      position={'relative'}
      isolation={'isolate'}
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
          zIndex={2}
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

        {hasSizes && !isAdminView && (
          <Select.Root
            collection={sizeCollection}
            size='sm'
            width='100%'
            value={selectedSize ? [selectedSize] : []}
            onValueChange={(e) => {
              const next = e.value?.[0];
              setSelectedSize((next && (SIZE_VALUES as readonly string[]).includes(next)) ? next as SizeValue : null);
            }}
            disabled={allSizesOut}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={t.shop.sizePlaceholder} />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {sizeOptions.map((opt) => (
                    <Select.Item item={opt} key={opt.size} color={'black'}>
                      {opt.size}
                      {opt.outOfStock && (
                        <span style={{ marginLeft: 8, color: '#959595', fontSize: 12 }}>
                          {t.shop.outOfStock}
                        </span>
                      )}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        )}
      </Flex>

      <LavaButton
        variant='filled'
        disabled={!canAdd}
        onClick={handleAddToCart}
      >
        {isOutOfStock
          ? t.shop.outOfStockBuy
          : hasSizes && !selectedSize
            ? t.shop.sizePlaceholder
            : t.shop.addToCart}
      </LavaButton>

    </Flex>
  )
}
