import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Laptop, Tv, Refrigerator, WashingMachine, X } from "lucide-react";

import { Wind } from "lucide-react";

const deviceTypes = [
  { id: "smartphone", name: "Smartphone", icon: Smartphone, 
    powers: [{ label: "Low", watts: 5 }, { label: "Medium", watts: 20 }, { label: "High", watts: 30 }] },
  { id: "laptop", name: "Laptop", icon: Laptop,
    powers: [{ label: "Low", watts: 30 }, { label: "Medium", watts: 50 }, { label: "High", watts: 100 }] },
  { id: "tv", name: "TV", icon: Tv,
    powers: [{ label: "Low", watts: 40 }, { label: "Medium", watts: 80 }, { label: "High", watts: 150 }] },
  { id: "ac", name: "Air Conditioner", icon: Wind, isAC: true },
  { id: "refrigerator", name: "Refrigerator", icon: Refrigerator,
    powers: [{ label: "Low", watts: 50 }, { label: "Medium", watts: 100 }, { label: "High", watts: 200 }] },
  { id: "washing", name: "Washing Machine", icon: WashingMachine,
    powers: [{ label: "Low", watts: 500 }, { label: "Medium", watts: 1000 }, { label: "High", watts: 2000 }] },
];

// AC Power Consumption Table (Watts)
const acPowerTable = {
  "1.0": { "1": 1065, "2": 980, "3": 875, "4": 780, "5": 700 },
  "1.5": { "1": 1590, "2": 1460, "3": 1315, "4": 1170, "5": 1050 },
  "2.0": { "1": 2120, "2": 1945, "3": 1750, "4": 1560, "5": 1400 },
};

export interface Device {
  id: string;
  type: string;
  name: string;
  watts: number;
  hours: number;
  // AC specific properties
  ton?: string;
  starRating?: string;
}

interface DeviceSelectorProps {
  devices: Device[];
  onDevicesChange: (devices: Device[]) => void;
}

export const DeviceSelector = ({ devices, onDevicesChange }: DeviceSelectorProps) => {
  const [selectedType, setSelectedType] = useState("");
  const [selectedPower, setSelectedPower] = useState("");
  const [selectedTon, setSelectedTon] = useState("");
  const [selectedStarRating, setSelectedStarRating] = useState("");
  const [hours, setHours] = useState("");

  const getACWatts = (ton: string, starRating: string) => {
    return acPowerTable[ton as keyof typeof acPowerTable]?.[starRating as keyof typeof acPowerTable["1.0"]] || 0;
  };

  const addDevice = () => {
    if (!selectedType || !hours) return;

    const deviceType = deviceTypes.find(d => d.id === selectedType);
    if (!deviceType) return;

    let watts = 0;
    let deviceName = "";

    if (deviceType.isAC) {
      // AC device
      if (!selectedTon || !selectedStarRating) return;
      watts = getACWatts(selectedTon, selectedStarRating);
      deviceName = `${deviceType.name} (${selectedTon} Ton, ${selectedStarRating}-Star)`;
    } else {
      // Regular device
      if (!selectedPower) return;
      const powerOption = deviceType.powers?.find(p => p.label === selectedPower);
      if (!powerOption) return;
      watts = powerOption.watts;
      deviceName = `${deviceType.name} (${selectedPower})`;
    }

    const newDevice: Device = {
      id: `${selectedType}-${Date.now()}`,
      type: selectedType,
      name: deviceName,
      watts,
      hours: parseFloat(hours),
      ...(deviceType.isAC && { ton: selectedTon, starRating: selectedStarRating })
    };

    onDevicesChange([...devices, newDevice]);
    setSelectedType("");
    setSelectedPower("");
    setSelectedTon("");
    setSelectedStarRating("");
    setHours("");
  };

  const removeDevice = (deviceId: string) => {
    onDevicesChange(devices.filter(d => d.id !== deviceId));
  };

  const updateDeviceHours = (deviceId: string, newHours: number) => {
    onDevicesChange(
      devices.map(d => d.id === deviceId ? { ...d, hours: newHours } : d)
    );
  };

  const selectedDeviceType = deviceTypes.find(d => d.id === selectedType);
  const isAC = selectedDeviceType?.isAC;

  return (
    <div className="space-y-6">
      <Card className="carbon-card">
        <CardHeader>
          <CardTitle className="font-orbitron text-primary">Add Device</CardTitle>
          <CardDescription>Select a device and its power consumption level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Device Type</Label>
              <Select value={selectedType} onValueChange={(value) => {
                setSelectedType(value);
                setSelectedPower("");
                setSelectedTon("");
                setSelectedStarRating("");
              }}>
                <SelectTrigger className="emerald-glow">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      <div className="flex items-center space-x-2">
                        <device.icon className="h-4 w-4" />
                        <span>{device.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                {isAC ? "AC Capacity" : "Power Level"}
              </Label>
              {isAC ? (
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
              ) : (
                <Select 
                  value={selectedPower} 
                  onValueChange={setSelectedPower}
                  disabled={!selectedType}
                >
                  <SelectTrigger className="emerald-glow">
                    <SelectValue placeholder="Select power" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDeviceType?.powers?.map((power) => (
                      <SelectItem key={power.label} value={power.label}>
                        {power.label} ({power.watts}W)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {isAC && (
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
            )}

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
                onClick={addDevice}
                disabled={!selectedType || !hours || (isAC ? (!selectedTon || !selectedStarRating) : !selectedPower)}
                className="w-full gradient-bg emerald-glow font-semibold"
              >
                Add Device
              </Button>
            </div>
          </div>

          {/* Example Section */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">💡 Example</h4>
            <p className="text-sm text-muted-foreground">
              Charging a smartphone for 2 hours → 0.04 kWh → 28 g CO₂
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Added Devices */}
      {devices.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-orbitron font-semibold text-primary">Your Devices</h3>
          {devices.map((device) => {
            const deviceType = deviceTypes.find(d => d.id === device.type);
            const Icon = deviceType?.icon || Smartphone;
            
            return (
              <Card key={device.id} className="carbon-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{device.name}</h4>
                        <p className="text-sm text-muted-foreground">{device.watts}W</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="0"
                          max="24"
                          step="0.5"
                          value={device.hours}
                          onChange={(e) => updateDeviceHours(device.id, parseFloat(e.target.value) || 0)}
                          className="w-20 text-center"
                        />
                        <span className="text-sm text-muted-foreground">hours</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {((device.watts * device.hours) / 1000).toFixed(2)} kWh
                        </div>
                        <div className="text-sm text-primary font-semibold">
                          {(((device.watts * device.hours) / 1000) * 0.7).toFixed(2)} kg CO₂
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDevice(device.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
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