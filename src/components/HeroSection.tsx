import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, TrendingUp, PieChart, Target, Sparkles, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-finance.jpg";

const HeroSection = () => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Handle file upload logic here
  };

  return (
    <div className="min-h-screen pt-16 bg-background relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Financial analytics dashboard"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background"></div>
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Make Finance
              <span className="gradient-text block">Social & Smart</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your credit statements into powerful insights, connect with others' financial journeys, 
              and make informed investment decisions with AI-powered analytics.
            </p>
          </div>

          {/* Upload Section */}
          <div className="max-w-2xl mx-auto animate-slide-up">
            <Card
              className={`card-premium p-8 transition-all duration-300 cursor-pointer ${
                isDragOver ? "card-glow scale-105" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center animate-glow">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Upload Your Credit Statement</h3>
                  <p className="text-muted-foreground">
                    Drag and drop your statement or click to browse. Get instant AI-powered insights and join the financial social revolution.
                  </p>
                </div>
                <Button variant="hero" size="lg">
                  Choose File or Drag Here
                </Button>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, CSV, and image formats • 100% secure and encrypted
                </p>
              </div>
            </Card>
          </div>

          {/* Feature Preview */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="card-premium text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Get comprehensive spending analysis, category breakdowns, and trend predictions powered by advanced AI.
              </p>
            </Card>

            <Card className="card-premium text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-secondary to-secondary-glow rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Investment Planning</h3>
              <p className="text-muted-foreground">
                Personalized investment strategies based on your spending patterns, goals, and risk tolerance.
              </p>
            </Card>

            <Card className="card-premium text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 mx-auto bg-gradient-to-r from-accent to-accent-glow rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Social Insights</h3>
              <p className="text-muted-foreground">
                Compare anonymized spending patterns, discover trends, and learn from the community's financial wisdom.
              </p>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-16 opacity-70">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm">Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-sm">AI-Powered Insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-sm">Real-time Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;