import Stripe from 'stripe';

let cached = null;

export function getStripe() {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe not configured (STRIPE_SECRET_KEY)');
  }
  cached = new Stripe(key);
  return cached;
}
