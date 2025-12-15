import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Invoices = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Invoices</h1>
          <p className="text-muted-foreground">Manage your GST-compliant invoices</p>
        </div>
        <Button className="bg-primary hover:bg-primary-hover">
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground py-12">
          Invoice management coming soon. Create and track GST invoices here.
        </p>
      </Card>
    </div>
  );
};

export default Invoices;
