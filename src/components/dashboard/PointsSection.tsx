import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp, Trophy, Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PointsSectionProps {
  isMNC: boolean;
  stats: {
    totalPoints: number;
    carbonSaved: number;
    pickupsCompleted: number;
    certificatesEarned: number;
  };
}

const PointsSection = ({ isMNC, stats }: PointsSectionProps) => {
  const getLevel = (points: number) => {
    if (points < 1000) return { name: "Bronze", color: "text-orange-600", progress: (points / 1000) * 100 };
    if (points < 5000) return { name: "Silver", color: "text-gray-400", progress: ((points - 1000) / 4000) * 100 };
    if (points < 10000) return { name: "Gold", color: "text-yellow-500", progress: ((points - 5000) / 5000) * 100 };
    return { name: "Platinum", color: "text-purple-500", progress: 100 };
  };

  const level = getLevel(stats.totalPoints);

  return (
    <div className="space-y-6">
      <Card className="carbon-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className={`h-6 w-6 ${level.color}`} />
            Your Level: {level.name}
          </CardTitle>
          <CardDescription>
            {isMNC 
              ? "Corporate sustainability performance and achievements" 
              : "Track your environmental impact and achievements"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress to next level</span>
              <span className="font-semibold">{Math.floor(level.progress)}%</span>
            </div>
            <Progress value={level.progress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Total Points</h4>
              </div>
              <p className="text-2xl font-bold">{stats.totalPoints}</p>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Carbon Saved</h4>
              </div>
              <p className="text-2xl font-bold">{stats.carbonSaved.toFixed(1)} kg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="carbon-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-semibold">E-Waste Warrior</h4>
                <p className="text-sm text-muted-foreground">
                  Complete {stats.pickupsCompleted}/10 pickups
                </p>
              </div>
              <Progress value={(stats.pickupsCompleted / 10) * 100} className="w-24 h-2" />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-semibold">Certificate Collector</h4>
                <p className="text-sm text-muted-foreground">
                  Earn {stats.certificatesEarned}/5 certificates
                </p>
              </div>
              <Progress value={(stats.certificatesEarned / 5) * 100} className="w-24 h-2" />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-semibold">Carbon Reducer</h4>
                <p className="text-sm text-muted-foreground">
                  Save {stats.carbonSaved.toFixed(0)}/1000 kg CO₂
                </p>
              </div>
              <Progress value={(stats.carbonSaved / 1000) * 100} className="w-24 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {isMNC && (
        <Card className="carbon-card">
          <CardHeader>
            <CardTitle>How Points Help Your Business</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-1">Tax Benefits</h4>
              <p className="text-sm text-muted-foreground">
                Higher points lead to better CSR/ESG scores, potentially reducing your corporate tax burden.
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-1">ESG Rating</h4>
              <p className="text-sm text-muted-foreground">
                Improve your Environmental, Social, and Governance ratings with verified sustainability efforts.
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-1">Brand Value</h4>
              <p className="text-sm text-muted-foreground">
                Showcase your commitment to sustainability with certificates and verified carbon reduction.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PointsSection;
