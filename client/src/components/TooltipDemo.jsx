import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function TooltipDemo({name,content}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">{name}</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}
export default TooltipDemo;
