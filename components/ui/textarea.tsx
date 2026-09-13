import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm text-[#172033] font-medium transition-all outline-none placeholder:text-[#64748B] placeholder:font-normal focus-visible:border-[#1E5AA8] focus-visible:ring-2 focus-visible:ring-[#1E5AA8]/20 disabled:cursor-not-allowed disabled:bg-[#F1F5F9] disabled:text-[#94A3B8] disabled:opacity-60 shadow-2xs",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
