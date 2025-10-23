export const CarDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 bg-white/20 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Skeleton */}
          <main className="flex-1 space-y-8">
            <div className="bg-card rounded-2xl shadow-card p-6 animate-pulse">
              <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </main>
          
          {/* Sidebar Skeleton */}
          <aside className="lg:w-96 flex-shrink-0">
            <div className="bg-card rounded-2xl shadow-card p-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-muted rounded w-full"></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
