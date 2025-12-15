import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const GSTFilings = () => {
  const { user } = useAuth();
  const [filings, setFilings] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingFilings, setLoadingFilings] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  useEffect(() => {
    if (!user) return;

    void Promise.all([fetchFilings(), fetchInvoices()]);
  }, [user]);

  const fetchFilings = async () => {
    if (!user) return;
    setLoadingFilings(true);

    const { data, error } = await supabase
      .from("gst_filings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setFilings(data);
    }

    setLoadingFilings(false);
  };

  const fetchInvoices = async () => {
    if (!user) return;
    setLoadingInvoices(true);

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("invoice_date", { ascending: true });

    if (!error && data) {
      setInvoices(data);
    }

    setLoadingInvoices(false);
  };

  const getStatusIcon = (filed: boolean, dueDate: string | null) => {
    if (filed) return <CheckCircle2 className="w-5 h-5 text-success" />;
    if (dueDate && new Date(dueDate) < new Date()) {
      return <AlertTriangle className="w-5 h-5 text-destructive" />;
    }
    return <Clock className="w-5 h-5 text-warning" />;
  };

  const getStatusBadge = (filed: boolean, dueDate: string | null) => {
    if (filed) return <Badge className="bg-success">Filed</Badge>;
    if (dueDate && new Date(dueDate) < new Date()) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    return (
      <Badge variant="outline" className="border-warning text-warning">
        Pending
      </Badge>
    );
  };

  const gstr1Summary = useMemo(() => {
    if (!invoices.length) {
      return { totalInvoices: 0, taxableValue: 0, totalGst: 0 };
    }

    const totalInvoices = invoices.length;
    let taxableValue = 0;
    let totalGst = 0;

    invoices.forEach((invoice) => {
      taxableValue += Number(invoice.subtotal || 0);
      totalGst +=
        Number(invoice.sgst_amount || 0) +
        Number(invoice.cgst_amount || 0) +
        Number(invoice.igst_amount || 0);
    });

    return { totalInvoices, taxableValue, totalGst };
  }, [invoices]);

  const gstr3bSummary = useMemo(() => {
    if (!filings.length) {
      return { gstLiability: 0, itcClaimed: 0, netPayable: 0 };
    }

    let gstLiability = 0;
    let itcClaimed = 0;
    let netPayable = 0;

    filings.forEach((filing) => {
      gstLiability += Number(filing.gst_liability || 0);
      itcClaimed += Number(filing.itc_claimed || 0);
      netPayable += Number(filing.net_payable || 0);
    });

    return { gstLiability, itcClaimed, netPayable };
  }, [filings]);

  const gstr9Summary = useMemo(() => {
    if (!filings.length) {
      return {
        totalSales: 0,
        totalPurchases: 0,
        totalGstPaid: 0,
        totalTcs: 0,
      };
    }

    let totalSales = 0;
    let totalPurchases = 0;
    let totalGstPaid = 0;
    let totalTcs = 0;

    filings.forEach((filing) => {
      totalSales += Number(filing.total_sales || 0);
      totalPurchases += Number(filing.total_purchases || 0);
      totalGstPaid += Number(filing.gst_liability || 0);
      totalTcs += Number(filing.tcs_liability || 0);
    });

    return { totalSales, totalPurchases, totalGstPaid, totalTcs };
  }, [filings]);

  const isLoading = loadingFilings || loadingInvoices;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">GST Filings</h1>
        <p className="text-muted-foreground">
          Guided assistant to prepare GSTR-1, GSTR-3B and GSTR-9 from your data
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gstr1">GSTR-1</TabsTrigger>
          <TabsTrigger value="gstr3b">GSTR-3B</TabsTrigger>
          <TabsTrigger value="gstr9">GSTR-9</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">GSTR-1 Filed</span>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold">
                {filings.filter((f) => f.gstr_1_filed).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Outward supplies
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">GSTR-3B Filed</span>
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold">
                {filings.filter((f) => f.gstr_3b_filed).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Summary return</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pending Filings</span>
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <p className="text-2xl font-bold">
                {filings.filter((f) => !f.gstr_1_filed || !f.gstr_3b_filed).length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Need attention</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gstr1" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">GSTR-1 Summary</h2>
              <p className="text-sm text-muted-foreground">
                Step 1: Confirm all outward supplies are invoiced in ComplianceHub.
                Step 2: Compare these totals with your marketplace and accounting
                reports.
              </p>
            </div>
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading data…</p>
            ) : !invoices.length ? (
              <p className="text-muted-foreground text-sm">
                No invoices yet. Create invoices to auto-prepare your GSTR-1.
              </p>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total invoices
                  </p>
                  <p className="text-2xl font-semibold">
                    {gstr1Summary.totalInvoices}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Taxable value
                  </p>
                  <p className="text-2xl font-semibold">
                    ₹{gstr1Summary.taxableValue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total GST
                  </p>
                  <p className="text-2xl font-semibold">
                    ₹{gstr1Summary.totalGst.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="gstr3b" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">GSTR-3B Liability</h2>
              <p className="text-sm text-muted-foreground">
                Step 1: Review GST liability vs ITC claimed. Step 2: Confirm the
                net payable matches what you will pay to the department.
              </p>
            </div>
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading data…</p>
            ) : !filings.length ? (
              <p className="text-muted-foreground text-sm">
                No filing records yet. Once you create filings, their liability and
                ITC will appear here.
              </p>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      GST liability
                    </p>
                    <p className="text-2xl font-semibold">
                      ₹{gstr3bSummary.gstLiability.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      ITC claimed
                    </p>
                    <p className="text-2xl font-semibold">
                      ₹{gstr3bSummary.itcClaimed.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Net payable
                    </p>
                    <p className="text-2xl font-semibold">
                      ₹{gstr3bSummary.netPayable.toFixed(2)}
                    </p>
                  </div>
                </div>
                {Math.abs(
                  gstr3bSummary.gstLiability -
                    (gstr3bSummary.itcClaimed + gstr3bSummary.netPayable),
                ) > 1 && (
                  <p className="text-xs text-warning mt-2">
                    * Warning: Liability - ITC does not roughly equal net payable.
                    Recheck your inputs before filing.
                  </p>
                )}
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="gstr9" className="space-y-4">
          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-1">GSTR-9 Annual View</h2>
              <p className="text-sm text-muted-foreground">
                Step 1: Confirm annual totals for sales, purchases, GST and TCS.
                Step 2: Match these values with your books before filing GSTR-9.
              </p>
            </div>
            {isLoading ? (
              <p className="text-muted-foreground text-sm">Loading data…</p>
            ) : !filings.length ? (
              <p className="text-muted-foreground text-sm">
                No filing records yet. Annual roll-up will appear once you have
                monthly filings.
              </p>
            ) : (
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total sales</p>
                  <p className="text-2xl font-semibold">
                    ₹{gstr9Summary.totalSales.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total purchases
                  </p>
                  <p className="text-2xl font-semibold">
                    ₹{gstr9Summary.totalPurchases.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total GST liability
                  </p>
                  <p className="text-2xl font-semibold">
                    ₹{gstr9Summary.totalGstPaid.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total TCS</p>
                  <p className="text-2xl font-semibold">
                    ₹{gstr9Summary.totalTcs.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">FY 2024-25 Timeline</h2>

            {filings.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No filing records yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Filing records will appear as you create invoices and file
                  returns
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filings.map((filing) => (
                  <Card key={filing.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">
                            {filing.financial_month}
                          </h3>
                          {getStatusBadge(
                            Boolean(filing.gstr_1_filed && filing.gstr_3b_filed),
                            filing.filing_deadline,
                          )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(
                                Boolean(filing.gstr_1_filed),
                                filing.filing_deadline,
                              )}
                              <span className="font-medium">GSTR-1</span>
                              {filing.gstr_1_filed && filing.gstr_1_filed_date && (
                                <span className="text-xs text-muted-foreground">
                                  Filed: {" "}
                                  {new Date(
                                    filing.gstr_1_filed_date,
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground ml-7">
                              Sales: ₹
                              {Number(filing.total_sales || 0).toFixed(2)}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              {getStatusIcon(
                                Boolean(filing.gstr_3b_filed),
                                filing.filing_deadline,
                              )}
                              <span className="font-medium">GSTR-3B</span>
                              {filing.gstr_3b_filed && filing.gstr_3b_filed_date && (
                                <span className="text-xs text-muted-foreground">
                                  Filed: {" "}
                                  {new Date(
                                    filing.gstr_3b_filed_date,
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground ml-7">
                              GST Payable: ₹
                              {Number(filing.net_payable || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {filing.filing_deadline && (
                          <p className="text-xs text-muted-foreground mt-3">
                            Deadline: {" "}
                            {new Date(
                              filing.filing_deadline,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      {!filing.gstr_1_filed && (
                        <Button size="sm" className="bg-primary hover:bg-primary-hover">
                          File Now
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold mb-3">Filing Guidelines</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• GSTR-1: File outward supplies by 11th of next month</li>
              <li>• GSTR-3B: File summary return by 20th of next month</li>
              <li>• GSTR-9: Annual return due by 31st December</li>
              <li>• Late filing attracts penalties and interest</li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GSTFilings;

