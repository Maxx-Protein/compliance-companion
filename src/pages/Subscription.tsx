import { Card } from "@/components/ui/card";

const Subscription = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and billing</p>
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground py-12">
          Subscription management coming soon. Upgrade to Premium here.
        </p>
      </Card>
    </div>
  );
};

export default Subscription;
