import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/shared/components/card";

export const SkeletonCarCard = () => {
  return (
    <Card className="overflow-hidden bg-card">
      {/* Photo area skeleton - 65% of card */}
      <Skeleton className="w-full aspect-[4/3]" rounded="lg" />
      
      {/* Content area - 35% of card */}
      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" rounded="md" />
        
        {/* Meta row skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" rounded="md" />
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16" rounded="md" />
        </div>
        
        {/* Spec chips row skeleton */}
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-12" rounded="full" />
          <Skeleton className="h-6 w-12" rounded="full" />
          <Skeleton className="h-6 w-16" rounded="full" />
          <Skeleton className="h-6 w-14" rounded="full" />
        </div>
      </CardContent>
      
      {/* CTA buttons skeleton */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-10 flex-1" rounded="md" />
        <Skeleton className="h-10 w-24" rounded="md" />
      </CardFooter>
    </Card>
  );
};