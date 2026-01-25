import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="bg-card p-12 rounded-3xl shadow-xl border border-border text-center max-w-md w-full">
        <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
