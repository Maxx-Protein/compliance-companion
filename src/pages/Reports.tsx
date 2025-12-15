import { Card } from "@/components/ui/card";

const Reports = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">Generate tax and compliance reports</p>
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground py-12">
          Reporting tools coming soon. Monthly, quarterly, and annual reports.
        </p>
      </Card>
    </div>
  );
};

export default Reports;
