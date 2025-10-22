import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Leaf, Zap, Recycle } from "lucide-react";

interface UserStats {
  points: number;
  level: number;
  badges: string[];
  streak: number;
  co2Saved: number;
}

const badges = [
  { id: "eco-saver", name: "Eco Saver", icon: Leaf, requirement: 100, description: "Save 100 points" },
  { id: "green-hero", name: "Green Hero", icon: Award, requirement: 500, description: "Save 500 points" },
  { id: "streak-master", name: "Streak Master", icon: Zap, requirement: 7, description: "7-day streak" },
  { id: "carbon-crusher", name: "Carbon Crusher", icon: Recycle, requirement: 1000, description: "1000 points saved" },
];

const leaderboard = [
  { name: "EcoWarrior23", points: 2450, level: 12 },
  { name: "GreenMachine", points: 2100, level: 10 },
  { name: "CarbonFighter", points: 1850, level: 9 },
  { name: "You", points: 0, level: 1 },
  { name: "EcoNewbie", points: 450, level: 3 },
];

const Gamify = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 1,
    badges: [],
    streak: 0,
    co2Saved: 0,
  });

  const [sortedLeaderboard, setSortedLeaderboard] = useState(leaderboard);

  useEffect(() => {
    // Load saved data from localStorage
    const saved = localStorage.getItem("carbonTrackrStats");
    if (saved) {
      setUserStats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Update leaderboard with current user stats
    const updated = leaderboard.map(user => 
      user.name === "You" ? { ...user, points: userStats.points, level: userStats.level } : user
    ).sort((a, b) => b.points - a.points);
    setSortedLeaderboard(updated);
  }, [userStats]);

  const addPoints = (amount: number) => {
    const newStats = {
      ...userStats,
      points: userStats.points + amount,
      level: Math.floor((userStats.points + amount) / 200) + 1,
      co2Saved: userStats.co2Saved + (amount * 0.01),
    };

    // Check for new badges
    const newBadges = [...userStats.badges];
    badges.forEach(badge => {
      if (!newBadges.includes(badge.id)) {
        if (badge.id === "streak-master" && userStats.streak >= badge.requirement) {
          newBadges.push(badge.id);
        } else if (newStats.points >= badge.requirement) {
          newBadges.push(badge.id);
        }
      }
    });

    newStats.badges = newBadges;
    setUserStats(newStats);
    localStorage.setItem("carbonTrackrStats", JSON.stringify(newStats));
  };

  const nextLevelPoints = userStats.level * 200;
  const currentLevelProgress = ((userStats.points % 200) / 200) * 100;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold text-foreground mb-4">
            Green Gamification
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn points, unlock badges, and compete with other eco-warriors
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="font-orbitron text-primary flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-orbitron font-bold text-primary mb-2 animate-pulse-emerald">
                    {userStats.points}
                  </div>
                  <p className="text-muted-foreground">Green Points</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {userStats.level}</span>
                    <span>Next: {nextLevelPoints}</span>
                  </div>
                  <Progress value={currentLevelProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-primary">{userStats.streak}</div>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-primary">{userStats.co2Saved.toFixed(1)}</div>
                    <p className="text-sm text-muted-foreground">kg CO₂ Saved</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => addPoints(50)} 
                    className="w-full emerald-glow"
                    variant="outline"
                  >
                    Used Device 1hr Less (+50 pts)
                  </Button>
                  <Button 
                    onClick={() => addPoints(100)} 
                    className="w-full emerald-glow"
                    variant="outline"
                  >
                    Switched to Eco Mode (+100 pts)
                  </Button>
                  <Button 
                    onClick={() => addPoints(200)} 
                    className="w-full emerald-glow gradient-bg"
                  >
                    Completed Daily Challenge (+200 pts)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="font-orbitron text-primary">Badges</CardTitle>
                <CardDescription>Unlock achievements for sustainable actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    const earned = userStats.badges.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border transition-all duration-300 ${
                          earned
                            ? "border-primary bg-primary/10 emerald-glow"
                            : "border-border bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon
                            className={`h-8 w-8 ${
                              earned ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <div>
                            <h3 className={`font-semibold ${earned ? "text-primary" : "text-muted-foreground"}`}>
                              {badge.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">{badge.description}</p>
                          </div>
                        </div>
                        {earned && (
                          <Badge className="mt-2 bg-primary/20 text-primary hover:bg-primary/30">
                            Earned!
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <Card className="carbon-card">
              <CardHeader>
                <CardTitle className="font-orbitron text-primary flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Top eco-warriors this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedLeaderboard.map((user, index) => (
                    <div
                      key={user.name}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        user.name === "You"
                          ? "bg-primary/20 border border-primary/30 emerald-glow"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-black"
                              : index === 1
                              ? "bg-gray-400 text-black"
                              : index === 2
                              ? "bg-orange-600 text-white"
                              : user.name === "You"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className={`font-medium ${user.name === "You" ? "text-primary" : ""}`}>
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">Level {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{user.points}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamify;