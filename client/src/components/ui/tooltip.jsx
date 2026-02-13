"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = ({ delayDuration = 0, ...props }) => {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      {...props}
    />
  )
}

const Tooltip = (props) => {
  return <TooltipPrimitive.Root {...props} />
}

const TooltipTrigger = (props) => {
  return <TooltipPrimitive.Trigger {...props} />
}

const TooltipContent = ({
  className,
  sideOffset = 4,
  children,
  ...props
}) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="fill-gray-900" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
