import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { TreePine, Wind, Sun, Droplets } from "lucide-react";

const offsetOptions = [
  {
    id: "trees",
    name: "Tree Planting",
    icon: TreePine,
    co2PerUnit: 21.77, // kg CO2 per tree per year
    cost: 5, // USD per tree
    unit: "trees",
    description: "Plant native trees to absorb CO₂ from the atmosphere",
  },
  {
    id: "wind",
    name: "Wind Energy",
    icon: Wind,
    co2PerUnit: 1000, // kg CO2 per MWh
    cost: 30, // USD per MWh
    unit: "MWh",
    description: "Support renewable wind energy projects",
  },
  {
    id: "solar",
    name: "Solar Power",
    icon: Sun,
    co2PerUnit: 800, // kg CO2 per MWh
    cost: 25, // USD per MWh
    unit: "MWh",
    description: "Fund solar panel installations worldwide",
  },
  {
    id: "water",
    name: "Clean Water",
    icon: Droplets,
    co2PerUnit: 50, // kg CO2 per person per year
    cost: 20, // USD per person per year
    unit: "people",
    description: "Provide clean water access reducing deforestation",
  },
];

const Offset = () => {
  const [targetEmissions, setTargetEmissions] = useState<number>(0);
  const [selectedOffsets, setSelectedOffsets] = useState<Record<string, number>>({});

  const totalOffset = Object.entries(selectedOffsets).reduce((total, [id, quantity]) => {
    const option = offsetOptions.find(opt => opt.id === id);
    return total + (option ? option.co2PerUnit * quantity : 0);
  }, 0);

  const totalCost = Object.entries(selectedOffsets).reduce((total, [id, quantity]) => {
    const option = offsetOptions.find(opt => opt.id === id);
    return total + (option ? option.cost * quantity : 0);
  }, 0);

  const offsetPercentage = targetEmissions > 0 ? Math.min((totalOffset / targetEmissions) * 100, 100) : 0;

  const handleOffsetChange = (optionId: string, quantity: number) => {
    setSelectedOffsets(prev => ({
      ...prev,
      [optionId]: Math.max(0, quantity),
    }));
  };

  const suggestedQuantities = (co2Amount: number) => {
    return offsetOptions.map(option => ({
      ...option,
      suggested: Math.ceil(co2Amount / option.co2PerUnit),
    }));
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold text-foreground mb-4">
            Carbon Offset Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Neutralize your carbon footprint by supporting environmental projects
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="font-orbitron text-primary">Your Emissions</CardTitle>
                <CardDescription>Enter your monthly CO₂ emissions to calculate offsets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="Enter CO₂ emissions"
                    value={targetEmissions || ""}
                    onChange={(e) => setTargetEmissions(parseFloat(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground font-medium">kg CO₂/month</span>
                </div>
                {targetEmissions > 0 && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-center text-primary font-semibold">
                      Target: {targetEmissions} kg CO₂ to offset monthly
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Offset Options */}
            <div className="grid md:grid-cols-2 gap-6">
              {suggestedQuantities(targetEmissions).map((option) => {
                const Icon = option.icon;
                const currentQuantity = selectedOffsets[option.id] || 0;
                const offsetAmount = option.co2PerUnit * currentQuantity;
                const cost = option.cost * currentQuantity;

                return (
                  <Card key={option.id} className="carbon-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {option.name}
                      </CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Offsets per {option.unit}:</span>
                        <span className="font-semibold">{option.co2PerUnit} kg CO₂</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Cost per {option.unit}:</span>
                        <span className="font-semibold text-primary">${option.cost}</span>
                      </div>
                      
                      {targetEmissions > 0 && (
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-2">
                            Suggested: {option.suggested} {option.unit}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOffsetChange(option.id, option.suggested)}
                            className="w-full"
                          >
                            Use Suggestion
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={currentQuantity || ""}
                          onChange={(e) => handleOffsetChange(option.id, parseFloat(e.target.value) || 0)}
                          className="flex-1"
                        />
                        <span className="text-sm text-muted-foreground">{option.unit}</span>
                      </div>

                      {currentQuantity > 0 && (
                        <div className="space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex justify-between text-sm">
                            <span>CO₂ Offset:</span>
                            <span className="font-semibold text-primary">{offsetAmount.toFixed(1)} kg</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Cost:</span>
                            <span className="font-semibold">${cost.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div>
            <Card className="carbon-card sticky top-24">
              <CardHeader>
                <CardTitle className="font-orbitron text-primary">Offset Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-orbitron font-bold text-primary mb-2">
                    {totalOffset.toFixed(1)}
                  </div>
                  <p className="text-muted-foreground">kg CO₂ offset</p>
                </div>

                {targetEmissions > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{offsetPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={offsetPercentage} className="h-3" />
                    <p className="text-xs text-center text-muted-foreground">
                      {offsetPercentage >= 100 ? "Fully offset!" : `${(targetEmissions - totalOffset).toFixed(1)} kg remaining`}
                    </p>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Cost:</span>
                    <span className="font-bold text-primary text-lg">${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly:</span>
                    <span className="font-semibold">${totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual:</span>
                    <span className="font-semibold">${(totalCost * 12).toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full emerald-glow gradient-bg font-semibold"
                  disabled={totalOffset === 0}
                >
                  Offset Now - ${totalCost.toFixed(2)}
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  <p>🌱 Your offset supports verified environmental projects</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offset;