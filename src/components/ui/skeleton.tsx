import { cn } from "@/lib/utils";

function Skeleton({
  className,
  rounded = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  rounded?: "default" | "sm" | "md" | "lg" | "xl" | "full";
}) {
  const roundedClasses = {
    default: "rounded",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        roundedClasses[rounded],
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };