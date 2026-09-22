import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-muted motion-reduce:animate-none animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
