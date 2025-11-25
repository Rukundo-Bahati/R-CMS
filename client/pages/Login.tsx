import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { credentials, findCredential } from "@/data/credentials";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const credential = findCredential(email);

      if (credential && password === credential.password) {
        login({
          id: credential.role,
          name: credential.name,
          email: credential.email,
          portal: credential.role,
        });
        navigate(`/dashboard/${credential.role}`);
      } else {
        setError("Invalid email or password");
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-lg p-3 mb-4">
            <div className="text-3xl font-bold text-primary">RCA</div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">R-CMS</h1>
          <p className="text-gray-300">Church Management System</p>
        </div>

        {/* Login Card */}
        <Card className="p-8 bg-white shadow-2xl h-96">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-gray-700 font-semibold text-lg">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 bg-gray-50 border-gray-300 h-14 text-lg"
                required
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-gray-700 font-semibold text-base">
                Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border-gray-300 pr-10 h-12 text-base"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          RCA R-CMS v1.0
        </p>
      </div>
    </div>
  );
}
