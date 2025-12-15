import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const Subscription = () => {
  const { user } = useAuth();
  const [sellerProfile, setSellerProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("seller_profiles")
      .select("*")
      .eq("user_id", user?.id)
      .single();
    
    if (data) setSellerProfile(data);
  };

  const currentPlan = sellerProfile?.subscription_status || "free";
  const isActive = sellerProfile?.subscription_active || false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Subscription</h1>
        <p className="text-muted-foreground">Manage your plan and billing</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {currentPlan === "free" ? "Free Plan" : "Premium Plan"}
            </h2>
            <p className="text-muted-foreground">
              {currentPlan === "free" 
                ? "Limited features - upgrade to unlock everything" 
                : "All features unlocked"}
            </p>
          </div>
          {isActive && (
            <Badge className="bg-success">Active</Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Free Plan</h3>
              {currentPlan === "free" && <Badge variant="outline">Current</Badge>}
            </div>
            <p className="text-3xl font-bold mb-4">₹0<span className="text-sm text-muted-foreground">/month</span></p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                50 invoices/month
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Basic GST calculator
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                1 product category
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Email support
              </li>
            </ul>
            {currentPlan !== "free" && (
              <Button variant="outline" className="w-full" disabled>
                Downgrade
              </Button>
            )}
          </div>

          <div className="p-4 border-2 border-primary rounded-lg bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Premium Plan</h3>
              {currentPlan !== "free" && <Badge className="bg-primary">Current</Badge>}
            </div>
            <p className="text-3xl font-bold mb-1">₹150<span className="text-sm text-muted-foreground">/month</span></p>
            <p className="text-sm text-muted-foreground mb-4">or ₹1,499/year (save ₹300)</p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Unlimited invoices
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Advanced GST calculator
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Unlimited products
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Compliance tracker
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Filing assistant
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Tax reports (PDF export)
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Multi-account support
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Priority support
              </li>
            </ul>
            {currentPlan === "free" ? (
              <Button className="w-full bg-primary hover:bg-primary-hover">
                <CreditCard className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            )}
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-2">Payment Integration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Razorpay integration for subscription payments will be set up to enable seamless monthly or annual billing.
          </p>
          <p className="text-xs text-muted-foreground">
            All plans include 18% GST. Secure payments powered by Razorpay.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Subscription;
