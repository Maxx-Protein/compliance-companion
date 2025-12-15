import { Card } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card className="p-6">
        <p className="text-center text-muted-foreground py-12">
          Account settings coming soon. Profile, business details, and notifications.
        </p>
      </Card>
    </div>
  );
};

export default Settings;
