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
  setDeliveryMethod,
  SHIPPING_COST_CENTS,
} from '@/utils/cart';
import { fetchMerchItems, MerchItem } from '@/utils/supabase/shop';
import {
  Box,
  Container,
  Dialog,
  Flex,
  IconButton,
  Portal,
  RadioGroup,
} from '@chakra-ui/react';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatCents = (cents: number): string => priceFormatter.format(cents / 100);

const merchToProductInfo = (item: MerchItem): CartProductInfo => ({
  id: String(item.id),
  priceCents: typeof item.price_cents === 'number'
    ? item.price_cents
    : Math.round(Number(item.price) * 100),
  stock: item.stock ?? null,
});

export default function Cart() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cart = useCart();

  const [products, setProducts] = useState<MerchItem[]>([]);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

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
    navigate('/checkout');
  };

  return (
    <Container
      backgroundColor={'var(--Background-bg-brand)'}
      minHeight={'100vh'}
      maxW={'100vw'}
      p={0}
      paddingTop={100}
    >
      {isMobile ? <MobileAppBar /> : <AppBar />}

      <Flex direction={'column'} alignItems={'center'} px={isMobile ? 4 : 16} pb={20}>
        <LavaTypo variant='h1' textAlign='center'>{t.cart.title}</LavaTypo>

        {isEmpty ? (
          <Flex direction={'column'} alignItems={'center'} gap={4} mt={10}>
            <LavaTypo variant='h3'>{t.cart.empty}</LavaTypo>
            <LavaButton variant='filled' onClick={() => navigate('/shop')}>
              {t.cart.continueShopping}
            </LavaButton>
          </Flex>
        ) : (
          <Flex
            direction={isMobile ? 'column' : 'row'}
            gap={8}
            mt={8}
            width={'100%'}
            maxW={'1100px'}
            alignItems={'flex-start'}
          >
            <Flex
              direction={'column'}
              gap={4}
              flex={1}
              width={'100%'}
              backgroundColor={'white'}
              borderRadius={8}
              p={4}
            >
              {cart.items.map((line) => {
                const product = productById.get(line.productId);
                if (!product) return null;
                const stock = product.stock ?? null;
                const atMax = typeof stock === 'number' && line.quantity >= stock;
                const lineTotalCents = (typeof product.price_cents === 'number'
                  ? product.price_cents
                  : Math.round(Number(product.price) * 100)) * line.quantity;

                return (
                  <Flex
                    key={line.productId}
                    align={'center'}
                    gap={4}
                    borderBottom={'1px solid #eee'}
                    pb={3}
                  >
                    <img
                      src={product.image_url || 'https://placehold.co/80x80'}
                      alt={product.name}
                      style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <Flex direction={'column'} flex={1} gap={1}>
                      <LavaTypo variant='h4' color='black' style={{ fontWeight: 'normal' }}>
                        {product.name}
                      </LavaTypo>
                      <LavaTypo color='gray'>
                        {formatCents(typeof product.price_cents === 'number'
                          ? product.price_cents
                          : Math.round(Number(product.price) * 100))}
                      </LavaTypo>
                    </Flex>

                    <Flex align={'center'} gap={2}>
                      <IconButton
                        size='sm'
                        aria-label='decrement'
                        onClick={() => decrementItem(line.productId)}
                        disabled={!productsLoaded}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </IconButton>
                      <LavaTypo color='black' style={{ minWidth: 24, textAlign: 'center' }}>
                        {line.quantity}
                      </LavaTypo>
                      <IconButton
                        size='sm'
                        aria-label='increment'
                        onClick={() => incrementItem(line.productId, stock)}
                        disabled={!productsLoaded || atMax}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </IconButton>
                    </Flex>

                    <LavaTypo color='black' style={{ minWidth: 80, textAlign: 'right' }}>
                      {formatCents(lineTotalCents)}
                    </LavaTypo>

                    <IconButton
                      size='sm'
                      aria-label={t.cart.remove}
                      variant='ghost'
                      onClick={() => removeItem(line.productId)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </Flex>
                );
              })}

              <Flex justifyContent={'flex-end'} mt={2}>
                <LavaButton
                  variant='outlined'
                  onClick={() => setConfirmClearOpen(true)}
                >
                  {t.cart.clearAll}
                </LavaButton>
              </Flex>
            </Flex>

            <Flex
              direction={'column'}
              gap={4}
              width={isMobile ? '100%' : '380px'}
              backgroundColor={'white'}
              borderRadius={8}
              p={4}
            >
              <LavaTypo variant='h3' color='black' style={{ fontWeight: 'normal' }}>
                {t.cart.delivery}
              </LavaTypo>

              <RadioGroup.Root
                value={cart.deliveryMethod}
                onValueChange={(e) => {
                  if (e.value === 'in_hand' || e.value === 'shipping') {
                    setDeliveryMethod(e.value);
                  }
                }}
              >
                <Flex direction={'column'} gap={2}>
                  <RadioGroup.Item value='in_hand'>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText color={'black'}>
                      {t.cart.deliveryInHand}
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                  <RadioGroup.Item value='shipping'>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText color={'black'}>
                      {t.cart.deliveryShipping}
                    </RadioGroup.ItemText>
                  </RadioGroup.Item>
                </Flex>
              </RadioGroup.Root>

              <Box fontSize={'sm'} color={'gray.600'} mt={2}>
                {t.cart.shippingNotice}
              </Box>

              <Box height={'1px'} backgroundColor={'#eee'} my={2} />

              <Flex justifyContent={'space-between'}>
                <LavaTypo color='black'>{t.cart.subtotal}</LavaTypo>
                <LavaTypo color='black'>{formatCents(totals.subtotalCents)}</LavaTypo>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <LavaTypo color='black'>{t.cart.shippingLabel}</LavaTypo>
                <LavaTypo color='black'>
                  {cart.deliveryMethod === 'shipping'
                    ? formatCents(SHIPPING_COST_CENTS)
                    : formatCents(0)}
                </LavaTypo>
              </Flex>
              <Flex justifyContent={'space-between'}>
                <LavaTypo variant='h4' color='black'>{t.cart.total}</LavaTypo>
                <LavaTypo variant='h4' color='black'>{formatCents(totals.totalCents)}</LavaTypo>
              </Flex>

              <LavaButton
                variant='filled'
                disabled={isEmpty}
                onClick={handleCheckout}
              >
                {t.cart.checkout}
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
          <Dialog.Positioner>
            <Dialog.Content>
              <Flex direction={'column'} backgroundColor={'white'} padding={6} borderRadius={8} minWidth={'320px'} gap={4}>
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
