"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  Eye,
  Lightbulb,
  Zap,
  ArrowRight,
  Activity,
  DollarSign,
  CheckCircle,
  Wallet,
} from "lucide-react";

export default function Trends() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard data
        const dashboardResponse = await fetch('http://127.0.0.1:8000/api/v1/dashboard');
        if (!dashboardResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const dashboardData = await dashboardResponse.json();
        setDashboardData(dashboardData);

        // Fetch all transactions for bad spending analysis
        const transactionsResponse = await fetch('http://127.0.0.1:8000/api/v1/transactions');
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setAllTransactions(transactionsData.transactions || []);
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for analysis
  const spendingData = dashboardData?.spending_by_category || [];
  
  // Function to find the highest spending transaction in each category
  const findBadSpendingExamples = () => {
    if (!allTransactions.length || !spendingData.length) return [];

    return spendingData
      .slice(0, 4) // Take top 4 categories by spending
      .map((categoryData: any) => {
        // Find transactions that belong to this specific category
        const categoryName = categoryData.category.toLowerCase();
        let categoryKeywords: string[] = [];
        
        // Comprehensive keyword matching based on actual transaction data
        if (categoryName.includes('food') || categoryName.includes('dining')) {
          categoryKeywords = ['restaurant', 'food', 'dining', 'cafe', 'pizza', 'burger', 'starbucks', 'mcdonalds', 'subway', 'tim hortons', 'harvey', 'chipotle', 'thai', 'poulet', 'amano', 'tst-pai', 'uber', 'ubereats'];
        } else if (categoryName.includes('transport')) {
          categoryKeywords = ['uber', 'lyft', 'taxi', 'transport', 'gas', 'fuel', 'parking', 'transit', 'presto', 'hopp', 'metrolinx', 'go transit', 'city of guelph'];
        } else if (categoryName.includes('entertainment')) {
          categoryKeywords = ['netflix', 'spotify', 'entertainment', 'movie', 'theater', 'gaming', 'steam'];
        } else if (categoryName.includes('shopping') || categoryName.includes('groceries')) {
          categoryKeywords = ['amazon', 'walmart', 'wal-mart', 'target', 'shopping', 'retail', 'store', 'mall', 'sobeys', 'food basics', 'dollarama', 'lcbo', 'frootland', 'no frills'];
        } else if (categoryName.includes('education')) {
          categoryKeywords = ['univ', 'university', 'college', 'school', 'act*univ', 'guelph'];
        } else if (categoryName.includes('clothing')) {
          categoryKeywords = ['h&m', 'hm ca', 'clothing', 'fashion'];
        } else {
          // For other categories, use the category name itself
          categoryKeywords = [categoryName.split(' ')[0]];
        }

        // Filter transactions that match this category
        const categoryTransactions = allTransactions.filter((transaction: any) => {
          const description = (transaction.description || '').toLowerCase();
          return categoryKeywords.some(keyword => description.includes(keyword)) && 
                 Math.abs(transaction.amount) > 0;
        });

        // Find the highest transaction in THIS specific category
        const highestTransaction = categoryTransactions.reduce((max: any, current: any) => {
          const currentAmount = Math.abs(current.amount);
          const maxAmount = Math.abs(max?.amount || 0);
          return currentAmount > maxAmount ? current : max;
        }, null);

        if (highestTransaction) {
          return {
            category: categoryData.category,
            isReal: true,
            amount: Math.abs(highestTransaction.amount),
            description: highestTransaction.description,
            location: highestTransaction.location || 'Not specified',
            date: highestTransaction.date || highestTransaction.transaction_date,
            percentage: ((categoryData.total_amount / Math.abs(dashboardData?.total_spent || 1)) * 100)
          };
        }

        // Fallback if no matching transactions found for this category
        const avgPerTransaction = categoryData.total_amount / categoryData.transaction_count;
        const simulatedAmount = avgPerTransaction * 2.5;
        return {
          category: categoryData.category,
          isReal: false,
          amount: simulatedAmount,
          description: `Highest expense in ${categoryData.category}`,
          location: 'Various locations',
          date: 'Recent',
          percentage: ((categoryData.total_amount / Math.abs(dashboardData?.total_spent || 1)) * 100)
        };
      });
  };

  const badSpendingExamples = findBadSpendingExamples();
  
  // Enhanced gradient colors for charts
  const SOLID_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading spending trends...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <Navigation />
      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Spending Trends & Analysis</h1>
            <p className="text-muted-foreground text-lg">
            Deep insights into your spending patterns and optimization opportunities
            </p>
          </div>

        {/* Detailed Breakdown and Insights */}
        <div className="grid lg:grid-cols-5 gap-8 mb-8">
          {/* Category Details */}
          <div className="lg:col-span-3">
            <Card className="card-cyber bg-gradient-to-br from-slate-900/40 to-slate-800/20 border-slate-600/30">
              <CardHeader className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-b border-slate-600/20">
                <CardTitle className="text-2xl bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent font-bold">
                  Category Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">Comprehensive breakdown of your spending patterns and optimization opportunities</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {spendingData.map((item: any, index: number) => {
                    const percentage = ((item.total_amount / Math.abs(dashboardData?.total_spent || 1)) * 100);
                    const avgPerTransaction = item.total_amount / item.transaction_count;
                    // Professional spending analysis
                    const isHighSpending = percentage > 25;
                    const isMediumSpending = percentage > 15;
                    const isFrequentBuying = item.transaction_count > 15;
                    
                    let statusLevel, gradientColors, statusMessage, statusColor;
                    if (isHighSpending) {
                      statusLevel = "Focus Area";
                      gradientColors = 'from-slate-700/40 to-slate-800/30 border-slate-500/40';
                      statusMessage = `${percentage.toFixed(1)}% of total spending`;
                      statusColor = 'text-blue-400';
                    } else if (isMediumSpending) {
                      statusLevel = "Monitor";
                      gradientColors = 'from-slate-700/30 to-slate-800/20 border-slate-600/30';
                      statusMessage = `${percentage.toFixed(1)}% of total spending`;
                      statusColor = 'text-slate-400';
                    } else {
                      statusLevel = "Optimized";
                      gradientColors = 'from-slate-700/20 to-slate-800/10 border-slate-600/20';
                      statusMessage = `${percentage.toFixed(1)}% of total spending`;
                      statusColor = 'text-green-400';
                    }
                    
                    const optimizationTarget = item.total_amount * 0.85; // 15% optimization target
                    
                    return (
                      <div key={index} className={`p-5 rounded-xl border bg-gradient-to-r ${gradientColors} hover:scale-[1.01] transition-all duration-300 shadow-lg`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div 
                                className="w-8 h-8 rounded-full shadow-lg border border-white/10" 
                                style={{ backgroundColor: SOLID_COLORS[index % SOLID_COLORS.length] }}
                              />
                              <div className="absolute inset-0 w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                    </div>
                    <div>
                              <h4 className="font-semibold text-xl text-white">{item.category}</h4>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full bg-black/30 ${statusColor} font-medium`}>
                                  {statusLevel}
                                </span>
                                <span className="text-xs text-slate-400">{statusMessage}</span>
                    </div>
                    </div>
                  </div>
                          <div className="text-right">
                            <p className="font-bold text-2xl text-white">
                              ${item.total_amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-slate-400 mb-1">Total Amount</p>
                            <p className="text-xs text-blue-400 font-medium">
                              Target: ${optimizationTarget.toFixed(0)}
                            </p>
            </div>
          </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 rounded-lg bg-black/20 backdrop-blur-sm border border-slate-600/30">
                            <p className="text-slate-400 text-xs font-medium">Transactions</p>
                            <p className="font-bold text-lg text-white">{item.transaction_count}</p>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-black/20 backdrop-blur-sm border border-slate-600/30">
                            <p className="text-slate-400 text-xs font-medium">Average</p>
                            <p className="font-bold text-lg text-white">${avgPerTransaction.toFixed(0)}</p>
              </div>
                          <div className="text-center p-3 rounded-lg bg-black/20 backdrop-blur-sm border border-slate-600/30">
                            <p className="text-slate-400 text-xs font-medium">Efficiency</p>
                            <p className={`font-bold text-lg ${statusColor}`}>
                              {isHighSpending ? 'Review' : isMediumSpending ? 'Good' : 'Optimal'}
                            </p>
              </div>
            </div>

                        {/* Professional Progress Bar */}
                        <div className="relative mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-400 font-medium">Category Allocation</span>
                            <span className="text-xs font-medium text-white">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
                              style={{ 
                                width: `${Math.min(percentage, 100)}%`,
                                background: `linear-gradient(90deg, ${SOLID_COLORS[index % SOLID_COLORS.length]}, ${SOLID_COLORS[index % SOLID_COLORS.length]}cc)`
                              }}
                            />
                          </div>
                      </div>
                      
                        {/* Optimization Insight */}
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full" />
                              <span className="text-blue-400 text-xs font-medium">Optimization Potential</span>
                          </div>
                            <span className="text-blue-300 text-sm font-medium">
                              ${(item.total_amount - optimizationTarget).toFixed(0)} savings opportunity
                            </span>
                          </div>
                        </div>
                      </div>
                );
              })}
            </div>
              </CardContent>
            </Card>
          </div>

          {/* Bad Spending Examples */}
          <div className="lg:col-span-2">
            <Card className="card-cyber bg-gradient-to-br from-red-900/20 via-orange-900/10 to-red-900/20 border-red-600/30 overflow-hidden relative">
              {/* Warning background effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/3 via-orange-600/5 to-red-600/3" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
              
              <CardHeader className="relative z-10 bg-gradient-to-r from-red-800/10 to-orange-800/10 border-b border-red-600/20 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
                      <AlertTriangle className="h-6 w-6 text-white" />
            </div>
                    <div className="absolute inset-0 w-12 h-12 bg-gradient-to-r from-red-400 to-orange-400 rounded-xl animate-ping opacity-20" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full animate-pulse" />
                      </div>
                      <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                      Spending Red Flags
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                        <div className="w-1 h-1 bg-orange-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
                        <div className="w-1 h-1 bg-red-200 rounded-full animate-pulse" style={{animationDelay: '1s'}} />
                      </div>
                      <span className="text-xs text-red-400 font-medium tracking-wide">AVOIDABLE EXPENSES</span>
                    </div>
                  </div>
                </CardTitle>
                <CardDescription className="text-slate-300 font-medium">
                  High-cost transactions that could be avoided • Protect your Martian credits
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 p-6">
                <div className="space-y-4">
                  {badSpendingExamples.map((example: any, index: number) => {
                    // Generate category-specific avoidance strategies
                    let avoidanceStrategy, merchantExample;
                    const categoryName = example.category.toLowerCase();
                    
                    if (categoryName.includes('food') || categoryName.includes('dining') || categoryName.includes('restaurant')) {
                      avoidanceStrategy = "Cook at home, meal prep, use grocery store deals";
                      merchantExample = example.isReal ? `Real transaction: ${example.description}` : "Expensive restaurant when local options cost 60% less";
                    } else if (categoryName.includes('transport') || categoryName.includes('uber') || categoryName.includes('taxi')) {
                      avoidanceStrategy = "Use public transit, walk short distances, plan trips";
                      merchantExample = example.isReal ? `Real transaction: ${example.description}` : "Long rideshare when public transit available";
                    } else if (categoryName.includes('entertainment') || categoryName.includes('streaming')) {
                      avoidanceStrategy = "Cancel unused subscriptions, use free alternatives";
                      merchantExample = example.isReal ? `Real transaction: ${example.description}` : "Multiple subscriptions when 1-2 would suffice";
                    } else if (categoryName.includes('shopping') || categoryName.includes('retail')) {
                      avoidanceStrategy = "Wait 24 hours, compare prices, buy on sale";
                      merchantExample = example.isReal ? `Real transaction: ${example.description}` : "Impulse purchase when alternatives available";
                    } else {
                      avoidanceStrategy = "Research alternatives, negotiate better rates";
                      merchantExample = example.isReal ? `Real transaction: ${example.description}` : "Premium service when standard meets needs";
                    }

                    return (
                      <div key={index} className="group p-5 rounded-xl border bg-gradient-to-r from-red-600/10 via-orange-600/5 to-red-600/10 border-red-500/30 hover:scale-[1.01] transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm relative overflow-hidden">
                        {/* Warning shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        
                        <div className="flex items-start space-x-4 relative z-10">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                              <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute inset-0 w-10 h-10 bg-gradient-to-r from-red-400 to-orange-400 rounded-xl animate-pulse opacity-30" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold text-white text-base">
                                  {example.category} - {example.isReal ? 'Actual' : 'Estimated'} High Expense
                                </h4>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                                  <span className="text-red-400 text-xs font-medium">
                                    {example.isReal ? 'Actual High Transaction' : 'Estimated Wasteful Transaction'}
                                  </span>
                                </div>
                                <p className="text-red-300 text-sm font-medium">
                                  ${example.amount.toFixed(2)} - {example.description}
                                </p>
                                <div className="flex justify-between text-slate-400 text-xs mt-1">
                                  <span>📍 {example.location}</span>
                                  <span>📅 {example.date}</span>
                                </div>
                              </div>
                              
                              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                                  <span className="text-green-400 text-xs font-medium">Smart Alternative</span>
                                </div>
                                <p className="text-green-300 text-sm">{avoidanceStrategy}</p>
                                <p className="text-slate-400 text-xs mt-1">
                                  Potential savings: ${(example.amount * 0.6).toFixed(0)} per month
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                );
              })}
            </div>

                <div className="mt-6 bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-orange-400 font-semibold">Monthly Savings Goal</span>
                </div>
                  <p className="text-slate-300 text-sm mb-2">
                    By avoiding these expensive transactions, you could save up to{' '}
                    <span className="text-green-400 font-bold">
                      ${badSpendingExamples.reduce((total: number, example: any) => total + (example.amount * 0.6), 0).toFixed(0)}
                    </span>{' '}
                    per month from these specific high-cost transactions alone.
                  </p>
                  <p className="text-slate-400 text-xs">
                    {badSpendingExamples.filter((ex: any) => ex.isReal).length > 0 
                      ? `${badSpendingExamples.filter((ex: any) => ex.isReal).length} of these are actual transactions from your Databricks data.`
                      : 'Analysis based on your spending patterns and transaction history.'
                    } Focus on your highest spending categories for maximum impact on your Martian credit balance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}