import { useCart } from '@/hooks/useCart';
import { useTranslation } from '@/i18n/useTranslation';
import { Box, IconButton } from '@chakra-ui/react';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';

export default function CartButton({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const cart = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const itemCount = cart.items.reduce((acc, line) => acc + line.quantity, 0);
  const dimension = size === 'sm' ? '36px' : '44px';

  return (
    <Box position={'relative'} display={'inline-flex'}>
      <IconButton
        aria-label={t.cart.viewCart}
        onClick={() => navigate('/cart')}
        variant={'ghost'}
        color={'white'}
        width={dimension}
        height={dimension}
      >
        <FontAwesomeIcon icon={faCartShopping} size={size === 'sm' ? '1x' : 'lg'} />
      </IconButton>
      {itemCount > 0 && (
        <Box
          position={'absolute'}
          top={'-2px'}
          right={'-2px'}
          minW={'18px'}
          height={'18px'}
          px={'4px'}
          borderRadius={'9px'}
          backgroundColor={'var(--main-accent)'}
          color={'white'}
          fontSize={'11px'}
          fontWeight={'bold'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          pointerEvents={'none'}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Box>
      )}
    </Box>
  );
}
