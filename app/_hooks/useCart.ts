import { useEffect, useSyncExternalStore } from 'react';
import { CartState, getCart, loadCart, subscribeCart } from '@/utils/cart';

const getSnapshot = (): CartState => getCart();

export function useCart(): CartState {
  return useSyncExternalStore(subscribeCart, getSnapshot, getSnapshot);
}

// Runs loadCart() once and reports whether the stored cart had expired,
// so a parent component can show a toast.
export function useCartExpiryCheck(onExpired: () => void): void {
  useEffect(() => {
    const { expired } = loadCart();
    if (expired) onExpired();
    // onExpired is intentionally not in deps — fire-once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
