"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StatementViewer from "@/components/StatementViewer";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function StatementPage() {
  const params = useParams();
  const [statementData, setStatementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatement = async () => {
      if (!params.id) return;

      try {
        const response = await fetch(`/api/v1/statements/${params.id}`, {
          headers: {
            "Authorization": "Bearer mock-jwt-token",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch statement: ${response.status}`);
        }

        const data = await response.json();
        setStatementData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStatement();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading statement data...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </Card>
      </div>
    );
  }

  if (!statementData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Statement Not Found</h1>
          <p className="text-gray-600">The requested statement could not be found.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <StatementViewer data={statementData} />
    </div>
  );
}
