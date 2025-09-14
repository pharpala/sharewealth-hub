"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatementData {
  id: string;
  status: string;
  uploaded_at: string;
  text_extracted: string;
  enriched_data: any;
}

interface StatementViewerProps {
  data: StatementData;
}

export default function StatementViewer({ data }: StatementViewerProps) {
  // Parse the AI response
  let aiData = null;
  try {
    if (data.enriched_data?.choices?.[0]?.message?.content) {
      aiData = JSON.parse(data.enriched_data.choices[0].message.content);
    }
  } catch (e) {
    console.error("Failed to parse AI data:", e);
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-cyber mb-2">Financial Statement Analysis</h1>
        <Badge variant="outline" className="text-sm">
          Statement ID: {data.id}
        </Badge>
      </div>

      {aiData && (
        <div className="grid gap-6">
          {/* Customer Information */}
          {aiData.customer_info && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                👤 Customer Information
              </h2>
              <div className="space-y-2">
                <div><strong>Name:</strong> {aiData.customer_info.name}</div>
                {aiData.customer_info.address && (
                  <div><strong>Address:</strong> {aiData.customer_info.address}</div>
                )}
                {aiData.customer_info.contact_numbers && aiData.customer_info.contact_numbers.length > 0 && (
                  <div><strong>Contact:</strong> {aiData.customer_info.contact_numbers.join(", ")}</div>
                )}
              </div>
            </Card>
          )}

          {/* Account Summary */}
          {aiData.statement_metadata && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                📋 Account Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiData.statement_metadata.account_number && (
                  <div><strong>Account:</strong> {aiData.statement_metadata.account_number}</div>
                )}
                {aiData.statement_metadata.statement_period && (
                  <div>
                    <strong>Period:</strong> {aiData.statement_metadata.statement_period.start} to {aiData.statement_metadata.statement_period.end}
                  </div>
                )}
                {aiData.statement_metadata.statement_date && (
                  <div><strong>Statement Date:</strong> {aiData.statement_metadata.statement_date}</div>
                )}
              </div>
            </Card>
          )}

          {/* Financial Totals */}
          {aiData.totals && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                💰 Financial Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${aiData.totals.ending_balance}
                  </div>
                  <div className="text-sm text-gray-600">Current Balance</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${aiData.totals.minimum_payment}
                  </div>
                  <div className="text-sm text-gray-600">Min Payment</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    ${aiData.totals.purchases}
                  </div>
                  <div className="text-sm text-gray-600">Purchases</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    ${aiData.totals.interest_charges}
                  </div>
                  <div className="text-sm text-gray-600">Interest</div>
                </div>
              </div>
              {aiData.totals.payment_due_date && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <strong className="text-yellow-800">Payment Due:</strong> 
                  <span className="ml-2 text-yellow-700">{aiData.totals.payment_due_date}</span>
                </div>
              )}
            </Card>
          )}

          {/* Transactions */}
          {aiData.transactions && aiData.transactions.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                📝 Transactions ({aiData.transactions.length})
              </h2>
              <div className="space-y-2">
                {aiData.transactions.map((transaction: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      {transaction.transaction_date && (
                        <div className="text-sm text-gray-600">{transaction.transaction_date}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${transaction.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Promotions */}
          {aiData.promotions && aiData.promotions.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                🎯 Promotions & Offers
              </h2>
              <div className="space-y-3">
                {aiData.promotions.map((promo: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium">{promo.description}</div>
                    {promo.rate && <div className="text-sm text-blue-600">Rate: {promo.rate}</div>}
                    {promo.expiry && <div className="text-sm text-gray-600">Expires: {promo.expiry}</div>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Support Contact */}
          {aiData.support_contact && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                📞 Support Contact
              </h2>
              <div className="text-lg font-mono">{aiData.support_contact}</div>
            </Card>
          )}
        </div>
      )}

      {/* Raw Data Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">🔍 Raw Data</h2>
        <details className="space-y-4">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
            View Extracted Text
          </summary>
          <div className="mt-2 p-4 bg-gray-100 rounded-lg max-h-40 overflow-auto text-sm font-mono">
            {data.text_extracted}
          </div>
        </details>
        
        <details className="mt-4">
          <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
            View Full AI Response
          </summary>
          <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-lg max-h-60 overflow-auto text-xs">
            {JSON.stringify(data.enriched_data, null, 2)}
          </pre>
        </details>
      </Card>
    </div>
  );
}
