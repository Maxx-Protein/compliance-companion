import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const MONTHS = [
  "April", "May", "June", "July", "August", "September",
  "October", "November", "December", "January", "February", "March"
];

const GSTFilings = () => {
  const { user } = useAuth();
  const [filings, setFilings] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchFilings();
    }
  }, [user]);

  const fetchFilings = async () => {
    const { data } = await supabase
      .from("gst_filings")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    
    if (data) setFilings(data);
  };

  const getStatusIcon = (filed: boolean, dueDate: string | null) => {
    if (filed) return <CheckCircle2 className="w-5 h-5 text-success" />;
    if (dueDate && new Date(dueDate) < new Date()) return <AlertTriangle className="w-5 h-5 text-destructive" />;
    return <Clock className="w-5 h-5 text-warning" />;
  };

  const getStatusBadge = (filed: boolean, dueDate: string | null) => {
    if (filed) return <Badge className="bg-success">Filed</Badge>;
    if (dueDate && new Date(dueDate) < new Date()) return <Badge variant="destructive">Overdue</Badge>;
    return <Badge variant="outline" className="border-warning text-warning">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">GST Filings</h1>
        <p className="text-muted-foreground">Track and file your GST returns</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">GSTR-1 Filed</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold">{filings.filter(f => f.gstr_1_filed).length}</p>
          <p className="text-xs text-muted-foreground mt-1">Outward supplies</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">GSTR-3B Filed</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <p className="text-2xl font-bold">{filings.filter(f => f.gstr_3b_filed).length}</p>
          <p className="text-xs text-muted-foreground mt-1">Summary return</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pending Filings</span>
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <p className="text-2xl font-bold">
            {filings.filter(f => !f.gstr_1_filed || !f.gstr_3b_filed).length}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Need attention</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">FY 2024-25 Timeline</h2>
        
        {filings.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No filing records yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Filing records will appear as you create invoices and file returns
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filings.map((filing, index) => (
              <Card key={filing.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">{filing.financial_month}</h3>
                      {getStatusBadge(filing.gstr_1_filed && filing.gstr_3b_filed, filing.filing_deadline)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(filing.gstr_1_filed, filing.filing_deadline)}
                          <span className="font-medium">GSTR-1</span>
                          {filing.gstr_1_filed && (
                            <span className="text-xs text-muted-foreground">
                              Filed: {new Date(filing.gstr_1_filed_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground ml-7">
                          Sales: ₹{parseFloat(filing.total_sales || 0).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(filing.gstr_3b_filed, filing.filing_deadline)}
                          <span className="font-medium">GSTR-3B</span>
                          {filing.gstr_3b_filed && (
                            <span className="text-xs text-muted-foreground">
                              Filed: {new Date(filing.gstr_3b_filed_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground ml-7">
                          GST Payable: ₹{parseFloat(filing.net_payable || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {filing.filing_deadline && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Deadline: {new Date(filing.filing_deadline).toLocaleDateString()}
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
    </div>
  );
};

export default GSTFilings;
