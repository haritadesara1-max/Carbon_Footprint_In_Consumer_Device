import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Leaf, BarChart3, Trophy, TreePine, Smartphone, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary))_0%,transparent_50%)] opacity-10"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 animate-pulse-emerald">
              🌱 Track. Reduce. Offset. Repeat.
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-orbitron font-bold text-foreground mb-6 leading-tight">
              Track Your <span className="text-primary">Carbon Footprint</span> from Everyday Devices
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Monitor your digital emissions, gamify sustainable choices, and offset your carbon impact 
              with Carbon Trackr - the future of environmental responsibility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/devices">
                <Button size="lg" className="emerald-glow gradient-bg font-semibold text-lg px-8 py-6">
                  Start Tracking <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/gamify">
                <Button size="lg" variant="outline" className="font-semibold text-lg px-8 py-6 hover:bg-primary/10">
                  Earn Points
                </Button>
              </Link>
              <Link to="/offset">
                <Button size="lg" variant="outline" className="font-semibold text-lg px-8 py-6 hover:bg-primary/10">
                  Offset Carbon
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="carbon-card group">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-orbitron text-xl">Device Tracking</CardTitle>
                <CardDescription>
                  Monitor electricity usage from phones, laptops, TVs, and appliances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Track 5+ device types</span>
                  <Smartphone className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="carbon-card group">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-orbitron text-xl">Gamification</CardTitle>
                <CardDescription>
                  Earn points, unlock badges, and compete on leaderboards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Level up your impact</span>
                  <Zap className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="carbon-card group">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <TreePine className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-orbitron text-xl">Carbon Offset</CardTitle>
                <CardDescription>
                  Plant trees, support renewables, and neutralize your footprint
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Multiple offset options</span>
                  <Leaf className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-foreground mb-8">
            The Hidden Cost of Digital Life
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="space-y-2">
              <div className="text-4xl font-orbitron font-bold text-primary">4%</div>
              <p className="text-muted-foreground">of global emissions from digital tech</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-orbitron font-bold text-primary">70kg</div>
              <p className="text-muted-foreground">average annual digital footprint</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-orbitron font-bold text-primary">8%</div>
              <p className="text-muted-foreground">projected by 2025</p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Every email, stream, and scroll contributes to carbon emissions. Most people don't realize 
            their digital habits impact the environment. Carbon Trackr makes the invisible visible, 
            turning awareness into action.
          </p>
          
          <Link to="/about">
            <Button className="emerald-glow font-semibold">
              Discover the Impact <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-foreground mb-4">
              Simple Steps to Sustainability
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your journey to carbon neutrality with these easy steps
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Track Usage",
                description: "Input your daily device usage hours",
                link: "/devices",
              },
              {
                step: "02", 
                title: "View Impact",
                description: "See your carbon footprint with visual charts",
                link: "/devices",
              },
              {
                step: "03",
                title: "Earn Points",
                description: "Get rewarded for reducing consumption", 
                link: "/gamify",
              },
              {
                step: "04",
                title: "Offset Emissions",
                description: "Neutralize remaining footprint with projects",
                link: "/offset",
              },
            ].map((item, index) => (
              <Link key={index} to={item.link}>
                <Card className="carbon-card h-full group cursor-pointer">
                  <CardHeader>
                    <div className="text-6xl font-orbitron font-bold text-primary/20 group-hover:text-primary/40 transition-colors mb-4">
                      {item.step}
                    </div>
                    <CardTitle className="font-orbitron text-xl group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-foreground mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of users who are already reducing their digital carbon footprint. 
            Start tracking today and be part of the solution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/devices">
              <Button size="lg" className="emerald-glow gradient-bg font-semibold text-lg px-8 py-6">
                Track Your Devices <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/gamify">
              <Button size="lg" variant="outline" className="font-semibold text-lg px-8 py-6 hover:bg-primary/10">
                Start Earning Points
              </Button>
            </Link>
            <Link to="/offset">
              <Button size="lg" variant="outline" className="font-semibold text-lg px-8 py-6 hover:bg-primary/10">
                Offset Your Carbon
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
