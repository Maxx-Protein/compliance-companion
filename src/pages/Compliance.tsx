import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, AlertTriangle, Clock, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Compliance = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [complianceItem, setComplianceItem] = useState("");
  const [complianceStatus, setComplianceStatus] = useState("pending");
  const [complianceDate, setComplianceDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user) {
      fetchComplianceItems();
    }
  }, [user]);

  const fetchComplianceItems = async () => {
    const { data } = await supabase
      .from("compliance_checklist")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    
    if (data) setItems(data);
  };

  const resetForm = () => {
    setComplianceItem("");
    setComplianceStatus("pending");
    setComplianceDate("");
    setExpiryDate("");
    setNotes("");
  };

  const saveItem = async () => {
    if (!complianceItem) {
      toast.error("Please enter compliance item name");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("compliance_checklist").insert({
      user_id: user?.id!,
      compliance_item: complianceItem,
      compliance_status: complianceStatus,
      compliance_date: complianceDate || null,
      expiry_date: expiryDate || null,
      notes: notes || null,
    });

    setLoading(false);

    if (error) {
      toast.error("Failed to add item");
    } else {
      toast.success("Compliance item added");
      setIsDialogOpen(false);
      resetForm();
      fetchComplianceItems();
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("compliance_checklist")
      .update({ 
        compliance_status: newStatus,
        compliance_date: newStatus === "completed" ? new Date().toISOString() : null
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
      fetchComplianceItems();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "overdue":
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success">Completed</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "not_applicable":
        return <Badge variant="outline">N/A</Badge>;
      default:
        return <Badge variant="outline" className="border-warning text-warning">Pending</Badge>;
    }
  };

  const completed = items.filter(i => i.compliance_status === "completed").length;
  const pending = items.filter(i => i.compliance_status === "pending").length;
  const overdue = items.filter(i => i.compliance_status === "overdue").length;
  const complianceScore = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Tracker</h1>
          <p className="text-muted-foreground">Track all regulatory requirements</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Compliance Item</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label>Compliance Item *</Label>
                <Input 
                  value={complianceItem}
                  onChange={(e) => setComplianceItem(e.target.value)}
                  placeholder="GST Registration, BIS Certification, etc."
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select value={complianceStatus} onValueChange={setComplianceStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="not_applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Compliance Date</Label>
                <Input 
                  type="date"
                  value={complianceDate}
                  onChange={(e) => setComplianceDate(e.target.value)}
                />
              </div>

              <div>
                <Label>Expiry Date</Label>
                <Input 
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-primary hover:bg-primary-hover"
                  onClick={saveItem}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Add Item"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Compliance Score</span>
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{complianceScore}%</p>
          <p className="text-xs text-success mt-1">
            {complianceScore >= 80 ? "Excellent" : complianceScore >= 60 ? "Good" : "Needs attention"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold">{completed}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pending</span>
            <Clock className="w-5 h-5 text-warning" />
          </div>
          <p className="text-3xl font-bold">{pending}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Overdue</span>
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <p className="text-3xl font-bold">{overdue}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Compliance Checklist</h2>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No compliance items yet</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div 
                key={item.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(item.compliance_status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{item.compliance_item}</h3>
                      {getStatusBadge(item.compliance_status)}
                    </div>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mb-2">{item.notes}</p>
                    )}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {item.compliance_date && (
                        <span>Completed: {new Date(item.compliance_date).toLocaleDateString()}</span>
                      )}
                      {item.expiry_date && (
                        <span>Expires: {new Date(item.expiry_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                {item.compliance_status !== "completed" && (
                  <Button 
                    size="sm"
                    onClick={() => updateStatus(item.id, "completed")}
                  >
                    Mark Complete
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Compliance;
