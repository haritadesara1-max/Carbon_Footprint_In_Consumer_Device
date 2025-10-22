import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { CalendarIcon, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ewasteRequestSchema } from "@/lib/validation";

interface EWasteSectionProps {
  isMNC: boolean;
  onStatsUpdate: () => void;
}

const EWasteSection = ({ isMNC, onStatsUpdate }: EWasteSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    itemType: "",
    quantity: "",
    address: ""
  });

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('ewaste_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all fields including pickup date."
      });
      return;
    }

    // Validate input
    try {
      ewasteRequestSchema.parse({
        itemType: formData.itemType,
        quantity: parseInt(formData.quantity),
        address: formData.address,
        pickupDate: date
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
    
    const { error } = await supabase
      .from('ewaste_requests')
      .insert({
        user_id: user.id,
        item_type: formData.itemType,
        quantity: parseInt(formData.quantity),
        address: formData.address,
        pickup_date: format(date, 'yyyy-MM-dd'),
        status: 'pending'
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit request."
      });
    } else {
      toast({
        title: "Success!",
        description: "E-waste pickup request submitted successfully."
      });
      setFormData({ itemType: "", quantity: "", address: "" });
      setDate(undefined);
      fetchRequests();
    }
    
    setLoading(false);
  };

  const handleGenerateCertificate = async (requestId: string) => {
    toast({
      title: "Generating certificate...",
      description: "Your certificate will be ready shortly."
    });
    
    // Get the request details to calculate points
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    // Calculate points: 50 points per item
    const pointsEarned = request.quantity * 50;

    // Call edge function to generate certificate
    const { data, error } = await supabase.functions.invoke('generate-certificate', {
      body: { requestId, type: isMNC ? 'csr' : 'public' }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate certificate."
      });
    } else {
      // Update user points
      const { data: currentPoints } = await supabase
        .from('user_points')
        .select('total_points, pickups_completed, certificates_earned')
        .eq('user_id', user!.id)
        .single();

      await supabase
        .from('user_points')
        .update({
          total_points: (currentPoints?.total_points || 0) + pointsEarned,
          pickups_completed: (currentPoints?.pickups_completed || 0) + 1,
          certificates_earned: (currentPoints?.certificates_earned || 0) + 1
        })
        .eq('user_id', user!.id);

      toast({
        title: "Certificate generated!",
        description: `You earned ${pointsEarned} points for this pickup.`
      });
      fetchRequests();
      onStatsUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="carbon-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-primary" />
            Schedule E-Waste Pickup
          </CardTitle>
          <CardDescription>
            {isMNC 
              ? "Schedule corporate e-waste pickup and earn CSR/ESG certificates" 
              : "Schedule your e-waste pickup and get digital certificates"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemType">Item Type</Label>
                <Input
                  id="itemType"
                  placeholder="e.g., Old laptops, monitors, phones"
                  value={formData.itemType}
                  onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Number of items"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address</Label>
              <Textarea
                id="address"
                placeholder="Enter full pickup address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Pickup Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" className="w-full gradient-bg" disabled={loading}>
              {loading ? "Submitting..." : "Schedule Pickup"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="carbon-card">
        <CardHeader>
          <CardTitle>My Requests</CardTitle>
          <CardDescription>View and manage your e-waste pickup requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No requests yet</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{request.item_type}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {request.quantity} | Date: {format(new Date(request.pickup_date), 'PP')}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{request.address}</p>
                    </div>
                    <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                  </div>
                  {request.status === 'completed' && !request.certificate_url && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleGenerateCertificate(request.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Generate Certificate
                    </Button>
                  )}
                  {request.certificate_url && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(request.certificate_url, '_blank')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Certificate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EWasteSection;
