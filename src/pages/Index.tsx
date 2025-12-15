import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, FileText, Calculator, ClipboardList, TrendingUp, Users, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ComplianceHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-primary hover:bg-primary-hover">Start Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1.5">Trusted by 10,000+ sellers</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            E-commerce Compliance <br />
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            GST filing, invoice management, and tax tracking for Amazon, Flipkart, and Meesho sellers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary-hover px-8">
                Try Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">Schedule Demo</Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Complex GST Rules", desc: "We automate your GST calculations" },
            { title: "Manual Invoicing", desc: "Auto-generate GST-compliant invoices" },
            { title: "Missed Deadlines", desc: "Get alerts for filing deadlines" }
          ].map((item, i) => (
            <Card key={i} className="p-6 border-border/50 hover:border-primary/50 transition-colors">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground">Comprehensive compliance tools in one platform</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { icon: FileText, title: "Invoice Manager", desc: "Create & track GST-compliant invoices" },
            { icon: Calculator, title: "GST Calculator", desc: "Automatic GST calculations with HSN codes" },
            { icon: ClipboardList, title: "Filing Assistant", desc: "Step-by-step GSTR-1, GSTR-3B guides" },
            { icon: CheckCircle2, title: "Compliance Tracker", desc: "BIS, GST, TCS checklist" },
            { icon: TrendingUp, title: "Tax Reports", desc: "Generate profit & loss, GST summaries" },
            { icon: Users, title: "Multi-seller", desc: "Manage multiple marketplace accounts" }
          ].map((feature, i) => (
            <Card key={i} className="p-6 border-border/50 hover:shadow-lg hover:border-primary/30 transition-all">
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">Start free, upgrade when you need more</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8 border-border/50">
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-bold mb-6">₹0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
            <ul className="space-y-3 mb-8">
              {["50 invoices/month", "Basic GST calculator", "1 product category", "Email support"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/auth">
              <Button variant="outline" className="w-full">Start Free</Button>
            </Link>
          </Card>
          <Card className="p-8 border-primary/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <p className="text-4xl font-bold mb-6">₹150<span className="text-lg font-normal text-muted-foreground">/month</span></p>
            <ul className="space-y-3 mb-8">
              {["Unlimited invoices", "Advanced GST calculator", "Unlimited products", "Compliance tracker", "Filing assistant", "Priority support"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/auth">
              <Button className="w-full bg-primary hover:bg-primary-hover">Get Premium</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Sellers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Rajesh Kumar", business: "Electronics on Amazon", quote: "Saved ₹20K on GST penalties", rating: 5 },
            { name: "Priya Sharma", business: "Fashion on Flipkart", quote: "File returns in just 5 minutes", rating: 5 },
            { name: "Amit Patel", business: "Home Goods on Meesho", quote: "Best compliance tool I've used", rating: 5 }
          ].map((testimonial, i) => (
            <Card key={i} className="p-6 border-border/50">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm mb-4 italic">"{testimonial.quote}"</p>
              <p className="font-semibold text-sm">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.business}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">ComplianceHub</span>
              </div>
              <p className="text-sm text-muted-foreground">Making compliance simple for Indian e-commerce sellers</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 ComplianceHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
