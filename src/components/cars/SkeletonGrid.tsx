import { SkeletonCarCard } from "./SkeletonCarCard";

interface SkeletonGridProps {
  count?: number;
}

export const SkeletonGrid = ({ count = 9 }: SkeletonGridProps) => {
  return (
    <div 
      className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading cars"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCarCard key={i} />
      ))}
    </div>
  );
};