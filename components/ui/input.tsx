import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-sm text-[#172033] font-medium transition-all outline-none placeholder:text-[#64748B] placeholder:font-normal focus-visible:border-[#1E5AA8] focus-visible:ring-2 focus-visible:ring-[#1E5AA8]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:opacity-60 shadow-2xs",
        className
      )}
      {...props}
    />
  )
}

export { Input }
