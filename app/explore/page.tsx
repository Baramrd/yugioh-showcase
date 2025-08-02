import { Suspense } from 'react';
import ExploreView from './ExploreView';
import ExplorePageSkeleton from '@/components/ExplorePageSkeleton';

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageSkeleton />}>
      <ExploreView />
    </Suspense>
  );
}