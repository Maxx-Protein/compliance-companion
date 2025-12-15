import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const Reports = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filings, setFilings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [invoicesRes, filingsRes] = await Promise.all([
      supabase.from("invoices").select("*").eq("user_id", user?.id),
      supabase.from("gst_filings").select("*").eq("user_id", user?.id)
    ]);

    if (invoicesRes.data) setInvoices(invoicesRes.data);
    if (filingsRes.data) setFilings(filingsRes.data);
  };

  const calculateMonthlyStats = () => {
    const totalSales = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
    const totalGst = invoices.reduce((sum, inv) => 
      sum + parseFloat(inv.sgst_amount || 0) + parseFloat(inv.cgst_amount || 0) + parseFloat(inv.igst_amount || 0), 0
    );
    const avgInvoice = invoices.length > 0 ? totalSales / invoices.length : 0;

    return { totalSales, totalGst, avgInvoice, invoiceCount: invoices.length };
  };

  const stats = calculateMonthlyStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">Generate tax and compliance reports</p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Report Generator</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label>Report Type</Label>
            <Select defaultValue="monthly">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly Tax Summary</SelectItem>
                <SelectItem value="annual">Annual Tax Report</SelectItem>
                <SelectItem value="gst">GST Liability Report</SelectItem>
                <SelectItem value="product">Product Performance</SelectItem>
                <SelectItem value="compliance">Compliance Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="01">January</SelectItem>
                <SelectItem value="02">February</SelectItem>
                <SelectItem value="03">March</SelectItem>
                <SelectItem value="04">April</SelectItem>
                <SelectItem value="05">May</SelectItem>
                <SelectItem value="06">June</SelectItem>
                <SelectItem value="07">July</SelectItem>
                <SelectItem value="08">August</SelectItem>
                <SelectItem value="09">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 bg-primary hover:bg-primary-hover">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Excel
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Sales</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹{stats.totalSales.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total GST</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹{stats.totalGst.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Collected</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Invoice</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹{stats.avgInvoice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Per invoice</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Invoices</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">{stats.invoiceCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Total count</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium mb-2">Tax Summary (All Time)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Sales</p>
                <p className="font-semibold">₹{stats.totalSales.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">GST Collected</p>
                <p className="font-semibold">₹{stats.totalGst.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Invoices</p>
                <p className="font-semibold">{stats.invoiceCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Value</p>
                <p className="font-semibold">₹{stats.avgInvoice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium mb-2">Filing Status</h3>
            <p className="text-sm text-muted-foreground">
              {filings.length} filing records tracked
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
