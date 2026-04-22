import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
          <p className="mt-2 text-sm text-gray-600 mb-6">
            La page que vous cherchez n'existe pas.
          </p>
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
