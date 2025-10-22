import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Leaf, Trash2, TrendingDown, Award, Bell } from "lucide-react";
import EWasteSection from "@/components/dashboard/EWasteSection";
import CarbonTrackerSection from "@/components/dashboard/CarbonTrackerSection";
import PointsSection from "@/components/dashboard/PointsSection";
import NotificationsSection from "@/components/dashboard/NotificationsSection";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPoints: 0,
    carbonSaved: 0,
    pickupsCompleted: 0,
    certificatesEarned: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    const { data } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', user?.id)
      .single();
    
    if (data) {
      setStats({
        totalPoints: data.total_points || 0,
        carbonSaved: data.carbon_saved || 0,
        pickupsCompleted: data.pickups_completed || 0,
        certificatesEarned: data.certificates_earned || 0
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDevicesClick = () => navigate('/devices');
  const handleOffsetClick = () => navigate('/offset');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Leaf className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const isMNC = profile?.user_type === 'mnc';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-primary/10 emerald-glow">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-orbitron font-bold">
                  {isMNC ? 'MNC Dashboard' : 'My Dashboard'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {profile?.company_name || profile?.full_name || profile?.email}
                </p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            onClick={handleDevicesClick}
            className="h-20 text-lg gradient-bg"
            size="lg"
          >
            <TrendingDown className="mr-2 h-5 w-5" />
            Device Tracking
          </Button>
          <Button 
            onClick={handleOffsetClick}
            className="h-20 text-lg gradient-bg"
            size="lg"
          >
            <Award className="mr-2 h-5 w-5" />
            Carbon Offset
          </Button>
        </div>

        {/* Main Content - Different layout for MNC vs Public */}
        {isMNC ? (
          // MNC Layout: Simple points table + tabs without points tab
          <div className="space-y-6">
            {/* Simple Points Table for MNC */}
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your corporate sustainability statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                    <p className="text-2xl font-bold text-primary">{stats.totalPoints}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Carbon Saved</p>
                    <p className="text-2xl font-bold">{stats.carbonSaved.toFixed(2)} kg</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Pickups Done</p>
                    <p className="text-2xl font-bold">{stats.pickupsCompleted}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Certificates</p>
                    <p className="text-2xl font-bold">{stats.certificatesEarned}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* MNC Tabs: E-Waste, Carbon Tracker, Notifications */}
            <Tabs defaultValue="ewaste" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ewaste">
                  <Trash2 className="h-4 w-4 mr-2" />
                  E-Waste
                </TabsTrigger>
                <TabsTrigger value="carbon">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Carbon Tracker
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ewaste">
                <EWasteSection isMNC={isMNC} onStatsUpdate={fetchStats} />
              </TabsContent>

              <TabsContent value="carbon">
                <CarbonTrackerSection isMNC={isMNC} onStatsUpdate={fetchStats} />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationsSection />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          // Public User Layout: Only E-Waste and Carbon Tracker tabs
          <Tabs defaultValue="ewaste" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ewaste">
                <Trash2 className="h-4 w-4 mr-2" />
                E-Waste
              </TabsTrigger>
              <TabsTrigger value="carbon">
                <TrendingDown className="h-4 w-4 mr-2" />
                Carbon Tracker
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ewaste">
              <EWasteSection isMNC={isMNC} onStatsUpdate={fetchStats} />
            </TabsContent>

            <TabsContent value="carbon">
              <CarbonTrackerSection isMNC={isMNC} onStatsUpdate={fetchStats} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
