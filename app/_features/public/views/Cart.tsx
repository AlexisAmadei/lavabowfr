'use client';

import AppBar from '@/components/Core/AppBar/AppBar';
import MobileAppBar from '@/components/Core/AppBar/MobileAppBar';
import LanguageToggle from '@/components/Core/LanguageToggle/LanguageToggle';
import Footer from '@/components/Sections/Footer';
import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo';
import { toaster } from '@/components/ui/toaster';
import useIsMobile from '@/hooks/useIsMobile';
import { useCart, useCartExpiryCheck } from '@/hooks/useCart';
import { useTranslation } from '@/i18n/useTranslation';
import {
  CartProductInfo,
  clearCart,
  computeTotals,
  decrementItem,
  incrementItem,
  removeItem,
} from '@/utils/cart';
import { fetchMerchItems, MerchItem } from '@/utils/supabase/shop';
import {
  Box,
  Container,
  Dialog,
  Flex,
  IconButton,
  Input,
  Portal,
} from '@chakra-ui/react';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatCents = (cents: number): string => priceFormatter.format(cents / 100);

// The line grid collapses below `md`: the product block spans the full width and
// quantity / price / delete drop onto a second row. From `md` up it is the 4-column
// table that matches the header row.
const LINE_GRID_AREAS = {
  base: `"info info info" "qty price trash"`,
  md: `"info qty price trash"`,
};

const LINE_GRID_COLUMNS = {
  base: 'auto 1fr auto',
  md: '1fr 1fr 1fr 60px',
};

const merchToProductInfo = (item: MerchItem): CartProductInfo => ({
  id: String(item.id),
  priceCents: typeof item.price_cents === 'number'
    ? item.price_cents
    : Math.round(Number(item.price) * 100),
  stock: item.stock ?? null,
  sizes: item.sizes,
});

export default function Cart() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const router = useRouter();
  const cart = useCart();

  const [products, setProducts] = useState<MerchItem[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  useCartExpiryCheck(() => {
    toaster.create({
      title: t.cart.expiredToast,
      description: t.cart.expiredToastDescription,
      type: 'info',
    });
  });

  useEffect(() => {
    fetchMerchItems().then(setProducts);
  }, []);

  const productById = useMemo(() => {
    const map = new Map<string, MerchItem>();
    for (const p of products) map.set(String(p.id), p);
    return map;
  }, [products]);

  const productInfos = useMemo(
    () => products.map(merchToProductInfo),
    [products],
  );

  const totals = computeTotals(cart, productInfos);
  const isEmpty = cart.items.length === 0;
  const productsLoaded = products.length > 0;

  const handleCheckout = () => {
    // Pre-checkout page lands in Sprint 2 — for now, route there and let it 404 visibly.
    router.push('/checkout');
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setAppliedPromo({
        code: promoCode,
        discount: Math.round(totals.subtotalCents * 0.1), // Placeholder: 10% discount
      });
    }
  };

  return (
    <Container
      backgroundColor={'var(--Background-bg-brand)'}
      minHeight={'100vh'}
      maxW={'100%'}
      p={0}
      paddingTop={100}
    >
      {isMobile ? <MobileAppBar /> : <AppBar />}

      <Flex direction={'column'} alignItems={'center'} px={{ base: 4, md: 8, lg: 16 }} pb={20}>
        <LavaTypo variant='h1' textAlign='center'>{t.cart.title}</LavaTypo>

        {isEmpty ? (
          <Flex direction={'column'} alignItems={'center'} gap={4} mt={10}>
            <LavaTypo variant='h3'>{t.cart.empty}</LavaTypo>
            <LavaButton variant='filled' onClick={() => router.push('/shop')}>
              {t.cart.continueShopping}
            </LavaButton>
          </Flex>
        ) : (
          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gap={8}
            mt={8}
            width={'100%'}
            maxW={'1100px'}
            alignItems={{ base: 'stretch', lg: 'flex-start' }}
          >
            {/* Product List */}
            <Flex
              direction={'column'}
              gap={0}
              flex={1}
              minW={0}
              width={'100%'}
              backgroundColor={'#f1f1f1'}
              borderRadius={8}
              p={4}
            >
              {/* Column Headers — the table head only makes sense once the grid is 4 columns */}
              <Box
                display={{ base: 'none', md: 'grid' }}
                gridTemplateColumns={LINE_GRID_COLUMNS.md}
                gap={4}
                alignItems={'center'}
                width={'100%'}
                pb={3}
                borderBottom={'1px solid #959595'}
                mb={3}
              >
                <Box minW={0}>
                  <LavaTypo color='#959595' size='14px'>{t.cart.productCode || 'Code produit'}</LavaTypo>
                </Box>
                <Box textAlign='center'>
                  <LavaTypo color='#959595' size='14px'>{t.cart.quantity || 'Quantité'}</LavaTypo>
                </Box>
                <Box textAlign='right'>
                  <LavaTypo color='#959595' size='14px'>{t.cart.total || 'Total'}</LavaTypo>
                </Box>
                <Box textAlign='right'>
                  <LavaTypo color='#959595' size='14px'>{t.cart.action || 'Action'}</LavaTypo>
                </Box>
              </Box>

              {/* Product Items */}
              {cart.items.map((line) => {
                const product = productById.get(line.productId);
                if (!product) return null;
                // Stock cap follows the chosen size when the article is sized; falls back to the article-level stock otherwise.
                const sizeStock = line.size
                  ? product.sizes?.find((s) => s.size === line.size)?.stock ?? null
                  : null;
                const stock = line.size ? sizeStock : (product.stock ?? null);
                const atMax = typeof stock === 'number' && line.quantity >= stock;
                const lineTotalCents = (typeof product.price_cents === 'number'
                  ? product.price_cents
                  : Math.round(Number(product.price) * 100)) * line.quantity;
                // The same product can appear with different sizes — key needs both.
                const lineKey = `${line.productId}:${line.size ?? '_'}`;
                const sizeOrDescription = line.size
                  ? `${t.cart.sizeLabel} ${line.size}`
                  : (product.description || 'Standard');

                return (
                  <Box
                    key={lineKey}
                    display={'grid'}
                    gridTemplateAreas={LINE_GRID_AREAS}
                    gridTemplateColumns={LINE_GRID_COLUMNS}
                    columnGap={4}
                    rowGap={3}
                    alignItems={'center'}
                    width={'100%'}
                    borderBottom={'1px solid #959595'}
                    py={3}
                  >
                    {/* Product Info */}
                    <Flex gridArea='info' align='center' gap={3} minW={0}>
                      <img
                        src={product.image_url || 'https://placehold.co/70x70'}
                        alt={product.name}
                        style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                      />
                      <Flex direction={'column'} flex={1} minW={0} gap={1}>
                        <LavaTypo variant='h4' color='#ed00e1' style={{ fontWeight: 'normal', wordBreak: 'break-word' }}>
                          {product.name}
                        </LavaTypo>
                        <LavaTypo color='#959595' size='14px'>
                          {sizeOrDescription}
                        </LavaTypo>
                      </Flex>
                    </Flex>

                    {/* Quantity */}
                    <Flex
                      gridArea='qty'
                      align={'center'}
                      gap={2}
                      px={2}
                      py={1}
                      borderRadius='100px'
                      border='1px solid #060606'
                      justifySelf={{ base: 'start', md: 'center' }}
                    >
                      <IconButton
                        size='xs'
                        aria-label='decrement'
                        onClick={() => decrementItem(line.productId, line.size)}
                        disabled={!productsLoaded}
                        variant='ghost'
                      >
                        <FontAwesomeIcon icon={faMinus} size='sm' />
                      </IconButton>
                      <LavaTypo color='black' size='14px' style={{ minWidth: 20, textAlign: 'center' }}>
                        {line.quantity}
                      </LavaTypo>
                      <IconButton
                        size='xs'
                        aria-label='increment'
                        onClick={() => incrementItem(line.productId, stock, line.size)}
                        disabled={!productsLoaded || atMax}
                        variant='ghost'
                      >
                        <FontAwesomeIcon icon={faPlus} size='sm' />
                      </IconButton>
                    </Flex>

                    {/* Total Price */}
                    <Box gridArea='price' textAlign='right' minW={0}>
                      <LavaTypo color='#ed00e1' variant='h4' style={{ fontWeight: 'normal' }}>
                        {formatCents(lineTotalCents)}
                      </LavaTypo>
                    </Box>

                    {/* Delete Action */}
                    <Box gridArea='trash' justifySelf='end'>
                      <IconButton
                        size='sm'
                        aria-label={t.cart.remove}
                        variant='ghost'
                        onClick={() => removeItem(line.productId, line.size)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}

              {/* Clear All Button */}
              <Flex justifyContent={'flex-end'} mt={4} pt={3}>
                <LavaButton
                  variant='filled'
                  onClick={() => setConfirmClearOpen(true)}
                >
                  {t.cart.clearAll}
                </LavaButton>
              </Flex>
            </Flex>

            {/* Order Summary */}
            <Flex
              direction={'column'}
              gap={4}
              width={{ base: '100%', lg: '400px' }}
              flexShrink={0}
              backgroundColor={'#f1f1f1'}
              borderRadius={8}
              p={4}
            >
              <LavaTypo color='#959595' size='14px'>
                {t.cart.orderSummary || 'Résumé de la commande'}
              </LavaTypo>

              <Box height={'1px'} backgroundColor={'#959595'} />

              {/* Promo Code Section */}
              <Flex gap={2} width='100%'>
                <Input
                  placeholder={t.cart.promoCodePlaceholder || 'Code promo'}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  borderRadius='100px'
                  border='1px solid #060606'
                  px={6}
                  py={3}
                  fontSize='16px'
                  flex={1}
                  minW={0}
                  color={'black'}
                />
                <LavaButton
                  variant='filled'
                  color='secondary'
                  onClick={handleApplyPromo}
                  size='medium'
                >
                  {t.cart.apply || 'Appliquer'}
                </LavaButton>
              </Flex>

              <Box height={'1px'} backgroundColor={'#959595'} />

              {/* Price Breakdown */}
              <Flex direction='column' gap={2}>
                <Flex justifyContent={'space-between'}>
                  <LavaTypo color='#959595' size='14px'>{t.cart.subtotal || 'Total de la commande'}</LavaTypo>
                  <LavaTypo color='#060606' size='14px' style={{ fontWeight: 'bold' }}>{formatCents(totals.subtotalCents)}</LavaTypo>
                </Flex>

                {appliedPromo && (
                  <Flex justifyContent={'space-between'}>
                    <LavaTypo color='#959595' size='14px'>{`${t.cart.promo || 'Code promo'} (${Math.round((appliedPromo.discount / totals.subtotalCents) * 100)}%)`}</LavaTypo>
                    <LavaTypo color='#060606' size='14px' style={{ fontWeight: 'bold' }}>{`-${formatCents(appliedPromo.discount)}`}</LavaTypo>
                  </Flex>
                )}

              </Flex>

              <Box height={'1px'} backgroundColor={'#959595'} />

              {/* Total */}
              <Flex justifyContent={'space-between'} alignItems='center'>
                <LavaTypo color='#060606' size='16px' style={{ fontWeight: 'bold' }}>{t.cart.total || 'Total'}</LavaTypo>
                <LavaTypo
                  color='#060606'
                  size='24px'
                  style={{ fontWeight: 'bold', fontFamily: "'Cossette_Texte', serif" }}
                >
                  {formatCents(totals.subtotalCents - (appliedPromo?.discount || 0))}
                </LavaTypo>
              </Flex>

              {/* Checkout Button */}
              <LavaButton
                variant='filled'
                disabled={isEmpty}
                onClick={handleCheckout}
                size='medium'
              >
                {t.cart.checkout || 'Payer'}
              </LavaButton>
            </Flex>
          </Flex>
        )}
      </Flex>

      <Footer />
      <LanguageToggle />

      <Dialog.Root
        open={confirmClearOpen}
        onOpenChange={(e) => setConfirmClearOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner padding={4}>
            <Dialog.Content>
              <Flex
                direction={'column'}
                backgroundColor={'white'}
                padding={6}
                borderRadius={8}
                width={'100%'}
                maxWidth={'320px'}
                gap={4}
              >
                <LavaTypo variant='h3' color='black'>{t.cart.clearConfirmTitle}</LavaTypo>
                <LavaTypo color='gray'>{t.cart.clearConfirmMessage}</LavaTypo>
                <Flex justifyContent={'flex-end'} gap={2}>
                  <LavaButton variant='outlined' onClick={() => setConfirmClearOpen(false)}>
                    {t.cart.cancel}
                  </LavaButton>
                  <LavaButton
                    variant='filled'
                    onClick={() => {
                      clearCart();
                      setConfirmClearOpen(false);
                    }}
                  >
                    {t.cart.confirm}
                  </LavaButton>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Container>
  );
}
