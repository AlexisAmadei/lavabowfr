'use client';

import { Suspense } from 'react';
import OrderSuccess from '@/features/public/views/OrderSuccess';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={null}>
      <OrderSuccess />
    </Suspense>
  );
}
