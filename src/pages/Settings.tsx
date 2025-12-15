import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Profile state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Seller profile state
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [gstRegDate, setGstRegDate] = useState("");
  const [registeredAddress, setRegisteredAddress] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");

  // Bank details
  const [bankAccount, setBankAccount] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    const [profileRes, sellerRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user?.id).single(),
      supabase.from("seller_profiles").select("*").eq("user_id", user?.id).single()
    ]);

    if (profileRes.data) {
      setFullName(profileRes.data.full_name || "");
      setPhone(profileRes.data.phone || "");
    }

    if (sellerRes.data) {
      setBusinessName(sellerRes.data.business_name || "");
      setGstin(sellerRes.data.gstin || "");
      setPan(sellerRes.data.pan || "");
      setBusinessType(sellerRes.data.business_type || "");
      setGstRegDate(sellerRes.data.gst_registration_date || "");
      setRegisteredAddress(sellerRes.data.registered_address || "");
      setBusinessAddress(sellerRes.data.business_address || "");
      setBankAccount(sellerRes.data.bank_account_number || "");
      setBankIfsc(sellerRes.data.bank_ifsc || "");
    }
  };

  const saveProfile = async () => {
    setLoading(true);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null
      })
      .eq("id", user?.id);

    if (profileError) {
      toast.error("Failed to update profile");
      setLoading(false);
      return;
    }

    // Check if seller profile exists
    const { data: existing } = await supabase
      .from("seller_profiles")
      .select("id")
      .eq("user_id", user?.id)
      .single();

    const sellerData = {
      user_id: user?.id!,
      business_name: businessName || null,
      gstin: gstin || null,
      pan: pan || null,
      business_type: businessType as "sole_proprietor" | "partnership" | "pvt_ltd" | "llp" | null,
      gst_registration_date: gstRegDate || null,
      registered_address: registeredAddress || null,
      business_address: businessAddress || null,
      bank_account_number: bankAccount || null,
      bank_ifsc: bankIfsc || null,
    };

    let error;
    if (existing) {
      const { user_id, ...updateData } = sellerData;
      ({ error } = await supabase
        .from("seller_profiles")
        .update(updateData)
        .eq("user_id", user?.id));
    } else {
      ({ error } = await supabase
        .from("seller_profiles")
        .insert(sellerData));
    }

    setLoading(false);

    if (error) {
      console.error(error);
      toast.error("Failed to update business details");
    } else {
      toast.success("Settings saved successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business Details</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Personal Information</h3>
            
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
            </div>

            <div>
              <Label>Full Name</Label>
              <Input 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rajesh Kumar"
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <Button 
              onClick={saveProfile}
              disabled={loading}
              className="bg-primary hover:bg-primary-hover"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Business Information</h3>
            
            <div>
              <Label>Business Name</Label>
              <Input 
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="ABC Traders"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>GSTIN</Label>
                <Input 
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  placeholder="27AAPFU0055K2ZZ"
                />
              </div>

              <div>
                <Label>PAN</Label>
                <Input 
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  placeholder="AAPFU0055K"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Business Type</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="pvt_ltd">Private Limited</SelectItem>
                    <SelectItem value="llp">LLP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>GST Registration Date</Label>
                <Input 
                  type="date"
                  value={gstRegDate}
                  onChange={(e) => setGstRegDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Registered Address</Label>
              <Textarea 
                value={registeredAddress}
                onChange={(e) => setRegisteredAddress(e.target.value)}
                placeholder="Complete registered business address"
                rows={3}
              />
            </div>

            <div>
              <Label>Business Address</Label>
              <Textarea 
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="Current business address (if different)"
                rows={3}
              />
            </div>

            <Button 
              onClick={saveProfile}
              disabled={loading}
              className="bg-primary hover:bg-primary-hover"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold">Bank Account Details</h3>
            
            <div>
              <Label>Account Number</Label>
              <Input 
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="1234567890"
              />
            </div>

            <div>
              <Label>IFSC Code</Label>
              <Input 
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value)}
                placeholder="SBIN0001234"
              />
            </div>

            <Button 
              onClick={saveProfile}
              disabled={loading}
              className="bg-primary hover:bg-primary-hover"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
