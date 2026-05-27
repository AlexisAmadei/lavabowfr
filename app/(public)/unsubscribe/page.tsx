'use client';

import { Suspense } from 'react';
import Unsubscribe from '@/features/public/views/Unsubscribe';

export default function UnsubscribePage() {
  return (
    <Suspense fallback={null}>
      <Unsubscribe />
    </Suspense>
  );
}
