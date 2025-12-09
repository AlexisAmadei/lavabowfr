import { ComponentType, Suspense } from 'react';
import Loading from '../components/Design/Loading';

interface LazyRouteProps {
  component: ComponentType<any>;
}

/**
 * Wrapper component for lazy-loaded routes with automatic Suspense handling
 */
const LazyRoute = ({ component: Component }: LazyRouteProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export default LazyRoute;
