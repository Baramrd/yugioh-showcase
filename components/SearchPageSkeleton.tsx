export default function SearchPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="text-center py-8">
        <div className="h-9 w-3/4 max-w-lg mx-auto bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-6 w-full max-w-2xl mx-auto bg-gray-300 dark:bg-gray-700 rounded-lg mt-4"></div>
      </div>
      <div className="relative w-full max-w-2xl mx-auto">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
}