'use client';

import AppBar from '@/components/Core/AppBar/AppBar';
import MobileAppBar from '@/components/Core/AppBar/MobileAppBar';
import LanguageToggle from '@/components/Core/LanguageToggle/LanguageToggle';
import Footer from '@/components/Sections/Footer';
import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo';
import useIsMobile from '@/hooks/useIsMobile';
import { useTranslation } from '@/i18n/useTranslation';
import { clearCart } from '@/utils/cart';
import { Box, Container, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface OrderSummary {
  id: string;
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
  total_cents: number;
}

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatCents = (cents: number): string => priceFormatter.format(cents / 100);

export default function OrderSuccess() {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get('session_id');

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Clear cart once on landing — Stripe has confirmed the redirect happened, even if the
  // webhook hasn't flipped the order to `paid` yet (Sprint 3).
  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setNotFound(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/get-order?session_id=${encodeURIComponent(sessionId)}`);
        if (cancelled) return;
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const { order } = await res.json() as { order: OrderSummary };
        if (!cancelled) setOrder(order);
      } catch (err) {
        console.error('get-order failed', err);
        if (!cancelled) setNotFound(true);
      }
    })();
    return () => { cancelled = true; };
  }, [sessionId]);

  return (
    <Container
      backgroundColor={'var(--Background-bg-brand)'}
      minHeight={'100vh'}
      maxW={'100vw'}
      p={0}
      paddingTop={100}
    >
      {isMobile ? <MobileAppBar /> : <AppBar />}

      <Flex direction={'column'} alignItems={'center'} px={isMobile ? 4 : 16} pb={20} gap={6}>
        <LavaTypo variant='h1' textAlign='center'>{t.orderSuccess.title}</LavaTypo>

        <Box
          backgroundColor={'white'}
          borderRadius={8}
          p={6}
          maxW={'600px'}
          width={'100%'}
        >
          {notFound ? (
            <LavaTypo color='black'>{t.orderSuccess.notFound}</LavaTypo>
          ) : order ? (
            <Flex direction={'column'} gap={4}>
              <LavaTypo color='black'>{t.orderSuccess.thanks}</LavaTypo>

              <Box height={'1px'} backgroundColor={'#eee'} />

              <Flex justifyContent={'space-between'}>
                <LavaTypo color='gray'>{t.orderSuccess.orderIdLabel}</LavaTypo>
                <LavaTypo color='black' style={{ fontFamily: 'monospace' }}>
                  {order.id}
                </LavaTypo>
              </Flex>

              <Flex justifyContent={'space-between'}>
                <LavaTypo variant='h4' color='black'>{t.cart.total}</LavaTypo>
                <LavaTypo variant='h4' color='black'>{formatCents(order.total_cents)}</LavaTypo>
              </Flex>

              <Box height={'1px'} backgroundColor={'#eee'} />

              <LavaTypo color='gray' style={{ fontSize: '14px' }}>
                {order.status === 'paid' ? t.orderSuccess.receiptNote : t.orderSuccess.pendingNote}
              </LavaTypo>
            </Flex>
          ) : (
            <LavaTypo color='gray'>{t.orderSuccess.pendingNote}</LavaTypo>
          )}
        </Box>

        <LavaButton variant='filled' onClick={() => router.push('/shop')}>
          {t.orderSuccess.backToShop}
        </LavaButton>
      </Flex>

      <Footer />
      <LanguageToggle />
    </Container>
  );
}
