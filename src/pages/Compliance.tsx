import { Card } from "@/components/ui/card";

const Compliance = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Compliance Tracker</h1>
        <p className="text-muted-foreground">Track all regulatory requirements</p>
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground py-12">
          Compliance checklist coming soon. GST, BIS, TCS tracking.
        </p>
      </Card>
    </div>
  );
};

export default Compliance;
