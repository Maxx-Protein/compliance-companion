import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">ComplianceHub</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Get Started</h1>
        <p className="text-center text-muted-foreground mb-8">
          Authentication coming soon. Cloud is ready for setup!
        </p>
        <div className="space-y-4">
          <Button className="w-full bg-primary hover:bg-primary-hover" disabled>
            Sign Up with Email
          </Button>
          <Button variant="outline" className="w-full" disabled>
            Sign In with Google
          </Button>
        </div>
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
