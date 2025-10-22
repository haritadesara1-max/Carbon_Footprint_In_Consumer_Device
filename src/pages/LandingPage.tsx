import { Link, useNavigate } from "react-router-dom";
import { Leaf, Shield, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="inline-flex items-center space-x-3 mb-8">
            <div className="p-4 rounded-full bg-primary/10 emerald-glow">
              <Leaf className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-foreground">
              Carbon Trackr
            </h1>
          </div>

          {/* Hero Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
              Track Your Carbon Footprint
              <span className="block text-primary">Make a Difference</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of environmentally conscious individuals monitoring their carbon emissions, 
              discovering eco-friendly alternatives, and contributing to a sustainable future.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="emerald-glow gradient-bg font-semibold px-8 py-3">
              <Link to="/auth">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Carbon Trackr?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our comprehensive platform helps you understand and reduce your environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="carbon-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-primary/10 emerald-glow w-fit">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Monitor your daily activities and automatically calculate your carbon emissions 
                  with our intelligent tracking system.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="carbon-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-primary/10 emerald-glow w-fit">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Offset Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Compensate for your carbon footprint through verified offset programs 
                  and environmental initiatives.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="carbon-card text-center">
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-primary/10 emerald-glow w-fit">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Community Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Join a community of eco-warriors and compete in challenges to 
                  maximize your positive environmental impact.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-orbitron font-bold text-xl text-foreground">
              Carbon Trackr
            </span>
          </div>
          <p className="text-muted-foreground">
            Making sustainability accessible for everyone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;