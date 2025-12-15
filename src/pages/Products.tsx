import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Package as PackageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const GST_RATES = ["0%", "5%", "12%", "18%", "28%"];

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [productName, setProductName] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [gstRate, setGstRate] = useState("18%");
  const [unitPrice, setUnitPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sku, setSku] = useState("");
  const [bisCertified, setBisCertified] = useState(false);
  const [bisCertNumber, setBisCertNumber] = useState("");
  const [bisExpiryDate, setBisExpiryDate] = useState("");

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
    
    if (data) setProducts(data);
  };

  const resetForm = () => {
    setProductName("");
    setHsnCode("");
    setGstRate("18%");
    setUnitPrice("");
    setCategory("");
    setSku("");
    setBisCertified(false);
    setBisCertNumber("");
    setBisExpiryDate("");
    setEditingProduct(null);
  };

  const openDialog = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setProductName(product.product_name);
      setHsnCode(product.hsn_code);
      setGstRate(product.gst_rate);
      setUnitPrice(product.unit_price?.toString() || "");
      setCategory(product.category || "");
      setSku(product.sku || "");
      setBisCertified(product.bis_certified || false);
      setBisCertNumber(product.bis_certificate_number || "");
      setBisExpiryDate(product.bis_expiry_date || "");
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const saveProduct = async () => {
    if (!productName || !hsnCode) {
      toast.error("Please fill required fields");
      return;
    }

    setLoading(true);

    const productData = {
      user_id: user?.id,
      product_name: productName,
      hsn_code: hsnCode,
      gst_rate: gstRate,
      unit_price: unitPrice ? parseFloat(unitPrice) : null,
      category,
      sku,
      bis_certified: bisCertified,
      bis_certificate_number: bisCertified ? bisCertNumber : null,
      bis_expiry_date: bisCertified && bisExpiryDate ? bisExpiryDate : null,
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id));
    } else {
      ({ error } = await supabase
        .from("products")
        .insert(productData));
    }

    setLoading(false);

    if (error) {
      toast.error("Failed to save product");
    } else {
      toast.success(editingProduct ? "Product updated" : "Product added");
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product HSN codes and GST rates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-hover" onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Product Name *</Label>
                  <Input 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Stainless Steel Water Bottle"
                  />
                </div>
                
                <div>
                  <Label>HSN Code *</Label>
                  <Input 
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    placeholder="7323"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    HSN/SAC classification code
                  </p>
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
                  <Label>Unit Price (₹)</Label>
                  <Input 
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="299.00"
                  />
                </div>
                
                <div>
                  <Label>Category</Label>
                  <Input 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Kitchen & Dining"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label>SKU (Optional)</Label>
                  <Input 
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SKU-001"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label>BIS Certification Required</Label>
                    <p className="text-xs text-muted-foreground">
                      Applicable for electronics, toys, etc.
                    </p>
                  </div>
                  <Switch 
                    checked={bisCertified}
                    onCheckedChange={setBisCertified}
                  />
                </div>

                {bisCertified && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>BIS Certificate Number</Label>
                      <Input 
                        value={bisCertNumber}
                        onChange={(e) => setBisCertNumber(e.target.value)}
                        placeholder="R-1234567"
                      />
                    </div>
                    <div>
                      <Label>BIS Expiry Date</Label>
                      <Input 
                        type="date"
                        value={bisExpiryDate}
                        onChange={(e) => setBisExpiryDate(e.target.value)}
                      />
                    </div>
                  </div>
                )}
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
                  onClick={saveProduct}
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingProduct ? "Update" : "Add Product"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <PackageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No products yet. Add your first product!</p>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map(product => (
              <div 
                key={product.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{product.product_name}</h3>
                    <Badge>{product.gst_rate} GST</Badge>
                    {product.bis_certified && (
                      <Badge variant="outline">BIS Certified</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    <div>HSN: {product.hsn_code}</div>
                    {product.unit_price && <div>Price: ₹{product.unit_price}</div>}
                    {product.category && <div>Category: {product.category}</div>}
                    {product.sku && <div>SKU: {product.sku}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => openDialog(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Products;
