import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-4xl font-bold text-white">404</span>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
