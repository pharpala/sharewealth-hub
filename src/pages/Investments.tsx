import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  PiggyBank,
  Target,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  MessageCircle,
  Send,
} from "lucide-react";

const Investments = () => {
  const [goal, setGoal] = useState("house");
  const [timeframe, setTimeframe] = useState("5-years");
  const [riskLevel, setRiskLevel] = useState([5]);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      content: "Hi! I'm your AI investment advisor. Let's create a personalized investment strategy for you. What's your primary financial goal?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const goalOptions = [
    { id: "house", label: "Save for a House", icon: Home, description: "Build wealth for real estate" },
    { id: "wealth", label: "Build Long-term Wealth", icon: PiggyBank, description: "Maximize portfolio growth" },
    { id: "retirement", label: "Retirement Planning", icon: Target, description: "Secure your future" },
  ];

  const timeframeOptions = [
    { id: "1-year", label: "1 Year", description: "Short-term goals" },
    { id: "5-years", label: "5 Years", description: "Medium-term planning" },
    { id: "10-years", label: "10+ Years", description: "Long-term wealth building" },
  ];

  const portfolioSuggestions = [
    {
      name: "Conservative Growth",
      allocation: "60% Bonds, 30% Stocks, 10% Cash",
      expectedReturn: "5-7%",
      risk: "Low",
      icon: Shield,
      color: "bg-green-500",
    },
    {
      name: "Balanced Portfolio",
      allocation: "50% Stocks, 40% Bonds, 10% Alternatives",
      expectedReturn: "7-9%",
      risk: "Medium",
      icon: Target,
      color: "bg-blue-500",
    },
    {
      name: "Growth Focused",
      allocation: "80% Stocks, 15% Bonds, 5% Alternatives",
      expectedReturn: "9-12%",
      risk: "High",
      icon: Zap,
      color: "bg-purple-500",
    },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, { type: "user", content: inputMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: "ai",
        content: `Based on your ${goal} goal and ${timeframe} timeframe with a risk level of ${riskLevel[0]}/10, I recommend focusing on a balanced approach. Would you like me to explain specific investment options?`,
      }]);
    }, 1000);

    setInputMessage("");
  };

  const getRiskDescription = (level: number) => {
    if (level <= 3) return "Conservative - Capital preservation focused";
    if (level <= 6) return "Moderate - Balanced growth approach";
    return "Aggressive - Maximum growth potential";
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Investment Planning</h1>
          <p className="text-muted-foreground text-lg">
            AI-powered investment strategies tailored to your goals
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
            {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Goal Selection */}
            <Card className="card-cyber">
              <h3 className="text-xl font-semibold mb-4">Investment Goal</h3>
              <div className="space-y-3">
                {goalOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setGoal(option.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        goal === option.id
                          ? "border-primary bg-primary/10"
                          : "border-border/50 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${goal === option.id ? "text-primary" : "text-muted-foreground"}`} />
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Timeframe Selection */}
            <Card className="card-cyber">
              <h3 className="text-xl font-semibold mb-4 text-electric">Time Horizon</h3>
              <div className="space-y-3">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTimeframe(option.id)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      timeframe === option.id
                        ? "border-primary bg-primary/10"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <Clock className={`w-4 h-4 ${timeframe === option.id ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Risk Tolerance */}
            <Card className="card-cyber">
              <h3 className="text-xl font-semibold mb-4 text-cyber">Risk Tolerance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conservative</span>
                  <span className="text-sm">Aggressive</span>
                </div>
                <Slider
                  value={riskLevel}
                  onValueChange={setRiskLevel}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center">
                  <Badge variant="outline" className="text-sm">
                    Level {riskLevel[0]}/10
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    {getRiskDescription(riskLevel[0])}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="card-premium h-[600px] flex flex-col">
              <div className="flex items-center space-x-2 mb-6">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">AI Investment Advisor</h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about investment strategies..."
                  className="flex-1 px-4 py-3 bg-input border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button onClick={handleSendMessage} variant="cyber" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Portfolio Suggestions */}
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-6">Recommended Portfolios</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {portfolioSuggestions.map((portfolio, index) => {
                  const Icon = portfolio.icon;
                  return (
                    <Card key={index} className="card-premium">
                      <div className="text-center space-y-4">
                        <div className={`w-12 h-12 mx-auto ${portfolio.color} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">{portfolio.name}</h4>
                          <Badge variant="outline" className="mt-2">
                            {portfolio.risk} Risk
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">{portfolio.allocation}</p>
                          <div className="flex items-center justify-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{portfolio.expectedReturn} annually</span>
                          </div>
                        </div>
                        <Button variant="secondary" className="w-full">
                          Select Portfolio
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Investments;