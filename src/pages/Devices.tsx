import { useState } from "react";
import { DeviceSelector, Device } from "@/components/DeviceSelector";
import { DeviceResults } from "@/components/DeviceResults";

const Devices = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold text-foreground mb-4">
            Device Usage Tracker
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your daily device usage and calculate your comprehensive carbon footprint
          </p>
        </header>

        <div className="space-y-8">
          {/* Device Selector */}
          <DeviceSelector devices={devices} onDevicesChange={setDevices} />
          
          {/* Results Display */}
          <DeviceResults devices={devices} />
          
          {/* Authentication Note */}
          {devices.length > 0 && (
            <div className="mt-12 p-6 bg-primary/10 border border-primary/20 rounded-lg">
              <h3 className="font-orbitron font-semibold text-primary mb-2">💾 Save Your Data</h3>
              <p className="text-muted-foreground mb-4">
                Want to save your device configurations and track your carbon footprint over time? 
                Connect your project to Supabase to enable user authentication and data storage.
              </p>
              <div className="text-sm text-muted-foreground">
                Click the green Supabase button in the top right to get started with user accounts and data persistence.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;