import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingDown, Upload, Award } from "lucide-react";
import { carbonTrackingSchema } from "@/lib/validation";

interface CarbonTrackerSectionProps {
  isMNC: boolean;
  onStatsUpdate: () => void;
}

const CarbonTrackerSection = ({ isMNC, onStatsUpdate }: CarbonTrackerSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [monthYear, setMonthYear] = useState("");

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('carbon_tracking')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching records:', error);
    } else {
      setRecords(data || []);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a bill file and enter month/year."
      });
      return;
    }

    // Validate input
    try {
      carbonTrackingSchema.parse({
        monthYear,
        file
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: error.errors?.[0]?.message || "Please check your input"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Upload bill to storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('bills')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get signed URL with 1 year expiration
      const { data: signedData, error: signedError } = await supabase.storage
        .from('bills')
        .createSignedUrl(fileName, 31536000); // 1 year

      if (signedError) throw signedError;
      const billUrl = signedData.signedUrl;

      // Process bill with edge function
      const { data, error: funcError } = await supabase.functions.invoke('process-bill', {
        body: { billUrl, monthYear }
      });

      if (funcError) throw funcError;

      // Calculate points (less emission = more points)
      // Formula: Base 1000 points - (emissions * 10)
      const carbonEmissions = data.carbon_emissions || 0;
      const pointsEarned = Math.max(100, Math.floor(1000 - (carbonEmissions * 10)));

      // Insert tracking record
      const { error: insertError } = await supabase
        .from('carbon_tracking')
        .insert({
          user_id: user.id,
          bill_url: billUrl,
          electricity_units: data.electricity_units,
          carbon_emissions: carbonEmissions,
          points_earned: pointsEarned,
          month_year: monthYear
        });

      if (insertError) throw insertError;

      // Update user points
      const { data: currentPoints } = await supabase
        .from('user_points')
        .select('total_points, carbon_saved')
        .eq('user_id', user.id)
        .single();

      await supabase
        .from('user_points')
        .update({
          total_points: (currentPoints?.total_points || 0) + pointsEarned,
          carbon_saved: (currentPoints?.carbon_saved || 0) + carbonEmissions
        })
        .eq('user_id', user.id);

      toast({
        title: "Success!",
        description: `Bill processed! You earned ${pointsEarned} points. Carbon emissions: ${carbonEmissions.toFixed(2)} kg CO₂`
      });

      setFile(null);
      setMonthYear("");
      fetchRecords();
      onStatsUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process bill."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="carbon-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Upload Electricity Bill
          </CardTitle>
          <CardDescription>
            {isMNC 
              ? "Track monthly corporate carbon emissions and earn sustainability points" 
              : "Track your carbon footprint and earn points for lower emissions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthYear">Month & Year</Label>
              <Input
                id="monthYear"
                type="month"
                value={monthYear}
                onChange={(e) => setMonthYear(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billFile">Upload Bill (PDF)</Label>
              <Input
                id="billFile"
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Upload your electricity bill. We'll calculate carbon emissions automatically.
              </p>
            </div>

            <Button type="submit" className="w-full gradient-bg" disabled={loading}>
              <Upload className="h-4 w-4 mr-2" />
              {loading ? "Processing..." : "Upload & Calculate"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Points System</h4>
                <p className="text-xs text-muted-foreground">
                  Lower emissions = More points! Start with 1000 points base, minus 10 points per kg CO₂ emitted. 
                  Minimum 100 points per bill.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="carbon-card">
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
          <CardDescription>Your carbon emissions over time</CardDescription>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No records yet</p>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{record.month_year}</h4>
                      <p className="text-sm text-muted-foreground">
                        Units: {record.electricity_units} kWh
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">
                        +{record.points_earned} points
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {record.carbon_emissions.toFixed(2)} kg CO₂
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonTrackerSection;
