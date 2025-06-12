import { cn } from "@/lib/utils"
import React from "react"

/**
 * Универсальный Skeleton Loader с shimmer-эффектом.
 * Используйте для карточек, секций, изображений и любых асинхронных блоков.
 *
 * Пример:
 * <Skeleton className="h-32 w-full rounded-xl" />
 */
export function Skeleton({ className, style, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted animate-pulse rounded-md",
        className
      )}
      style={style}
      {...props}
    >
      {/* Shimmer-эффект */}
      <span
        className="absolute inset-0 block h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-60"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}

// Tailwind CSS (или global.css):
// .animate-shimmer {
//   animation: shimmer 1.5s infinite linear;
// }
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
