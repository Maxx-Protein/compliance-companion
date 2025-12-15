import { Card } from "@/components/ui/card";

const Calculator = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tax Calculator</h1>
        <p className="text-muted-foreground">Calculate GST, TCS, and ITC</p>
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground py-12">
          Tax calculators coming soon. GST, TCS, ITC, and P&L calculators.
        </p>
      </Card>
    </div>
  );
};

export default Calculator;
