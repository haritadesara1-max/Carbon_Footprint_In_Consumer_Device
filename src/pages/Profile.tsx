import { useState } from "react";
import { 
  User, 
  Edit, 
  Trophy, 
  Target, 
  Calendar,
  TrendingDown,
  Award,
  Upload,
  History,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const Profile = () => {
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "January 2024",
    totalGreenPoints: 2450,
    monthlyFootprint: 45.2, // kg CO₂
    yearlyFootprint: 580.5, // kg CO₂
    badges: [
      { name: "Eco Saver", icon: "🌱", description: "Reduced footprint by 20%" },
      { name: "Green Hero", icon: "💚", description: "1000+ Green Points earned" },
      { name: "Device Master", icon: "📱", description: "Optimized all devices" },
    ],
  });

  const footprintData = [
    { month: "Jan", footprint: 52.3 },
    { month: "Feb", footprint: 47.8 },
    { month: "Mar", footprint: 51.2 },
    { month: "Apr", footprint: 45.2 },
    { month: "May", footprint: 38.9 },
    { month: "Jun", footprint: 42.1 },
  ];

  const deviceUsageData = [
    { name: "Smartphone", value: 35, color: "hsl(145, 63%, 49%)" },
    { name: "Laptop", value: 25, color: "hsl(145, 63%, 59%)" },
    { name: "TV", value: 20, color: "hsl(145, 63%, 69%)" },
    { name: "Other", value: 20, color: "hsl(145, 63%, 79%)" },
  ];

  const recentActivities = [
    { date: "2024-01-15", action: "Device tracking", co2: "12.5 kg CO₂", points: "+25" },
    { date: "2024-01-14", action: "Receipt analysis", co2: "8.3 kg CO₂", points: "+15" },
    { date: "2024-01-13", action: "Carbon offset", co2: "-20.0 kg CO₂", points: "+50" },
  ];

  return (
    <div className="min-h-screen pt-8 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-orbitron font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your carbon tracking journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="carbon-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-primary/20 emerald-glow"
                    />
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Member since {user.joinDate}
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="carbon-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Green Points</p>
                      <p className="text-2xl font-bold text-primary">{user.totalGreenPoints.toLocaleString()}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="carbon-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold">{user.monthlyFootprint} kg CO₂</p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="carbon-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Year</p>
                      <p className="text-2xl font-bold">{user.yearlyFootprint} kg CO₂</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Middle Column - Charts and Progress */}
          <div className="space-y-6">
            {/* Footprint Trend */}
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Carbon Footprint Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={footprintData}>
                      <defs>
                        <linearGradient id="colorFootprint" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(145, 63%, 49%)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(145, 63%, 49%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} kg CO₂`, "Footprint"]}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="footprint" 
                        stroke="hsl(145, 63%, 49%)" 
                        fillOpacity={1} 
                        fill="url(#colorFootprint)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Device Usage Breakdown */}
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle>Device Usage Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceUsageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, "Usage"]}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {deviceUsageData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Badges and Activity */}
          <div className="space-y-6">
            {/* Badges */}
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.badges.map((badge, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm">
                    View All Badges
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="h-5 w-5 mr-2 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          activity.co2.startsWith('-') ? 'text-primary' : 'text-foreground'
                        }`}>
                          {activity.co2}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {activity.points} pts
                        </Badge>
                      </div>
                    </div>
                    {index < recentActivities.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    View Full History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;