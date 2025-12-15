import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator as CalcIcon, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GST_RATES = ["0%", "5%", "12%", "18%", "28%"];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const Calculator = () => {
  // GST Calculator
  const [gstAmount, setGstAmount] = useState("");
  const [gstRate, setGstRate] = useState("18%");
  const [sellerState, setSellerState] = useState("");
  const [customerState, setCustomerState] = useState("");

  // TCS Calculator
  const [saleAmount, setSaleAmount] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  // ITC Calculator
  const [gstCollected, setGstCollected] = useState("");
  const [gstPaid, setGstPaid] = useState("");
  const [blockedItc, setBlockedItc] = useState("");

  // P&L Calculator
  const [grossSales, setGrossSales] = useState("");
  const [cogs, setCogs] = useState("");
  const [opex, setOpex] = useState("");
  const [gstAmount2, setGstAmount2] = useState("");
  const [discount, setDiscount] = useState("");

  const calculateGST = () => {
    const amount = parseFloat(gstAmount) || 0;
    const rate = parseFloat(gstRate) / 100;
    const isInterstate = sellerState && customerState && sellerState !== customerState;
    
    const gstValue = amount * rate;
    const totalAmount = amount + gstValue;

    return {
      baseAmount: amount,
      gstValue,
      cgst: isInterstate ? 0 : gstValue / 2,
      sgst: isInterstate ? 0 : gstValue / 2,
      igst: isInterstate ? gstValue : 0,
      totalAmount,
      isInterstate
    };
  };

  const calculateTCS = () => {
    const amount = parseFloat(saleAmount) || 0;
    const tcsRate = isOnline ? 0.01 : 0; // 1% for online sales
    const tcsAmount = amount * tcsRate;
    
    return {
      saleAmount: amount,
      tcsRate: tcsRate * 100,
      tcsAmount,
      netAmount: amount - tcsAmount
    };
  };

  const calculateITC = () => {
    const collected = parseFloat(gstCollected) || 0;
    const paid = parseFloat(gstPaid) || 0;
    const blocked = parseFloat(blockedItc) || 0;
    
    const eligibleItc = paid - blocked;
    const netGst = collected - eligibleItc;

    return {
      gstCollected: collected,
      gstPaid: paid,
      blockedItc: blocked,
      eligibleItc,
      netGstPayable: Math.max(0, netGst)
    };
  };

  const calculatePL = () => {
    const sales = parseFloat(grossSales) || 0;
    const costOfGoods = parseFloat(cogs) || 0;
    const expenses = parseFloat(opex) || 0;
    const gst = parseFloat(gstAmount2) || 0;
    const disc = parseFloat(discount) || 0;

    const grossProfit = sales - costOfGoods;
    const operatingProfit = grossProfit - expenses;
    const netProfit = operatingProfit - gst - disc;

    return {
      grossSales: sales,
      cogs: costOfGoods,
      grossProfit,
      opex: expenses,
      operatingProfit,
      gst,
      discount: disc,
      netProfit
    };
  };

  const copyValue = (value: number) => {
    navigator.clipboard.writeText(value.toFixed(2));
    toast.success("Copied to clipboard");
  };

  const gst = calculateGST();
  const tcs = calculateTCS();
  const itc = calculateITC();
  const pl = calculatePL();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Tax Calculator</h1>
        <p className="text-muted-foreground">Calculate GST, TCS, ITC, and profitability</p>
      </div>

      <Tabs defaultValue="gst">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gst">GST Calculator</TabsTrigger>
          <TabsTrigger value="tcs">TCS Calculator</TabsTrigger>
          <TabsTrigger value="itc">ITC Calculator</TabsTrigger>
          <TabsTrigger value="pl">P&L Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="gst" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold mb-4">Input Details</h3>
              
              <div>
                <Label>Base Amount (₹) *</Label>
                <Input 
                  type="number"
                  value={gstAmount}
                  onChange={(e) => setGstAmount(e.target.value)}
                  placeholder="10000"
                />
              </div>

              <div>
                <Label>GST Rate *</Label>
                <Select value={gstRate} onValueChange={setGstRate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GST_RATES.map(rate => (
                      <SelectItem key={rate} value={rate}>{rate}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Seller State</Label>
                <Select value={sellerState} onValueChange={setSellerState}>
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

              <div>
                <Label>Customer State</Label>
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
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Calculation Result</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Base Amount</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">₹{gst.baseAmount.toFixed(2)}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyValue(gst.baseAmount)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {gst.isInterstate ? (
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                    <span className="text-sm text-muted-foreground">IGST ({gstRate})</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">₹{gst.igst.toFixed(2)}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyValue(gst.igst)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">CGST ({parseFloat(gstRate) / 2}%)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">₹{gst.cgst.toFixed(2)}</span>
                        <Button size="sm" variant="ghost" onClick={() => copyValue(gst.cgst)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                      <span className="text-sm text-muted-foreground">SGST ({parseFloat(gstRate) / 2}%)</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">₹{gst.sgst.toFixed(2)}</span>
                        <Button size="sm" variant="ghost" onClick={() => copyValue(gst.sgst)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Total GST</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">₹{gst.gstValue.toFixed(2)}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyValue(gst.gstValue)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">₹{gst.totalAmount.toFixed(2)}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyValue(gst.totalAmount)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                  {gst.isInterstate 
                    ? "Interstate supply - IGST applicable" 
                    : "Intrastate supply - CGST + SGST applicable"
                  }
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tcs" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold mb-4">Input Details</h3>
              
              <div>
                <Label>Sale Amount (₹) *</Label>
                <Input 
                  type="number"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  placeholder="50000"
                />
              </div>

              <div>
                <Label>Sale Type</Label>
                <Select value={isOnline ? "online" : "offline"} onValueChange={(val) => setIsOnline(val === "online")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online (E-commerce)</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  TCS @ 1% applicable for online e-commerce sales
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">TCS Calculation</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Sale Amount</span>
                  <span className="font-medium">₹{tcs.saleAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">TCS Rate</span>
                  <span className="font-medium">{tcs.tcsRate}%</span>
                </div>

                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">TCS Amount</span>
                  <span className="font-medium text-warning">₹{tcs.tcsAmount.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Net Amount (After TCS)</span>
                  <span className="text-2xl font-bold text-primary">₹{tcs.netAmount.toFixed(2)}</span>
                </div>

                <p className="text-xs text-muted-foreground pt-2">
                  {isOnline 
                    ? "1% TCS deducted for e-commerce sales" 
                    : "No TCS applicable for offline sales"
                  }
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="itc" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold mb-4">Input Details</h3>
              
              <div>
                <Label>Total GST Collected (₹) *</Label>
                <Input 
                  type="number"
                  value={gstCollected}
                  onChange={(e) => setGstCollected(e.target.value)}
                  placeholder="18000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  GST collected from customers
                </p>
              </div>

              <div>
                <Label>Total GST Paid on Purchases (₹) *</Label>
                <Input 
                  type="number"
                  value={gstPaid}
                  onChange={(e) => setGstPaid(e.target.value)}
                  placeholder="12000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  GST paid to suppliers
                </p>
              </div>

              <div>
                <Label>Blocked ITC (₹)</Label>
                <Input 
                  type="number"
                  value={blockedItc}
                  onChange={(e) => setBlockedItc(e.target.value)}
                  placeholder="1000"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ITC not eligible for claim
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">ITC Calculation</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">GST Collected</span>
                  <span className="font-medium">₹{itc.gstCollected.toFixed(2)}</span>
                </div>

                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">GST Paid</span>
                  <span className="font-medium">₹{itc.gstPaid.toFixed(2)}</span>
                </div>

                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Blocked ITC</span>
                  <span className="font-medium text-destructive">₹{itc.blockedItc.toFixed(2)}</span>
                </div>

                <div className="flex justify-between p-3 bg-success/10 rounded">
                  <span className="text-sm text-muted-foreground">Eligible ITC</span>
                  <span className="font-medium text-success">₹{itc.eligibleItc.toFixed(2)}</span>
                </div>

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Net GST Payable</span>
                  <span className="text-2xl font-bold text-primary">₹{itc.netGstPayable.toFixed(2)}</span>
                </div>

                {itc.eligibleItc > itc.gstCollected && (
                  <p className="text-xs text-warning">
                    * Warning: Eligible ITC is higher than GST collected. Double-check
                    your inputs before relying on this figure.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pl" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-semibold mb-4">Input Details</h3>
              
              <div>
                <Label>Gross Sales (₹) *</Label>
                <Input 
                  type="number"
                  value={grossSales}
                  onChange={(e) => setGrossSales(e.target.value)}
                  placeholder="100000"
                />
              </div>

              <div>
                <Label>Cost of Goods Sold (₹) *</Label>
                <Input 
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                  placeholder="60000"
                />
              </div>

              <div>
                <Label>Operating Expenses (₹) *</Label>
                <Input 
                  type="number"
                  value={opex}
                  onChange={(e) => setOpex(e.target.value)}
                  placeholder="15000"
                />
              </div>

              <div>
                <Label>GST Amount (₹)</Label>
                <Input 
                  type="number"
                  value={gstAmount2}
                  onChange={(e) => setGstAmount2(e.target.value)}
                  placeholder="5000"
                />
              </div>

              <div>
                <Label>Discount Given (₹)</Label>
                <Input 
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="2000"
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Profit & Loss Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Gross Sales</span>
                  <span className="font-medium">₹{pl.grossSales.toFixed(2)}</span>
                </div>

                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Cost of Goods Sold</span>
                  <span className="font-medium text-destructive">-₹{pl.cogs.toFixed(2)}</span>
                </div>

                <div className="flex justify-between p-3 bg-success/10 rounded">
                  <span className="text-sm font-medium">Gross Profit</span>
                  <span className="font-semibold text-success">₹{pl.grossProfit.toFixed(2)}</span>
                </div>

                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Operating Expenses</span>
                  <span className="font-medium text-destructive">-₹{pl.opex.toFixed(2)}</span>
                </div>

                <div className="flex justify-between p-3 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">GST</span>
                  <span className="font-medium text-destructive">-₹{pl.gst.toFixed(2)}</span>
                </div>

                {pl.discount > 0 && (
                  <div className="flex justify-between p-3 bg-muted/30 rounded">
                    <span className="text-sm text-muted-foreground">Discount</span>
                    <span className="font-medium text-destructive">-₹{pl.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Net Profit</span>
                  <span className={`text-2xl font-bold ${pl.netProfit >= 0 ? "text-success" : "text-destructive"}`}>
                    ₹{pl.netProfit.toFixed(2)}
                  </span>
                </div>

                {pl.grossSales > 0 && Math.abs(pl.netProfit) > pl.grossSales && (
                  <p className="text-xs text-warning">
                    * Warning: Net profit magnitude is higher than gross sales.
                    Double-check your inputs for errors.
                  </p>
                )}

                <p className="text-xs text-muted-foreground pt-2">
                  Profit margin: {pl.grossSales > 0 ? ((pl.netProfit / pl.grossSales) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Calculator;
