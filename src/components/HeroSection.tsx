"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  TrendingUp, 
  PieChart, 
  Target, 
  Sparkles, 
  Shield, 
  Users,
  Star,
  CheckCircle,
  Zap,
  Bot,
  Eye,
  BarChart3,
  ArrowRight,
  Play
} from "lucide-react";
import cyberHero from "@/assets/cyber-hero.jpg";

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

  const features = [
    { icon: Bot, text: "AI-Powered Analytics" },
    { icon: Eye, text: "Spending Insights" },
    { icon: BarChart3, text: "Investment Planning" },
    { icon: Users, text: "Social Benchmarking" },
  ];

  const testimonials = [
    { name: "Alex M.", rating: 5, text: "Completely transformed how I view my finances!" },
    { name: "Sarah L.", rating: 5, text: "The AI insights are incredibly accurate and actionable." },
    { name: "Mike R.", rating: 5, text: "Finally, a finance app that makes sense!" },
  ];

  return (
    <div className="min-h-screen pt-16 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={cyberHero} 
          alt="Cyberpunk financial technology"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
        
        {/* Animated scanning line */}
        <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-cyber-scan"></div>
      </div>
      
      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Announcement Banner */}
        <div className="pt-12 pb-8 text-center animate-fade-in">
          <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Now with Advanced AI Analytics
            <ArrowRight className="w-4 h-4 ml-2" />
          </Badge>
        </div>

        {/* Hero Headlines */}
        <div className="text-center space-y-8 pt-8 pb-16">
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
              Finance Gets
              <span className="text-cyber block animate-glow-pulse">Superhuman</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Upload your credit statement and unlock AI-powered insights that reveal hidden patterns, 
              optimize spending, and accelerate wealth building. Join thousands making smarter financial decisions.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background"></div>
                ))}
              </div>
              <span>12,450+ active users</span>
            </div>
            <div className="flex items-center space-x-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-warning text-warning" />
              ))}
              <span className="ml-2">4.9/5 rating</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Bank-level security</span>
            </div>
          </div>

          {/* Main CTA */}
          <div className="space-y-6 animate-slide-up">
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button variant="cyber" size="lg" className="flex-1">
                <Upload className="w-5 h-5 mr-2" />
                Upload Statement
              </Button>
              <Button variant="outline" size="lg" className="flex-1 bg-background/50 border-primary/30 hover:bg-primary/10">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Free analysis • No credit card required • 30-second setup
            </p>
          </div>
        </div>

        {/* Interactive Upload Zone */}
        <div className="max-w-3xl mx-auto mb-16 animate-slide-up">
          <div className="card-neon">
            <div 
              className={`card-neon-inner transition-all duration-500 cursor-pointer ${
                isDragOver ? "scale-105 border-primary/50" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center space-y-6 py-8">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary via-electric to-secondary rounded-3xl flex items-center justify-center animate-float">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center animate-cyber-pulse">
                    <Zap className="w-3 h-3 text-accent-foreground" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-electric">
                    Drop Your Statement Here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    PDF, CSV, or image files supported • Instant AI analysis • 100% secure processing
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                          <Icon className="w-4 h-4 text-primary" />
                          <span>{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="card-cyber hover-lift">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-primary-glow rounded-2xl flex items-center justify-center">
                <PieChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neon">Instant Analytics</h3>
              <p className="text-muted-foreground">
                AI analyzes your spending in seconds, revealing patterns you never knew existed.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Category breakdown
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Trend predictions
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Anomaly detection
                </div>
              </div>
            </div>
          </Card>

          <Card className="card-cyber hover-lift">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-secondary to-secondary-glow rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neon">Smart Investing</h3>
              <p className="text-muted-foreground">
                Personalized investment strategies based on your actual spending patterns.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Risk assessment
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Portfolio recommendations
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Goal tracking
                </div>
              </div>
            </div>
          </Card>

          <Card className="card-cyber hover-lift">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-accent to-accent-glow rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-neon">Social Insights</h3>
              <p className="text-muted-foreground">
                Compare anonymously with peers and discover community financial trends.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Anonymous benchmarking
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Community trends
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success mr-2" />
                  Peer insights
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold mb-8 text-electric">Loved by thousands of users</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-cyber">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= testimonial.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-primary">— {testimonial.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center pb-20">
          <Card className="card-neon max-w-2xl mx-auto">
            <div className="card-neon-inner py-12">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-cyber">Ready to Transform Your Finances?</h3>
                <p className="text-muted-foreground">
                  Join 12,450+ users who've already discovered the power of AI-driven financial insights.
                </p>
                <Button variant="cyber" size="lg" className="px-12">
                  <Upload className="w-5 h-5 mr-2" />
                  Get Started Free
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;