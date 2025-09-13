import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Smartphone,
  Plane,
} from "lucide-react";
import Navigation from "@/components/Navigation";

export default function Dashboard() {
  const spendingData = [
    { category: "Food & Dining", amount: 1250, icon: Coffee, color: "bg-red-500" },
    { category: "Transportation", amount: 890, icon: Car, color: "bg-blue-500" },
    { category: "Shopping", amount: 650, icon: ShoppingCart, color: "bg-purple-500" },
    { category: "Housing", amount: 2200, icon: Home, color: "bg-green-500" },
    { category: "Entertainment", amount: 320, icon: Smartphone, color: "bg-yellow-500" },
    { category: "Travel", amount: 480, icon: Plane, color: "bg-indigo-500" },
  ];

  const insights = [
    {
      title: "Spending 15% above average",
      description: "Your dining expenses increased significantly this month",
      type: "warning",
      icon: TrendingUp,
    },
    {
      title: "Great job on transportation!",
      description: "You saved $200 compared to last month",
      type: "success",
      icon: TrendingDown,
    },
    {
      title: "Investment opportunity",
      description: "You have $800 available for investments this month",
      type: "info",
      icon: DollarSign,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Financial Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Your personalized financial insights for December 2024
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Spent</p>
                  <p className="text-3xl font-bold">$5,790</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-red-500 text-sm">+12%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Monthly Budget</p>
                  <p className="text-3xl font-bold">$6,500</p>
                  <div className="flex items-center mt-2">
                    <ArrowDownRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">$710 left</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Savings Rate</p>
                  <p className="text-3xl font-bold">23%</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+3%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Credit Score</p>
                  <p className="text-3xl font-bold">785</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 text-sm">+15 pts</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Spending Breakdown */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2 text-primary">Spending Breakdown</h3>
                  <p className="text-muted-foreground">Category-wise analysis for this month</p>
                </div>

                <div className="space-y-4">
                  {spendingData.map((item, index) => {
                    const Icon = item.icon;
                    const percentage = (item.amount / 5790) * 100;
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${item.amount.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                <Button variant="secondary" className="w-full mt-6">
                  View Detailed Analysis
                </Button>
              </Card>
            </div>

            {/* AI Insights */}
            <div>
              <Card className="p-6">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold mb-2 text-blue-600">AI Insights</h3>
                  <p className="text-muted-foreground">Personalized recommendations</p>
                </div>

                <div className="space-y-4">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    const colorClass = 
                      insight.type === "warning" ? "text-yellow-600" :
                      insight.type === "success" ? "text-green-600" : "text-blue-600";

                    return (
                      <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-start space-x-3">
                          <Icon className={`w-5 h-5 mt-1 ${colorClass}`} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                            <p className="text-muted-foreground text-sm">{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button className="w-full mt-6">
                  Get More Insights
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
