export const CART_STORAGE_KEY = 'lavabow_cart_v1';
export const CART_EXPIRY_MS = 30 * 60 * 1000;
export const SHIPPING_COST_CENTS = 499;

export type DeliveryMethod = 'in_hand' | 'shipping';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  // Reserved for v2.1 — server ignores any value here until discount support ships.
  discountCode: string | null;
  createdAt: number;
}

export interface CartProductInfo {
  id: string;
  priceCents: number;
  stock?: number | null;
}

export interface CartTotals {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  itemCount: number;
}

const isBrowser = (): boolean => typeof window !== 'undefined';

const emptyCart = (): CartState => ({
  items: [],
  deliveryMethod: 'in_hand',
  discountCode: null,
  createdAt: 0,
});

// Cached snapshot keeps the object reference stable between writes — required by
// React's useSyncExternalStore, which loops if getSnapshot returns a fresh object every call.
let cachedSnapshot: CartState | null = null;

const invalidateCache = (): void => {
  cachedSnapshot = null;
};

const listeners = new Set<() => void>();
const emit = (): void => {
  listeners.forEach((cb) => cb());
};

export function subscribeCart(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function readRaw(): CartState | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CartState> | null;
    if (!parsed || !Array.isArray(parsed.items)) return null;
    return {
      items: parsed.items.filter(
        (i): i is CartItem =>
          !!i &&
          typeof i.productId === 'string' &&
          typeof i.quantity === 'number' &&
          Number.isFinite(i.quantity) &&
          i.quantity > 0,
      ),
      deliveryMethod: parsed.deliveryMethod === 'shipping' ? 'shipping' : 'in_hand',
      discountCode: typeof parsed.discountCode === 'string' ? parsed.discountCode : null,
      createdAt: typeof parsed.createdAt === 'number' ? parsed.createdAt : 0,
    };
  } catch {
    return null;
  }
}

function writeRaw(state: CartState): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    invalidateCache();
    emit();
  } catch {
    // localStorage may throw in private mode or when full — cart is best-effort.
  }
}

export function getCart(): CartState {
  if (cachedSnapshot) return cachedSnapshot;
  cachedSnapshot = readRaw() ?? emptyCart();
  return cachedSnapshot;
}

export function loadCart(): { cart: CartState; expired: boolean } {
  const stored = readRaw();
  if (!stored) return { cart: emptyCart(), expired: false };
  const hasItems = stored.items.length > 0;
  if (hasItems && stored.createdAt > 0 && Date.now() - stored.createdAt > CART_EXPIRY_MS) {
    const fresh = emptyCart();
    writeRaw(fresh);
    return { cart: fresh, expired: true };
  }
  return { cart: stored, expired: false };
}

export function clearCart(): void {
  writeRaw(emptyCart());
}

export function setDeliveryMethod(method: DeliveryMethod): void {
  const cart = getCart();
  writeRaw({ ...cart, deliveryMethod: method });
}

// createdAt is set when the cart goes empty -> non-empty, and reset to 0 when it goes back to empty,
// so the 30-min expiry only counts time since the user actually started shopping.
function commitItems(cart: CartState, items: CartItem[]): CartState {
  const wasEmpty = cart.items.length === 0;
  const willBeEmpty = items.length === 0;
  let createdAt = cart.createdAt;
  if (willBeEmpty) createdAt = 0;
  else if (wasEmpty) createdAt = Date.now();
  return { ...cart, items, createdAt };
}

function clampToStock(quantity: number, stock?: number | null): number {
  if (typeof stock === 'number' && Number.isFinite(stock)) {
    return Math.max(0, Math.min(quantity, stock));
  }
  return Math.max(0, quantity);
}

// Returns true when the item was added or its quantity incremented; false when the
// cart already held the stock cap (so the caller can show "max reached" feedback).
export function addItem(productId: string, stock?: number | null): boolean {
  const cart = getCart();
  const existing = cart.items.find((i) => i.productId === productId);
  if (existing) {
    const next = clampToStock(existing.quantity + 1, stock);
    if (next === existing.quantity) return false;
    const items = cart.items.map((i) => (i.productId === productId ? { ...i, quantity: next } : i));
    writeRaw(commitItems(cart, items));
    return true;
  }
  if (typeof stock === 'number' && stock <= 0) return false;
  writeRaw(commitItems(cart, [...cart.items, { productId, quantity: 1 }]));
  return true;
}

export function removeItem(productId: string): void {
  const cart = getCart();
  const items = cart.items.filter((i) => i.productId !== productId);
  if (items.length === cart.items.length) return;
  writeRaw(commitItems(cart, items));
}

export function setQuantity(productId: string, quantity: number, stock?: number | null): void {
  const next = clampToStock(quantity, stock);
  if (next <= 0) {
    removeItem(productId);
    return;
  }
  const cart = getCart();
  const existing = cart.items.find((i) => i.productId === productId);
  if (!existing) return;
  if (existing.quantity === next) return;
  const items = cart.items.map((i) => (i.productId === productId ? { ...i, quantity: next } : i));
  writeRaw(commitItems(cart, items));
}

export function incrementItem(productId: string, stock?: number | null): void {
  const cart = getCart();
  const existing = cart.items.find((i) => i.productId === productId);
  if (!existing) return;
  setQuantity(productId, existing.quantity + 1, stock);
}

export function decrementItem(productId: string): void {
  const cart = getCart();
  const existing = cart.items.find((i) => i.productId === productId);
  if (!existing) return;
  setQuantity(productId, existing.quantity - 1);
}

export function isCartEmpty(cart: CartState): boolean {
  return cart.items.length === 0;
}

// Display-only — server recomputes from the DB before creating the Stripe session.
export function computeTotals(cart: CartState, products: CartProductInfo[]): CartTotals {
  const byId = new Map(products.map((p) => [p.id, p]));
  let subtotalCents = 0;
  let itemCount = 0;
  for (const item of cart.items) {
    const product = byId.get(item.productId);
    if (!product) continue;
    subtotalCents += product.priceCents * item.quantity;
    itemCount += item.quantity;
  }
  const shippingCents = cart.deliveryMethod === 'shipping' ? SHIPPING_COST_CENTS : 0;
  return {
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    itemCount,
  };
}
