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
    navigate('/checkout');
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
            {/* Product List */}
            <Flex
              direction={'column'}
              gap={0}
              flex={1}
              width={'100%'}
              backgroundColor={'#f1f1f1'}
              borderRadius={8}
              p={4}
            >
              {/* Column Headers */}
              <Flex
                width={'100%'}
                justifyContent={'space-between'}
                alignItems={'center'}
                pb={3}
                borderBottom={'1px solid #959595'}
                mb={3}
              >
                <Box flex={1} minW={0}>
                  <LavaTypo color='#959595' size='14px'>{t.cart.productCode || 'Code produit'}</LavaTypo>
                </Box>
                <Box flex={1} textAlign='center'>
                  <LavaTypo color='#959595' size='14px'>{t.cart.quantity || 'Quantité'}</LavaTypo>
                </Box>
                <Box flex={1} textAlign='right'>
                  <LavaTypo color='#959595' size='14px'>{t.cart.total || 'Total'}</LavaTypo>
                </Box>
                <Box width='60px' textAlign='right'>
                  <LavaTypo color='#959595' size='14px'>{t.cart.action || 'Action'}</LavaTypo>
                </Box>
              </Flex>

              {/* Product Items */}
              {cart.items.map((line) => {
                const product = productById.get(line.productId);
                if (!product) return null;
                const stock = product.stock ?? null;
                const atMax = typeof stock === 'number' && line.quantity >= stock;
                const lineTotalCents = (typeof product.price_cents === 'number'
                  ? product.price_cents
                  : Math.round(Number(product.price) * 100)) * line.quantity;

                return (
                  <Flex key={line.productId} direction='column' gap={0}>
                    <Flex
                      width={'100%'}
                      align={'center'}
                      justifyContent={'space-between'}
                      gap={4}
                      borderBottom={'1px solid #959595'}
                      py={3}
                    >
                      {/* Product Info */}
                      <Flex direction={'column'} flex={1} minW={0}>
                        <Flex align='center' gap={3} width='100%'>
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
                              {product.description || 'Standard'}
                            </LavaTypo>
                          </Flex>
                        </Flex>
                      </Flex>

                      {/* Quantity */}
                      <Flex flex={1} justifyContent='center'>
                        <Flex
                          align={'center'}
                          gap={2}
                          px={2}
                          py={1}
                          borderRadius='100px'
                          border='1px solid #060606'
                        >
                          <IconButton
                            size='xs'
                            aria-label='decrement'
                            onClick={() => decrementItem(line.productId)}
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
                            onClick={() => incrementItem(line.productId, stock)}
                            disabled={!productsLoaded || atMax}
                            variant='ghost'
                          >
                            <FontAwesomeIcon icon={faPlus} size='sm' />
                          </IconButton>
                        </Flex>
                      </Flex>

                      {/* Total Price */}
                      <Box flex={1} textAlign='right'>
                        <LavaTypo color='#ed00e1' variant='h4' style={{ fontWeight: 'normal' }}>
                          {formatCents(lineTotalCents)}
                        </LavaTypo>
                      </Box>

                      {/* Delete Action */}
                      <Box width='60px' textAlign='right'>
                        <IconButton
                          size='sm'
                          aria-label={t.cart.remove}
                          variant='ghost'
                          onClick={() => removeItem(line.productId)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </IconButton>
                      </Box>
                    </Flex>
                  </Flex>
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
              width={isMobile ? '100%' : '400px'}
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
