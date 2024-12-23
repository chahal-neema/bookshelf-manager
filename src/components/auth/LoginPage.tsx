import { useState } from 'react';
import { signIn, signUp, AuthError } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Library } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateInput = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateInput()) return;

    try {
      setLoading(true);
      setError(null);
      await signIn(email, password);
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    try {
      setLoading(true);
      setError(null);
      await signUp(email, password);
      // Sign in immediately after successful signup
      await signIn(email, password);
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Library className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">BookShelf</h2>
          <p className="mt-2 text-sm text-gray-600">
            Track your reading journey
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              onClick={handleLogin}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Demo Account:</p>
              <p>Email: demo@example.com</p>
              <p>Password: demo123</p>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password (min 6 characters)"
                required
                minLength={6}
              />
            </div>
            <Button
              onClick={handleSignUp}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}