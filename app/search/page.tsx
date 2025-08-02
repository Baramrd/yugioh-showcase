import { Suspense } from 'react';
import SearchView from './SearchView';
import SearchPageSkeleton from '@/components/SearchPageSkeleton';

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchView />
    </Suspense>
  );
}