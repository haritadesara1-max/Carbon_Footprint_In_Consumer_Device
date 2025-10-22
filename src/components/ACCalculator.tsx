import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Wind, X } from "lucide-react";

// AC Power Consumption Table (Watts)
const acPowerTable = {
  "1.0": { "1": 1065, "2": 980, "3": 875, "4": 780, "5": 700 },
  "1.5": { "1": 1590, "2": 1460, "3": 1315, "4": 1170, "5": 1050 },
  "2.0": { "1": 2120, "2": 1945, "3": 1750, "4": 1560, "5": 1400 },
};

export interface AC {
  id: string;
  ton: string;
  starRating: string;
  hours: number;
  watts: number;
}

interface ACCalculatorProps {
  acs: AC[];
  onACsChange: (acs: AC[]) => void;
}

export const ACCalculator = ({ acs, onACsChange }: ACCalculatorProps) => {
  const [selectedTon, setSelectedTon] = useState("");
  const [selectedStarRating, setSelectedStarRating] = useState("");
  const [hours, setHours] = useState("");

  const getACWatts = (ton: string, starRating: string) => {
    return acPowerTable[ton as keyof typeof acPowerTable]?.[starRating as keyof typeof acPowerTable["1.0"]] || 0;
  };

  const addAC = () => {
    if (!selectedTon || !selectedStarRating || !hours) return;

    const watts = getACWatts(selectedTon, selectedStarRating);
    
    const newAC: AC = {
      id: `ac-${Date.now()}`,
      ton: selectedTon,
      starRating: selectedStarRating,
      hours: parseFloat(hours),
      watts,
    };

    onACsChange([...acs, newAC]);
    setSelectedTon("");
    setSelectedStarRating("");
    setHours("");
  };

  const removeAC = (acId: string) => {
    onACsChange(acs.filter(ac => ac.id !== acId));
  };

  const updateACHours = (acId: string, newHours: number) => {
    onACsChange(
      acs.map(ac => ac.id === acId ? { ...ac, hours: newHours } : ac)
    );
  };

  const currentWatts = selectedTon && selectedStarRating ? getACWatts(selectedTon, selectedStarRating) : 0;

  return (
    <div className="space-y-6">
      <Card className="carbon-card border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Wind className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-orbitron text-primary">AC Calculator</CardTitle>
              <CardDescription>Advanced air conditioner energy calculator</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">AC Capacity</Label>
              <Select value={selectedTon} onValueChange={setSelectedTon}>
                <SelectTrigger className="emerald-glow">
                  <SelectValue placeholder="Select Ton" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">1.0 Ton</SelectItem>
                  <SelectItem value="1.5">1.5 Ton</SelectItem>
                  <SelectItem value="2.0">2.0 Ton</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Star Rating</Label>
              <Select value={selectedStarRating} onValueChange={setSelectedStarRating}>
                <SelectTrigger className="emerald-glow">
                  <SelectValue placeholder="Select Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1-Star</SelectItem>
                  <SelectItem value="2">2-Star</SelectItem>
                  <SelectItem value="3">3-Star</SelectItem>
                  <SelectItem value="4">4-Star</SelectItem>
                  <SelectItem value="5">5-Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Hours/Day</Label>
              <Input
                type="number"
                min="0"
                max="24"
                step="0.5"
                placeholder="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="emerald-glow"
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addAC}
                disabled={!selectedTon || !selectedStarRating || !hours}
                className="w-full gradient-bg emerald-glow font-semibold"
              >
                Add AC
              </Button>
            </div>
          </div>

          {/* Power Display */}
          {currentWatts > 0 && (
            <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg animate-fade-in">
              <span className="text-sm font-medium">Power Consumption:</span>
              <span className="text-xl font-bold text-primary">{currentWatts} W</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Added ACs */}
      {acs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-orbitron font-semibold text-primary">Your Air Conditioners</h3>
          {acs.map((ac) => {
            const energyKwh = (ac.watts * ac.hours) / 1000;
            const co2Daily = energyKwh * 0.82;
            const co2Annual = co2Daily * 365;
            
            return (
              <Card key={ac.id} className="carbon-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Wind className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{ac.ton} Ton AC ({ac.starRating}-Star)</h4>
                        <p className="text-sm text-muted-foreground">{ac.watts}W</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={ac.hours}
                          onChange={(e) => updateACHours(ac.id, parseFloat(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                        <span className="text-sm text-muted-foreground">hours</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAC(ac.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* AC Results */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">Energy/Day</div>
                      <div className="text-lg font-bold text-primary">{energyKwh.toFixed(2)} kWh</div>
                      <Progress value={Math.min((energyKwh / 50) * 100, 100)} className="h-2 mt-2" />
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">CO₂/Day</div>
                      <div className="text-lg font-bold text-primary">{co2Daily.toFixed(2)} kg</div>
                      <Progress value={Math.min((co2Daily / 25) * 100, 100)} className="h-2 mt-2" />
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">CO₂/Year</div>
                      <div className="text-lg font-bold text-primary">{co2Annual.toFixed(0)} kg</div>
                      <Progress value={Math.min((co2Annual / 9000) * 100, 100)} className="h-2 mt-2" />
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">Trees Needed</div>
                      <div className="text-lg font-bold text-primary">{Math.ceil(co2Annual / 21.77)}</div>
                      <Progress value={Math.min((Math.ceil(co2Annual / 21.77) / 500) * 100, 100)} className="h-2 mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};