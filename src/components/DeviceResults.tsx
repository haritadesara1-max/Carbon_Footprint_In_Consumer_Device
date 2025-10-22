import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Device } from "./DeviceSelector";

interface DeviceResultsProps {
  devices: Device[];
}

export const DeviceResults = ({ devices }: DeviceResultsProps) => {
  // Calculate emissions for all devices
  const allResults = devices.map((device, index) => {
    const energyKwh = (device.watts * device.hours) / 1000;
    const isAC = device.ton && device.starRating; // Check if device is an AC
    const co2Daily = energyKwh * (isAC ? 0.82 : 0.7); // AC vs normal device emission factor
    
    return {
      name: device.name,
      co2: parseFloat(co2Daily.toFixed(2)),
      energy: parseFloat(energyKwh.toFixed(2)),
      color: isAC ? `hsl(145, ${60 - index * 10}%, ${50 + index * 5}%)` : "#50C878",
      type: isAC ? "ac" : "device"
    };
  });

  const totalEmissions = allResults.reduce((sum, result) => sum + result.co2, 0);
  const totalEnergy = allResults.reduce((sum, result) => sum + result.energy, 0);

  if (allResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Total Summary Card */}
      <Card className="carbon-card border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="font-orbitron text-primary">Your Carbon Footprint Summary</CardTitle>
          <CardDescription>Daily environmental impact from all your devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">
                {totalEnergy.toFixed(2)}
              </div>
              <p className="text-muted-foreground">kWh per day</p>
              <Progress value={Math.min((totalEnergy / 100) * 100, 100)} className="h-3 mt-3" />
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">
                {totalEmissions.toFixed(2)}
              </div>
              <p className="text-muted-foreground">kg CO₂ per day</p>
              <Progress value={Math.min((totalEmissions / 50) * 100, 100)} className="h-3 mt-3" />
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">
                {(totalEmissions * 365).toFixed(0)}
              </div>
              <p className="text-muted-foreground">kg CO₂ per year</p>
              <Progress value={Math.min(((totalEmissions * 365) / 18000) * 100, 100)} className="h-3 mt-3" />
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Monthly emissions</span>
                <span className="font-bold text-primary">{(totalEmissions * 30).toFixed(1)} kg CO₂</span>
              </div>
              <Progress value={Math.min((totalEmissions * 30 / 1500) * 100, 100)} className="h-2" />
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Trees needed to offset yearly</span>
                <span className="font-bold text-primary">{Math.ceil(totalEmissions * 365 / 21.77)} trees</span>
              </div>
              <Progress value={Math.min((Math.ceil(totalEmissions * 365 / 21.77) / 1000) * 100, 100)} className="h-2" />
            </div>
          </div>

          {/* Impact Status */}
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
            <p className="text-center font-medium">
              {totalEmissions < 5 ? "🌱 Excellent! Very low carbon footprint" :
               totalEmissions < 15 ? "🟡 Good! Consider optimizing high-usage devices" :
               totalEmissions < 30 ? "🟠 Moderate emissions - room for improvement" :
               "🔴 High emissions - time to reduce usage!"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="carbon-card">
          <CardHeader>
            <CardTitle className="font-orbitron">CO₂ Emissions by Device</CardTitle>
            <CardDescription>Daily carbon footprint breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={allResults}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                    formatter={(value: any) => [`${value} kg CO₂`, "Daily Emissions"]}
                  />
                  <Bar dataKey="co2" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="carbon-card">
          <CardHeader>
            <CardTitle className="font-orbitron">Energy Consumption Distribution</CardTitle>
            <CardDescription>Daily energy usage breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allResults}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="energy"
                  >
                    {allResults.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                    formatter={(value: any) => [`${value} kWh`, "Daily Energy"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};