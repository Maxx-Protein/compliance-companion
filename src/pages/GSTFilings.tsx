import { Card } from "@/components/ui/card";

const GSTFilings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">GST Filings</h1>
        <p className="text-muted-foreground">Track and file your GST returns</p>
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground py-12">
          GST filing assistant coming soon. GSTR-1, GSTR-3B, and annual returns.
        </p>
      </Card>
    </div>
  );
};

export default GSTFilings;
