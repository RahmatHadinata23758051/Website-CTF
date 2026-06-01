import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { login } from "../features/auth/api";
import { useAuthStore } from "../stores/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await login(email, password);
      if (response.success && response.data) {
        setAuth(response.data.token, response.data.user);
        const from = (location.state as any)?.from || "/challenges";
        navigate(from);
      } else {
        setError(response.message || "Authentication rejected. Invalid credentials.");
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Network connection failure. Unable to reach the server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 select-text">
      <div className="bg-card-bg border border-border-ui p-8 relative overflow-hidden flex flex-col justify-between text-left space-y-6">
        {/* Top lime neon bar on form card */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-cyber-cyan"></div>

        <div className="space-y-1">
          <div className="font-mono text-[9px] text-cyber-cyan tracking-[0.2em] uppercase font-bold select-none">
            STAGE_AUTH / SIGNIN
          </div>
          <h1 className="font-display font-bold text-2xl text-fg uppercase tracking-tight leading-none">
            Competitor Login
          </h1>
          <p className="font-sans text-fg-muted text-xs mt-2 leading-relaxed">
            Authenticate using your credentials to secure connection tunnels, query active challenges, and register solves.
          </p>
        </div>

        {error && (
          <Alert variant="error" title="CONNECTION REJECTED" className="max-w-full">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Security Email Node"
            type="email"
            placeholder="operator@rblxsec.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
          />

          <Input
            label="Cryptographic Passphrase"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="current-password"
          />

          <div className="flex justify-between items-center -mt-2 font-mono text-[9px] uppercase select-none">
            <span />
            <Link to="/forgot-password" className="text-fg-subtle hover:text-cyber-cyan transition-colors font-bold">
              Forgot password?
            </Link>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full py-3" disabled={isLoading}>
              {isLoading ? "ESTABLISHING TUNNEL..." : "Initialize Connection"}
            </Button>
          </div>
        </form>

        <div className="border-t border-border-subtle pt-4 text-center font-mono text-[10px] text-fg-subtle uppercase tracking-wide">
          New to RBLXSec?{" "}
          <Link to="/register" className="text-cyber-cyan hover:text-fg transition-colors font-bold ml-1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
