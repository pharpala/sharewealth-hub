import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Zap,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Coffee,
  Car,
  Home,
  Smartphone,
} from "lucide-react";

const Trends = () => {
  const marketTrends = [
    {
      title: "Tech Stocks Rally",
      description: "Technology sector showing strong growth amid AI developments",
      change: "+12.5%",
      trend: "up",
      category: "Markets",
      time: "2h ago",
    },
    {
      title: "Real Estate Softening",
      description: "Housing market showing signs of cooling in major cities",
      change: "-3.2%",
      trend: "down",
      category: "Real Estate",
      time: "4h ago",
    },
    {
      title: "Crypto Recovery",
      description: "Bitcoin and major cryptocurrencies gaining momentum",
      change: "+18.7%",
      trend: "up",
      category: "Crypto",
      time: "6h ago",
    },
  ];

  const socialTrends = [
    {
      category: "Dining Out",
      icon: Coffee,
      avgSpending: "$245",
      yourSpending: "$320",
      comparison: "+31%",
      trend: "up",
      insight: "You're spending above average on dining. Consider meal planning!",
    },
    {
      category: "Transportation",
      icon: Car,
      avgSpending: "$180",
      yourSpending: "$150",
      comparison: "-17%",
      trend: "down",
      insight: "Great job! You're saving on transportation costs.",
    },
    {
      category: "Housing",
      icon: Home,
      avgSpending: "$1,800",
      yourSpending: "$1,650",
      comparison: "-8%",
      trend: "down",
      insight: "Your housing costs are below average for your area.",
    },
    {
      category: "Technology",
      icon: Smartphone,
      avgSpending: "$95",
      yourSpending: "$140",
      comparison: "+47%",
      trend: "up",
      insight: "Consider reviewing your tech subscriptions and purchases.",
    },
  ];

  const communityInsights = [
    {
      title: "Millennial Saving Patterns",
      stat: "23%",
      description: "Average savings rate increased this quarter",
      icon: Target,
    },
    {
      title: "Investment Diversification",
      stat: "67%",
      description: "Users now have multi-asset portfolios",
      icon: Globe,
    },
    {
      title: "Emergency Fund Goals",
      stat: "89%",
      description: "Community members building emergency funds",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Financial Trends</h1>
          <p className="text-muted-foreground text-lg">
            Stay informed with market insights and community spending patterns
          </p>
        </div>

        {/* Market Trends */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Market Pulse</h2>
            <Button variant="outline">View All Markets</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {marketTrends.map((trend, index) => (
              <Card key={index} className="card-premium animate-slide-up">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{trend.category}</Badge>
                    <div className={`flex items-center space-x-1 ${
                      trend.trend === "up" ? "text-success" : "text-destructive"
                    }`}>
                      {trend.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      <span className="font-semibold">{trend.change}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{trend.title}</h3>
                    <p className="text-muted-foreground text-sm">{trend.description}</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{trend.time}</span>
                    <Button variant="ghost" size="sm">Learn More</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Spending Comparison */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Community Comparison</h2>
              <p className="text-muted-foreground">See how your spending compares to similar users</p>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">12,450 users</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {socialTrends.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="card-premium">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Icon className="w-8 h-8 text-primary" />
                      <div className={`flex items-center space-x-1 ${
                        item.trend === "up" ? "text-warning" : "text-success"
                      }`}>
                        {item.trend === "up" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-semibold text-sm">{item.comparison}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">{item.category}</h3>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Community Avg:</span>
                          <span>{item.avgSpending}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Your Spending:</span>
                          <span className="font-semibold">{item.yourSpending}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">{item.insight}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Community Insights */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Community Insights</h2>
            <p className="text-muted-foreground">Financial behaviors and trends from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {communityInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <Card key={index} className="card-premium text-center">
                  <div className="space-y-4">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">{insight.stat}</div>
                      <h3 className="font-semibold mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Call to Action */}
          <Card className="card-premium text-center py-12">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Join the Financial Community</h3>
                <p className="text-muted-foreground">
                  Connect with thousands of users sharing their financial journey. Get insights, 
                  tips, and motivation to reach your financial goals together.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="cyber">Share Your Journey</Button>
                <Button variant="neon">Explore Community</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Trends;