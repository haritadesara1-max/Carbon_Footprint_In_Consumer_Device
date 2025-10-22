import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Wifi, Zap, Lightbulb, Droplets, Recycle, TreePine } from "lucide-react";

const tips = [
  {
    icon: Monitor,
    title: "Use Dark Mode",
    description: "Dark interfaces consume less energy, especially on OLED screens",
    impact: "5-15% energy reduction",
  },
  {
    icon: Smartphone,
    title: "Reduce Screen Brightness",
    description: "Lower brightness significantly reduces battery consumption",
    impact: "20-30% energy savings",
  },
  {
    icon: Wifi,
    title: "Optimize Streaming Quality",
    description: "Lower video quality for casual viewing reduces bandwidth demand",
    impact: "Up to 75% less data",
  },
  {
    icon: Zap,
    title: "Enable Power Saving Mode",
    description: "Use built-in power management features on all devices",
    impact: "10-40% less consumption",
  },
  {
    icon: Lightbulb,
    title: "Unplug Idle Devices",
    description: "Many devices consume phantom power when plugged in",
    impact: "5-10% home energy reduction",
  },
  {
    icon: Droplets,
    title: "Cloud Storage Optimization",
    description: "Clean up unnecessary files and use efficient cloud providers",
    impact: "Reduced server demand",
  },
];

const facts = [
  {
    stat: "4%",
    description: "Global greenhouse gas emissions from digital technology",
  },
  {
    stat: "306M",
    description: "Tons of CO₂ from data centers annually",
  },
  {
    stat: "70kg",
    description: "Average person's annual digital carbon footprint",
  },
  {
    stat: "1.4B",
    description: "Smartphones produced globally each year",
  },
];

const About = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold text-foreground mb-4">
            About Digital Carbon Emissions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Understanding the environmental impact of our digital lives and how to reduce it
          </p>
        </header>

        {/* Key Facts */}
        <section className="mb-16">
          <h2 className="text-2xl font-orbitron font-semibold text-primary mb-8 text-center">
            The Digital Carbon Challenge
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {facts.map((fact, index) => (
              <Card key={index} className="carbon-card text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-orbitron font-bold text-primary mb-2 animate-pulse-emerald">
                    {fact.stat}
                  </div>
                  <p className="text-sm text-muted-foreground">{fact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Problem Explanation */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="font-orbitron text-primary flex items-center gap-2">
                  <Monitor className="h-6 w-6" />
                  The Hidden Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Every digital action - from sending an email to streaming a video - requires energy. 
                  This energy often comes from fossil fuels, contributing to climate change.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="font-medium">Email with attachment:</span>
                    <span className="text-primary font-semibold">50g CO₂</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="font-medium">1 hour HD streaming:</span>
                    <span className="text-primary font-semibold">36g CO₂</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                    <span className="font-medium">Web search:</span>
                    <span className="text-primary font-semibold">0.2g CO₂</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="font-orbitron text-primary flex items-center gap-2">
                  <TreePine className="h-6 w-6" />
                  Why It Matters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Digital emissions are growing rapidly as we become more connected. 
                  By 2025, the tech sector could account for 8% of global emissions.
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-semibold text-primary mb-2">Individual Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      The average person's digital footprint equals driving 1,600km per year
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Collective Power</h4>
                    <p className="text-sm text-muted-foreground">
                      Small changes by millions of users can significantly reduce global emissions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Tips Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-orbitron font-semibold text-primary mb-8 text-center">
            Reduce Your Digital Footprint
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <Card key={index} className="carbon-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-3">{tip.description}</p>
                    <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm font-semibold text-primary">{tip.impact}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="carbon-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-orbitron text-primary flex items-center justify-center gap-2">
                <Recycle className="h-6 w-6" />
                Start Your Journey
              </CardTitle>
              <CardDescription>
                Every action counts in the fight against climate change
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Carbon Trackr helps you understand and reduce your digital footprint. 
                Start tracking today and join thousands of users making a difference.
              </p>
              <div className="space-y-3">
                <Button className="w-full emerald-glow gradient-bg font-semibold text-lg py-6">
                  Track Your Emissions
                </Button>
                <p className="text-xs text-muted-foreground">
                  Join the movement towards sustainable technology use
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;