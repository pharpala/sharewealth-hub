"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
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
  Play,
  Space,
  Loader2
} from "lucide-react";
import cyberHero from "@/assets/cyber-hero.jpg";

const HeroSection = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Show initial upload toast
    toast({
      title: "🔄 Processing Upload...",
      description: `Uploading ${file.name} and analyzing with AI. This may take a few moments.`,
      duration: 3000,
    });

    try {
      const formData = new FormData();
      formData.append("file", file);

      // For now, we'll use a mock token. In production, this should come from Auth0
      const mockToken = "mock-jwt-token";

      const response = await fetch("/api/v1/statements/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${mockToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Upload failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Fetch the full statement details from the database
      const detailsResponse = await fetch(`/api/v1/statements/${result.statement_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${mockToken}`,
        },
      });

      let fullStatementData = null;
      if (detailsResponse.ok) {
        fullStatementData = await detailsResponse.json();
      }

      toast({
        title: "✅ Upload Successful!",
        description: (
          <div className="space-y-3 max-w-lg">
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div><strong>Statement ID:</strong> <code className="text-xs bg-gray-200 px-1 rounded">{result.statement_id}</code></div>
              <div><strong>Status:</strong> <span className="text-green-600">{result.status}</span></div>
              <div><strong>Uploaded:</strong> {new Date(result.datetime_uploaded).toLocaleString()}</div>
              {result.summary && <div><strong>Summary:</strong> {result.summary}</div>}
            </div>
            
            <div className="pt-2 border-t">
              <a 
                href={`/statement/${result.statement_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                📊 View Full Analysis
              </a>
            </div>
            
            {fullStatementData && (
              <div className="border-t pt-3 mt-3">
                <h4 className="font-semibold text-sm mb-2">📊 AI Analysis Results:</h4>
                <div className="text-xs space-y-2">
                  {fullStatementData.enriched_data?.choices?.[0]?.message?.content && (() => {
                    try {
                      const aiData = JSON.parse(fullStatementData.enriched_data.choices[0].message.content);
                      return (
                        <div className="space-y-2">
                          {aiData.customer_info && (
                            <div className="bg-blue-50 p-2 rounded">
                              <strong>👤 Customer:</strong> {aiData.customer_info.name}
                              {aiData.customer_info.address && <div className="text-gray-600">{aiData.customer_info.address}</div>}
                            </div>
                          )}
                          
                          {aiData.totals && (
                            <div className="bg-green-50 p-2 rounded">
                              <strong>💰 Financial Summary:</strong>
                              <div className="grid grid-cols-2 gap-1 mt-1">
                                <div>Balance: ${aiData.totals.ending_balance}</div>
                                <div>Min Payment: ${aiData.totals.minimum_payment}</div>
                                <div>Purchases: ${aiData.totals.purchases}</div>
                                <div>Interest: ${aiData.totals.interest_charges}</div>
                              </div>
                              {aiData.totals.payment_due_date && (
                                <div className="mt-1 text-red-600">Due: {aiData.totals.payment_due_date}</div>
                              )}
                            </div>
                          )}
                          
                          {aiData.transactions && aiData.transactions.length > 0 && (
                            <div className="bg-yellow-50 p-2 rounded">
                              <strong>📝 Transactions ({aiData.transactions.length}):</strong>
                              <div className="mt-1 max-h-16 overflow-auto">
                                {aiData.transactions.slice(0, 3).map((tx: any, idx: number) => (
                                  <div key={idx} className="flex justify-between">
                                    <span>{tx.description}</span>
                                    <span>${tx.amount}</span>
                                  </div>
                                ))}
                                {aiData.transactions.length > 3 && <div className="text-gray-500">...and {aiData.transactions.length - 3} more</div>}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    } catch (e) {
                      return (
                        <div className="bg-red-50 p-2 rounded text-red-700">
                          <strong>⚠️ AI Data Parse Error:</strong> {e instanceof Error ? e.message : 'Unknown error'}
                        </div>
                      );
                    }
                  })()}
                  
                  {fullStatementData.text_extracted && (
                    <div>
                      <strong>📄 Extracted Text Preview:</strong>
                      <div className="mt-1 text-xs bg-gray-50 p-2 rounded max-h-16 overflow-auto">
                        {fullStatementData.text_extracted.substring(0, 200)}
                        {fullStatementData.text_extracted.length > 200 && "..."}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                📄 View Full Database Response
              </summary>
              <pre className="mt-2 text-xs bg-gray-900 text-green-400 p-3 rounded-md overflow-auto max-h-40 font-mono">
                {JSON.stringify(fullStatementData || result, null, 2)}
              </pre>
            </details>
          </div>
        ),
        duration: 15000, // Show for 15 seconds
      });

      // Also log to console for debugging
      console.log("Upload result:", result);
      console.log("Full statement data:", fullStatementData);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      const event = e as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    };
    input.click();
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
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background"></div>
        
        {/* Animated scanning line */}
        <div className="absolute top-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-cyber-scan"></div>
      </div>
      
      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Announcement Banner */}
        <div className="pt-12 pb-8 text-center animate-fade-in">
          <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 px-5 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
              No bulls**t, just numbers and a plan.
          </Badge>
        </div>

        {/* Hero Headlines */}
        <div className="text-center space-y-8 pt-8 pb-16">
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
              Finance Gets
              <span className="text-cyber block animate-glow-pulse">Superhuman</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Upload one monthly statement. See insights you never imagined, budgets that actually fit 
            your life, and a roadmap that shows what’s possible, whether it's cutting hidden drains or visualizing the house you could buy if you stick to the plan. 
            No filler, just cold hard finance.            
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
              <span>230+ statements analyzed</span>
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
              <Button 
                variant="cyber" 
                size="lg" 
                className="flex-1"
                onClick={handleUploadClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 mr-2" />
                )}
                {isUploading ? "Uploading..." : "Upload Statement"}
              </Button>
              <Button variant="outline" size="lg" className="flex-1 bg-background/50 border-primary/30 hover:bg-primary/10">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
              <p className="text-sm text-muted-foreground">
                SOC 2 Certified  •   5-second setup   •   Data never used in training.
              </p>
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
                <Button 
                  variant="cyber" 
                  size="lg" 
                  className="px-12"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 mr-2" />
                  )}
                  {isUploading ? "Processing..." : "Get Started Free"}
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