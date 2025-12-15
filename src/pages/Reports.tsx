import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, TrendingUp, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { jsPDF } from "jspdf";
import { PageTour } from "@/components/PageTour";

const Reports = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filings, setFilings] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  const tourSteps = [
    {
      target: "body",
      placement: "center" as const,
      content:
        "Reports helps you analyse sales, GST and TCS over time and per product.",
    },
    {
      target: '[data-tour="reports-filters"]',
      content:
        "Use these filters to narrow analytics to a particular month or year before exporting.",
    },
    {
      target: '[data-tour="reports-charts"]',
      content:
        "Charts summarise revenue, GST/TCS trends and product performance visually.",
    },
    {
      target: '[data-tour="reports-invoices"]',
      content:
        "This list shows the individual invoices behind the current analytics with quick PDF access.",
    },
  ];

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [invoicesRes, filingsRes] = await Promise.all([
      supabase.from("invoices").select("*").eq("user_id", user?.id),
      supabase.from("gst_filings").select("*").eq("user_id", user?.id),
    ]);

    if (invoicesRes.error) {
      console.error(invoicesRes.error);
    }
    if (filingsRes.error) {
      console.error(filingsRes.error);
    }

    if (invoicesRes.data) setInvoices(invoicesRes.data);
    if (filingsRes.data) setFilings(filingsRes.data);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!inv.invoice_date) return false;
    const date = new Date(inv.invoice_date);
    const yearMatch = selectedYear
      ? date.getFullYear().toString() === selectedYear
      : true;
    const monthMatch = selectedMonth
      ? (date.getMonth() + 1).toString().padStart(2, "0") === selectedMonth
      : true;
    return yearMatch && monthMatch;
  });

  const monthlyStats = (() => {
    const list = selectedMonth || selectedYear ? filteredInvoices : invoices;
    const totalSales = list.reduce(
      (sum, inv) => sum + Number(inv.total_amount || 0),
      0
    );
    const totalGst = list.reduce(
      (sum, inv) =>
        sum +
        Number(inv.sgst_amount || 0) +
        Number(inv.cgst_amount || 0) +
        Number(inv.igst_amount || 0),
      0
    );
    const tcs = list.reduce(
      (sum, inv) => sum + Number(inv.tcs_deducted || 0),
      0
    );
    const avgInvoice = list.length > 0 ? totalSales / list.length : 0;

    return {
      totalSales,
      totalGst,
      tcs,
      avgInvoice,
      invoiceCount: list.length,
    };
  })();

  const productPerformance = Object.values(
    filteredInvoices.reduce((acc: any, inv) => {
      const items = (inv.items || []) as any[];
      items.forEach((item) => {
        const key = item.product_name || item.hsn_code || "Unknown";
        if (!acc[key]) {
          acc[key] = {
            name: key,
            sales: 0,
            gst: 0,
          };
        }
        const amount = Number(item.amount || 0);
        const gstPercent = parseFloat(item.gst_rate || "0") / 100;
        const gstAmount = amount * gstPercent;
        acc[key].sales += amount;
        acc[key].gst += gstAmount;
      });
      return acc;
    }, {})
  );

  const monthlyTrend = invoices.reduce((acc: any, inv) => {
    if (!inv.invoice_date) return acc;
    const date = new Date(inv.invoice_date);
    const key = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    if (!acc[key]) {
      acc[key] = {
        month: key,
        sales: 0,
        gst: 0,
        tcs: 0,
      };
    }
    const sales = Number(inv.total_amount || 0);
    const gst =
      Number(inv.sgst_amount || 0) +
      Number(inv.cgst_amount || 0) +
      Number(inv.igst_amount || 0);
    const tcs = Number(inv.tcs_deducted || 0);
    acc[key].sales += sales;
    acc[key].gst += gst;
    acc[key].tcs += tcs;
    return acc;
  }, {} as any);

  const monthlyTrendData = Object.values(monthlyTrend).sort((a: any, b: any) =>
    a.month.localeCompare(b.month)
  );

  const exportFilteredAnalyticsCsv = () => {
    const list = filteredInvoices;
    if (!list.length) {
      return;
    }
  
    const headers = [
      "invoice_number",
      "invoice_date",
      "customer_name",
      "total_amount",
      "gst_amount",
      "tcs_deducted",
    ];
  
    const rows = list.map((inv) => {
      const gstAmount =
        Number(inv.sgst_amount || 0) +
        Number(inv.cgst_amount || 0) +
        Number(inv.igst_amount || 0);
      return [
        inv.invoice_number ?? "",
        inv.invoice_date ?? "",
        inv.customer_name ?? "",
        Number(inv.total_amount || 0).toString(),
        gstAmount.toString(),
        Number(inv.tcs_deducted || 0).toString(),
      ];
    });
  
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analytics.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenInvoiceDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDialogOpen(true);
  };

  const handleDownloadInvoicePdf = (invoice: any) => {
    try {
      const doc = new jsPDF();
      const items = (invoice.items || []) as any[];
      const subtotal = Number(invoice.subtotal ?? 0);
      const sgst = Number(invoice.sgst_amount ?? 0);
      const cgst = Number(invoice.cgst_amount ?? 0);
      const igst = Number(invoice.igst_amount ?? 0);
      const discountAmount = Number(invoice.discount_amount ?? 0);
      const tcs = Number(invoice.tcs_deducted ?? 0);
      const totalAmount = Number(invoice.total_amount ?? 0);
      const isInterstate = igst > 0;

      let y = 10;
      doc.setFontSize(16);
      doc.text("Invoice", 10, y);
      y += 8;

      doc.setFontSize(11);
      doc.text(`Invoice No: ${invoice.invoice_number}`, 10, y);
      y += 6;
      doc.text(
        `Date: ${invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : "-"}`,
        10,
        y
      );
      y += 6;

      doc.text(`Bill To: ${invoice.customer_name}`, 10, y);
      y += 6;
      if (invoice.customer_gstin) {
        doc.text(`GSTIN: ${invoice.customer_gstin}`, 10, y);
        y += 6;
      }
      if (invoice.customer_state) {
        doc.text(`State: ${invoice.customer_state}`, 10, y);
        y += 8;
      }

      doc.setFontSize(12);
      doc.text("Items", 10, y);
      y += 6;

      doc.setFontSize(10);
      doc.text("Product", 10, y);
      doc.text("HSN", 60, y);
      doc.text("Qty", 90, y);
      doc.text("Rate", 110, y);
      doc.text("Amount", 140, y);
      y += 4;
      doc.line(10, y, 200, y);
      y += 4;

      items.forEach((item) => {
        const name = item.product_name || "-";
        const hsn = item.hsn_code || "-";
        const qty = Number(item.quantity ?? 0);
        const rate = Number(item.rate ?? 0);
        const amount = Number(item.amount ?? qty * rate);

        doc.text(String(name).slice(0, 30), 10, y);
        doc.text(String(hsn), 60, y);
        doc.text(String(qty), 90, y, { align: "right" });
        doc.text(String(rate.toFixed(2)), 120, y, { align: "right" });
        doc.text(String(amount.toFixed(2)), 160, y, { align: "right" });
        y += 6;
      });

      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      y += 4;
      doc.line(10, y, 200, y);
      y += 6;

      doc.setFontSize(11);
      doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 120, y);
      y += 5;

      if (isInterstate) {
        doc.text(`IGST: ₹${igst.toFixed(2)}`, 120, y);
        y += 5;
      } else {
        doc.text(`CGST: ₹${cgst.toFixed(2)}`, 120, y);
        y += 5;
        doc.text(`SGST: ₹${sgst.toFixed(2)}`, 120, y);
        y += 5;
      }

      if (discountAmount > 0) {
        doc.text(`Discount: -₹${discountAmount.toFixed(2)}`, 120, y);
        y += 5;
      }

      doc.text(`TCS: ₹${tcs.toFixed(2)}`, 120, y);
      y += 5;

      doc.setFontSize(12);
      doc.text(`Total: ₹${totalAmount.toFixed(2)}`, 120, y);

      doc.save(`${invoice.invoice_number || "invoice"}.pdf`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageTour tourId="reports" steps={tourSteps} />
      <div>
        <h1 className="text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">Generate tax and compliance reports</p>
      </div>

      <Card className="p-6 space-y-4" data-tour="reports-filters">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid md:grid-cols-3 gap-4 flex-1">
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

          <div className="flex gap-2 w-full sm:w-auto">
            <Button className="flex-1 sm:flex-none bg-primary hover:bg-primary-hover">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={exportFilteredAnalyticsCsv}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4 md:p-5 bg-muted/40 border-dashed">
        <h2 className="text-sm font-medium mb-2 flex items-center gap-2">
          How these analytics are calculated
        </h2>
        <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
          <p>
            <span className="font-medium">GST</span> = sum of CGST, SGST and IGST amounts on your
            filtered invoices. <span className="font-medium">TCS</span> is taken from the
            <code className="mx-1 rounded bg-background px-1 py-0.5">tcs_deducted</code> field
            on each invoice.
          </p>
          <p>
            <span className="font-medium">Product performance</span> uses the items stored on each
            invoice: sales are the item amounts, and GST is estimated from the item GST rate
            (for example, 18% of line amount for an 18% slab).
          </p>
          <p>
            The <span className="font-medium">CSV export</span> includes one row per filtered
            invoice with these columns:
            <code className="mx-1 rounded bg-background px-1 py-0.5">invoice_number</code>,
            <code className="mx-1 rounded bg-background px-1 py-0.5">invoice_date</code>,
            <code className="mx-1 rounded bg-background px-1 py-0.5">customer_name</code>,
            <code className="mx-1 rounded bg-background px-1 py-0.5">total_amount</code>,
            <code className="mx-1 rounded bg-background px-1 py-0.5">gst_amount</code>, and
            <code className="mx-1 rounded bg-background px-1 py-0.5">tcs_deducted</code>.
          </p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Sales</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹{monthlyStats.totalSales.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedMonth || selectedYear ? "In selected period" : "All time"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total GST</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹{monthlyStats.totalGst.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Collected</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">TCS (1%)</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹{monthlyStats.tcs.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">On marketplace sales</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Invoice</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold">₹{monthlyStats.avgInvoice.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Per invoice</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Revenue, GST &amp; TCS trend</h2>
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrendData} margin={{ left: 8, right: 8 }}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value: any, name: string) => [
                  `₹${Number(value).toFixed(2)}`,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="sales" name="Sales" fill="hsl(var(--primary))" />
              <Bar dataKey="gst" name="GST" fill="hsl(var(--accent))" />
              <Bar dataKey="tcs" name="TCS" fill="hsl(var(--secondary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Product performance (selected period)
        </h2>
        {productPerformance.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No product-level data for the selected period.
          </p>
        ) : (
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productPerformance}
                layout="vertical"
                margin={{ left: 80, right: 16 }}
              >
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    `₹${Number(value).toFixed(2)}`,
                    name,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="sales" name="Sales" fill="hsl(var(--primary))" />
                <Bar dataKey="gst" name="GST" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Invoices in selected period</h2>
        {filteredInvoices.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No invoices match the selected filters.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((inv) => {
              const gstAmount =
                Number(inv.sgst_amount || 0) +
                Number(inv.cgst_amount || 0) +
                Number(inv.igst_amount || 0);
              const tcsAmount = Number(inv.tcs_deducted || 0);
              return (
                <div
                  key={inv.id}
                  className="flex flex-col gap-2 rounded-lg border bg-card px-3 py-2 text-sm md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {inv.invoice_number}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {inv.invoice_date
                          ? new Date(inv.invoice_date).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {inv.customer_name} · Sales ₹{Number(inv.total_amount || 0).toFixed(2)} · GST ₹
                      {gstAmount.toFixed(2)} · TCS ₹{tcsAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1 md:pt-0">
                    <Dialog
                      open={isInvoiceDialogOpen && selectedInvoice?.id === inv.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setIsInvoiceDialogOpen(false);
                          setSelectedInvoice(null);
                        } else {
                          handleOpenInvoiceDetails(inv);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                          <Eye className="mr-1 h-3 w-3" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Invoice {selectedInvoice?.invoice_number}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedInvoice && (
                          <div className="space-y-4 text-sm">
                            <div className="space-y-1">
                              <p className="text-muted-foreground">
                                {selectedInvoice.invoice_date
                                  ? new Date(
                                      selectedInvoice.invoice_date
                                    ).toLocaleDateString()
                                  : "-"}
                              </p>
                              <p>
                                <span className="font-medium">Customer:</span>{" "}
                                {selectedInvoice.customer_name}
                              </p>
                              {selectedInvoice.customer_gstin && (
                                <p>
                                  <span className="font-medium">GSTIN:</span>{" "}
                                  {selectedInvoice.customer_gstin}
                                </p>
                              )}
                            </div>

                            <div>
                              <h3 className="mb-2 text-sm font-medium">Line items</h3>
                              <div className="space-y-2">
                                {(selectedInvoice.items || []).map((item: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col justify-between rounded-md border bg-muted/40 px-2 py-1.5 md:flex-row md:items-center"
                                  >
                                    <div>
                                      <p className="font-medium text-xs md:text-sm">
                                        {item.product_name || "Item"}
                                      </p>
                                      <p className="text-[11px] text-muted-foreground">
                                        HSN {item.hsn_code || "-"} · Qty {item.quantity} · GST {item.gst_rate}
                                      </p>
                                    </div>
                                    <div className="mt-1 text-right text-xs md:text-sm">
                                      <p>₹{Number(item.amount || 0).toFixed(2)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1 text-sm">
                              <p>
                                <span className="font-medium">Subtotal:</span> ₹
                                {Number(selectedInvoice.subtotal || 0).toFixed(2)}
                              </p>
                              <p>
                                <span className="font-medium">GST total:</span> ₹
                                {(
                                  Number(selectedInvoice.sgst_amount || 0) +
                                  Number(selectedInvoice.cgst_amount || 0) +
                                  Number(selectedInvoice.igst_amount || 0)
                                ).toFixed(2)}
                              </p>
                              <p>
                                <span className="font-medium">TCS:</span> ₹
                                {Number(selectedInvoice.tcs_deducted || 0).toFixed(2)}
                              </p>
                              <p>
                                <span className="font-medium">Total:</span> ₹
                                {Number(selectedInvoice.total_amount || 0).toFixed(2)}
                              </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  selectedInvoice && handleDownloadInvoicePdf(selectedInvoice)
                                }
                              >
                                <Download className="mr-1 h-3 w-3" /> PDF
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 md:flex-none"
                      onClick={() => handleDownloadInvoicePdf(inv)}
                    >
                      <Download className="mr-1 h-3 w-3" />
                      PDF
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="font-medium mb-2">Tax Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Sales</p>
                <p className="font-semibold">₹{monthlyStats.totalSales.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">GST Collected</p>
                <p className="font-semibold">₹{monthlyStats.totalGst.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Invoices</p>
                <p className="font-semibold">{monthlyStats.invoiceCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Value</p>
                <p className="font-semibold">₹{monthlyStats.avgInvoice.toFixed(2)}</p>
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
