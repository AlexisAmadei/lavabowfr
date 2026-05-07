import AppBar from '@/components/Core/AppBar/AppBar';
import MobileAppBar from '@/components/Core/AppBar/MobileAppBar';
import LanguageToggle from '@/components/Core/LanguageToggle/LanguageToggle';
import Footer from '@/components/Sections/Footer';
import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo';
import { toaster } from '@/components/ui/toaster';
import useIsMobile from '@/hooks/useIsMobile';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from '@/i18n/useTranslation';
import {
  CartProductInfo,
  computeTotals,
  setDeliveryMethod,
  SHIPPING_COST_CENTS,
} from '@/utils/cart';
import { fetchMerchItems, MerchItem } from '@/utils/supabase/shop';
import { Box, Container, Flex, RadioGroup } from '@chakra-ui/react';
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

interface CheckoutSessionError {
  error?: string;
  reason?: 'missing' | 'inactive' | 'out_of_stock' | 'insufficient_stock' | 'invalid_price';
  available?: number;
}

export default function Checkout() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cart = useCart();

  const [products, setProducts] = useState<MerchItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMerchItems().then(setProducts);
  }, []);

  // Bounce empty carts back to /shop — pre-checkout has nothing to render.
  useEffect(() => {
    if (cart.items.length === 0) navigate('/shop', { replace: true });
  }, [cart.items.length, navigate]);

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

  const handlePay = async () => {
    if (submitting || isEmpty) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          deliveryMethod: cart.deliveryMethod,
        }),
      });

      if (!res.ok) {
        const payload: CheckoutSessionError = await res.json().catch(() => ({}));
        const message = (() => {
          switch (payload.reason) {
            case 'out_of_stock': return t.checkout.errorOutOfStock;
            case 'missing': return t.checkout.errorMissing;
            case 'inactive': return t.checkout.errorInactive;
            case 'insufficient_stock':
              return typeof payload.available === 'number'
                ? t.checkout.errorInsufficientStock(payload.available)
                : t.checkout.errorGeneric;
            default: return t.checkout.errorGeneric;
          }
        })();
        toaster.create({ title: message, type: 'error' });
        setSubmitting(false);
        return;
      }

      const { url } = await res.json() as { url: string };
      window.location.assign(url);
    } catch (err) {
      console.error('Checkout failed', err);
      toaster.create({ title: t.checkout.errorGeneric, type: 'error' });
      setSubmitting(false);
    }
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
        <LavaTypo variant='h1' textAlign='center'>{t.checkout.title}</LavaTypo>

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
            <LavaTypo variant='h3' color='black' style={{ fontWeight: 'normal' }}>
              {t.checkout.summary}
            </LavaTypo>

            {cart.items.map((line) => {
              const product = productById.get(line.productId);
              if (!product) return null;
              const unitCents = typeof product.price_cents === 'number'
                ? product.price_cents
                : Math.round(Number(product.price) * 100);
              const lineTotalCents = unitCents * line.quantity;
              return (
                <Flex
                  key={line.productId}
                  align={'center'}
                  gap={4}
                  borderBottom={'1px solid #eee'}
                  pb={3}
                >
                  <img
                    src={product.image_url || 'https://placehold.co/64x64'}
                    alt={product.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 4 }}
                  />
                  <Flex direction={'column'} flex={1} gap={1}>
                    <LavaTypo variant='h4' color='black' style={{ fontWeight: 'normal' }}>
                      {product.name}
                    </LavaTypo>
                    <LavaTypo color='gray'>
                      {formatCents(unitCents)} × {line.quantity}
                    </LavaTypo>
                  </Flex>
                  <LavaTypo color='black' style={{ minWidth: 80, textAlign: 'right' }}>
                    {formatCents(lineTotalCents)}
                  </LavaTypo>
                </Flex>
              );
            })}
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
              color='secondary'
              disabled={isEmpty || submitting}
              onClick={handlePay}
            >
              {submitting ? t.checkout.payingCta : t.checkout.payCta}
            </LavaButton>
            <LavaButton
              variant='filled'
              disabled={submitting}
              onClick={() => navigate('/cart')}
            >
              {t.checkout.backToCart}
            </LavaButton>
          </Flex>
        </Flex>
      </Flex>

      <Footer />
      <LanguageToggle />
    </Container>
  );
}
