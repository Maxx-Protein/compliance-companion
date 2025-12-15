import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, AlertCircle, CheckCircle2, DollarSign, Package } from "lucide-react";
import { PageTour } from "@/components/PageTour";

const Dashboard = () => {
  const steps = [
    {
      target: "body",
      placement: "center",
      content:
        "Welcome to your dashboard. This overview shows key GST, sales and compliance metrics.",
    },
    {
      target: '[data-tour="dashboard-stats"]',
      content: "These cards summarise sales, GST and product counts at a glance.",
    },
    {
      target: '[data-tour="dashboard-actions"]',
      content:
        "Use Quick Actions to jump straight into creating invoices, filing returns or adding products.",
    },
    {
      target: '[data-tour="dashboard-alerts"]',
      content:
        "Alerts highlight upcoming GST deadlines and actions that may need attention.",
    },
  ];

  return (
    <div className="space-y-6">
      <PageTour tourId="dashboard" steps={steps as any} />
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your compliance & tax status</p>
      </div>

      {/* Stats Cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-tour="dashboard-stats"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Sales</span>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹2,45,000</p>
          <p className="text-xs text-success mt-1">+12% from last month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">GST Collected</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹44,100</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">GST Payable</span>
            <AlertCircle className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold">₹15,200</p>
          <p className="text-xs text-warning mt-1">Due in 5 days</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Invoices Created</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">127</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Compliance Score</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold">92%</p>
          <p className="text-xs text-success mt-1">Excellent</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Products</span>
            <Package className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">48</p>
          <p className="text-xs text-muted-foreground mt-1">Active listings</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6" data-tour="dashboard-actions">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="bg-primary hover:bg-primary-hover">Create Invoice</Button>
          <Button variant="outline">File GSTR-1</Button>
          <Button variant="outline">Add Product</Button>
          <Button variant="outline">View Compliance</Button>
        </div>
      </Card>

      {/* Alerts */}
      <Card className="p-6" data-tour="dashboard-alerts">
        <h2 className="text-lg font-semibold mb-4">Alerts & Notices</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-sm">GSTR-1 due in 5 days</p>
              <p className="text-xs text-muted-foreground">Submit outward supplies return by 20th April</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-sm">GST payment due by 20th April</p>
              <p className="text-xs text-muted-foreground">₹15,200 to be paid</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Invoices */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
        <div className="space-y-3">
          {[
            { num: "INV-127", date: "15 Apr 2025", amount: "₹12,400", status: "Paid" },
            { num: "INV-126", date: "14 Apr 2025", amount: "₹8,900", status: "Paid" },
            { num: "INV-125", date: "13 Apr 2025", amount: "₹15,600", status: "Pending" }
          ].map((inv, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
              <div>
                <p className="font-medium text-sm">{inv.num}</p>
                <p className="text-xs text-muted-foreground">{inv.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-sm">{inv.amount}</p>
                <Badge variant={inv.status === "Paid" ? "default" : "secondary"} className="text-xs">
                  {inv.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
