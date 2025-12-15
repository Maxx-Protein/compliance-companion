import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Download, FileText, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jsPDF } from "jspdf";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const GST_RATES = ["0%", "5%", "12%", "18%", "28%"];

interface InvoiceItem {
  product_name: string;
  hsn_code: string;
  quantity: number;
  rate: number;
  gst_rate: string;
  amount: number;
}

const Invoices = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("create");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [sellerState, setSellerState] = useState("");
  const [loading, setLoading] = useState(false);
  const invoicesFileInputRef = useRef<HTMLInputElement | null>(null);

  // Invoice form state
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerGstin, setCustomerGstin] = useState("");
  const [customerState, setCustomerState] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([{
    product_name: "",
    hsn_code: "",
    quantity: 1,
    rate: 0,
    gst_rate: "18%",
    amount: 0
  }]);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (user) {
      fetchInvoices();
      fetchProducts();
      fetchSellerProfile();
      generateInvoiceNumber();
    }
  }, [user]);

  const fetchSellerProfile = async () => {
    const { data } = await supabase
      .from("seller_profiles")
      .select("registered_address")
      .eq("user_id", user?.id)
      .single();
    
    if (data?.registered_address) {
      const stateMatch = INDIAN_STATES.find(state => 
        data.registered_address.toLowerCase().includes(state.toLowerCase())
      );
      if (stateMatch) setSellerState(stateMatch);
    }
  };

  const generateInvoiceNumber = async () => {
    const { count } = await supabase
      .from("invoices")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user?.id);
    
    setInvoiceNumber(`INV-${String((count || 0) + 1).padStart(4, "0")}`);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user?.id);
    
    if (data) setProducts(data);
  };

  const fetchInvoices = async () => {
    const { data } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    
    if (data) setInvoices(data);
  };

  const addItem = () => {
    setItems([...items, {
      product_name: "",
      hsn_code: "",
      quantity: 1,
      rate: 0,
      gst_rate: "18%",
      amount: 0
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate amount
    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setItems(newItems);
  };

  const selectProduct = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      updateItem(index, "product_name", product.product_name);
      updateItem(index, "hsn_code", product.hsn_code);
      updateItem(index, "gst_rate", product.gst_rate);
      updateItem(index, "rate", product.unit_price || 0);
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const isInterstate = customerState && sellerState && customerState !== sellerState;
    
    let sgst = 0, cgst = 0, igst = 0;
    
    items.forEach(item => {
      const gstPercent = parseFloat(item.gst_rate) / 100;
      const itemGst = item.amount * gstPercent;
      
      if (isInterstate) {
        igst += itemGst;
      } else {
        sgst += itemGst / 2;
        cgst += itemGst / 2;
      }
    });

    const tcs = subtotal * 0.01; // 1% TCS for e-commerce
    const total = subtotal + sgst + cgst + igst - discount;

    return { subtotal, sgst, cgst, igst, tcs, total, isInterstate };
  };

  const saveInvoice = async (status: "draft" | "issued") => {
    if (!customerName || !customerState || items.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const totals = calculateTotals();

    const { error } = await supabase.from("invoices").insert({
      user_id: user?.id!,
      invoice_number: invoiceNumber,
      customer_name: customerName,
      customer_gstin: customerGstin || null,
      customer_state: customerState,
      items: items as any,
      subtotal: totals.subtotal,
      sgst_amount: totals.sgst,
      cgst_amount: totals.cgst,
      igst_amount: totals.igst,
      discount_amount: discount,
      total_amount: totals.total,
      tcs_deducted: totals.tcs,
      place_of_supply: customerState,
      invoice_status: status,
      payment_status: "unpaid",
      notes: notes || null,
      issued_at: status === "issued" ? new Date().toISOString() : null
    });

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Failed to save invoice");
    } else {
      toast.success(status === "draft" ? "Invoice saved as draft" : "Invoice issued successfully");
      setActiveTab("library");
      fetchInvoices();
      resetForm();
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerGstin("");
    setCustomerState("");
    setItems([
      {
        product_name: "",
        hsn_code: "",
        quantity: 1,
        rate: 0,
        gst_rate: "18%",
        amount: 0,
      },
    ]);
    setDiscount(0);
    setNotes("");
    generateInvoiceNumber();
  };

  const totals = calculateTotals();

  const invoicesCsvHeaders = [
    "invoice_number",
    "customer_name",
    "customer_gstin",
    "customer_state",
    "invoice_date",
    "subtotal",
    "sgst_amount",
    "cgst_amount",
    "igst_amount",
    "discount_amount",
    "tcs_deducted",
    "total_amount",
    "place_of_supply",
    "notes",
  ];

  const exportInvoicesCsv = () => {
    if (!invoices.length) {
      toast.error("No invoices to export");
      return;
    }

    const rows = invoices.map((inv) => [
      inv.invoice_number ?? "",
      inv.customer_name ?? "",
      inv.customer_gstin ?? "",
      inv.customer_state ?? "",
      inv.invoice_date ?? "",
      inv.subtotal ?? "",
      inv.sgst_amount ?? "",
      inv.cgst_amount ?? "",
      inv.igst_amount ?? "",
      inv.discount_amount ?? "",
      inv.tcs_deducted ?? "",
      inv.total_amount ?? "",
      inv.place_of_supply ?? "",
      (inv.notes ?? "").toString().replace(/\n/g, " "),
    ]);

    const csv = [
      invoicesCsvHeaders.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleInvoicesFileClick = () => {
    invoicesFileInputRef.current?.click();
  };

  const handleImportInvoicesCsv = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const text = String(reader.result ?? "");
        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);

        if (!lines.length) {
          toast.error("CSV file is empty");
          return;
        }

        const header = lines[0]
          .split(",")
          .map((h) => h.trim().toLowerCase());

        const required = ["invoice_number", "customer_name", "customer_state"];
        const missing = required.filter((h) => !header.includes(h));
        if (missing.length) {
          toast.error(
            `Missing required columns: ${missing.join(", ")}`
          );
          return;
        }

        const get = (cols: string[], name: string, values: string[]) => {
          const idx = cols.indexOf(name);
          return idx >= 0 ? values[idx]?.trim() ?? "" : "";
        };

        const records = lines.slice(1).map((line) => {
          const values = line.split(",");
          const customer_state =
            get(header, "customer_state", values) || "";
          const place_of_supply =
            get(header, "place_of_supply", values) || customer_state;

          return {
            user_id: user?.id,
            invoice_number: get(header, "invoice_number", values),
            customer_name: get(header, "customer_name", values),
            customer_gstin: get(header, "customer_gstin", values) || null,
            customer_state,
            invoice_date: get(header, "invoice_date", values) || undefined,
            subtotal: Number(
              get(header, "subtotal", values) || "0"
            ),
            sgst_amount: Number(
              get(header, "sgst_amount", values) || "0"
            ),
            cgst_amount: Number(
              get(header, "cgst_amount", values) || "0"
            ),
            igst_amount: Number(
              get(header, "igst_amount", values) || "0"
            ),
            discount_amount: Number(
              get(header, "discount_amount", values) || "0"
            ),
            tcs_deducted: Number(
              get(header, "tcs_deducted", values) || "0"
            ),
            total_amount: Number(
              get(header, "total_amount", values) || "0"
            ),
            place_of_supply,
            notes: get(header, "notes", values) || null,
            invoice_status: "issued",
            payment_status: "unpaid",
          };
        });

        const validRecords = records.filter(
          (r) => r.invoice_number && r.customer_name && r.customer_state
        );

        if (!validRecords.length) {
          toast.error("No valid rows found in CSV");
          return;
        }

        const { error } = await supabase
          .from("invoices")
          .insert(validRecords);

        if (error) {
          console.error(error);
          toast.error("Failed to import invoices");
        } else {
          toast.success("Invoices imported successfully");
          fetchInvoices();
        }
      } catch (err) {
        console.error(err);
        toast.error("Error reading CSV file");
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file);
  };

  const handleDownloadPdf = (invoice: any) => {
    try {
      const doc = new jsPDF();

      const items = (invoice.items || []) as any[];
      const isInterstate =
        invoice.place_of_supply &&
        sellerState &&
        invoice.place_of_supply !== sellerState;
      const subtotal = Number(invoice.subtotal ?? 0);
      const sgst = Number(invoice.sgst_amount ?? 0);
      const cgst = Number(invoice.cgst_amount ?? 0);
      const igst = Number(invoice.igst_amount ?? 0);
      const discountAmount = Number(invoice.discount_amount ?? 0);
      const tcs = Number(invoice.tcs_deducted ?? 0);
      const totalAmount = Number(invoice.total_amount ?? 0);

      let y = 10;
      doc.setFontSize(16);
      doc.text("Invoice", 10, y);
      y += 8;

      doc.setFontSize(11);
      doc.text(`Invoice No: ${invoice.invoice_number}`, 10, y);
      y += 6;
      doc.text(`Date: ${invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : "-"}`, 10, y);
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

      doc.text(`TCS (1%): ₹${tcs.toFixed(2)}`, 120, y);
      y += 5;

      doc.setFontSize(12);
      doc.text(`Total: ₹${totalAmount.toFixed(2)}`, 120, y);
      y += 8;

      if (invoice.notes) {
        doc.setFontSize(10);
        doc.text("Notes:", 10, y);
        y += 5;
        const splitNotes = doc.splitTextToSize(String(invoice.notes), 180);
        doc.text(splitNotes, 10, y);
      }

      doc.save(`${invoice.invoice_number || "invoice"}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Invoices</h1>
          <p className="text-muted-foreground">Create and manage GST-compliant invoices</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create">Create Invoice</TabsTrigger>
          <TabsTrigger value="library">Invoice Library ({invoices.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Invoice Details</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Invoice Number</Label>
                    <Input value={invoiceNumber} disabled />
                  </div>
                  <div>
                    <Label>Customer Name *</Label>
                    <Input 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Customer GSTIN (Optional)</Label>
                    <Input 
                      value={customerGstin}
                      onChange={(e) => setCustomerGstin(e.target.value)}
                      placeholder="27AAPFU0055K2ZZ"
                    />
                  </div>
                  <div>
                    <Label>Customer State *</Label>
                    <Select value={customerState} onValueChange={setCustomerState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Items</h3>
                  <Button size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4 mr-1" /> Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <Card key={index} className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Product</Label>
                              {products.length > 0 ? (
                                <Select onValueChange={(val) => selectProduct(index, val)}>
                                  <SelectTrigger className="h-9">
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {products.map(p => (
                                      <SelectItem key={p.id} value={p.id}>{p.product_name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Input 
                                  className="h-9"
                                  value={item.product_name}
                                  onChange={(e) => updateItem(index, "product_name", e.target.value)}
                                  placeholder="Product"
                                />
                              )}
                            </div>
                            <div>
                              <Label className="text-xs">HSN Code</Label>
                              <Input 
                                className="h-9"
                                value={item.hsn_code}
                                onChange={(e) => updateItem(index, "hsn_code", e.target.value)}
                                placeholder="8544"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <Label className="text-xs">Qty</Label>
                              <Input 
                                className="h-9"
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Rate (₹)</Label>
                              <Input 
                                className="h-9"
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(index, "rate", parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">GST</Label>
                              <Select 
                                value={item.gst_rate}
                                onValueChange={(val) => updateItem(index, "gst_rate", val)}
                              >
                                <SelectTrigger className="h-9">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {GST_RATES.map(rate => (
                                    <SelectItem key={rate} value={rate}>{rate}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            Amount: ₹{item.amount.toFixed(2)}
                          </div>
                        </div>
                        {items.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeItem(index)}
                            className="ml-2"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Discount (₹)</Label>
                  <Input 
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Payment terms, delivery notes, etc."
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Invoice Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
                </div>
                
                {totals.isInterstate ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IGST</span>
                    <span className="font-medium">₹{totals.igst.toFixed(2)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CGST</span>
                      <span className="font-medium">₹{totals.cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">SGST</span>
                      <span className="font-medium">₹{totals.sgst.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="font-medium text-destructive">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">TCS (1%)</span>
                  <span className="font-medium">₹{totals.tcs.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">₹{totals.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  {totals.isInterstate 
                    ? "Interstate supply - IGST applicable"
                    : "Intrastate supply - CGST + SGST applicable"
                  }
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => saveInvoice("draft")}
                    disabled={loading}
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary-hover"
                    onClick={() => saveInvoice("issued")}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Issue Invoice"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library">
          <Card className="p-6">
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No invoices yet. Create your first invoice!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold">{invoice.invoice_number}</span>
                        <Badge variant={invoice.invoice_status === "issued" ? "default" : "secondary"}>
                          {invoice.invoice_status}
                        </Badge>
                        <Badge variant={invoice.payment_status === "paid" ? "default" : "outline"}>
                          {invoice.payment_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {invoice.customer_name} • {new Date(invoice.invoice_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          ₹{parseFloat(invoice.total_amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          GST: ₹
                          {(
                            parseFloat(invoice.sgst_amount) +
                            parseFloat(invoice.cgst_amount) +
                            parseFloat(invoice.igst_amount)
                          ).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleDownloadPdf(invoice)}
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Invoices;
