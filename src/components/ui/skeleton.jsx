import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-slate-900/50",
        className
      )}
      {...props}
    >
      <div className="shimmer-effect" />
    </div>
  )
}

export { Skeleton }