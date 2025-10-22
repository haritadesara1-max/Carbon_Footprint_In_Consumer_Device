import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePine, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="carbon-card text-center">
          <CardHeader>
            <div className="mx-auto mb-6 p-4 rounded-full bg-primary/10 w-fit animate-pulse-emerald">
              <TreePine className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-orbitron text-4xl font-bold text-foreground mb-2">
              404
            </CardTitle>
            <p className="text-xl text-muted-foreground mb-4">
              Oops! This page got lost in the digital forest
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist. Let's get you back on track to reducing your carbon footprint!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/" className="flex-1">
                <Button className="w-full emerald-glow gradient-bg font-semibold">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex-1 hover:bg-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
