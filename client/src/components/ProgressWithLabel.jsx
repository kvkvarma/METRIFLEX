import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export function ProgressWithLabel({ label, value }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <Label>{label}</Label>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={63} />
    </div>
  );
}
export default ProgressWithLabel;