import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Truck, Key, Mail, Lock } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Card from '@/components/ui/card';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50/30 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Visual Branding Section (Left) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-tr from-purple-700 via-indigo-800 to-indigo-950 lg:block">
        {/* Abstract Floating Orbs */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>

        {/* Content Overlay */}
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <Truck className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight">TransportFlow</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white my-0">
              Streamline Your <br />
              Logistics Pipeline.
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-gray-300">
              A comprehensive transport fleet, driver, trip, and compliance scheduling engine for advanced manufacturing.
            </p>
          </div>

          <div className="text-xs text-gray-400">
            &copy; 2026 TransportFlow. Built with ❤️ using React 19 & Express 5.
          </div>
        </div>
      </div>

      {/* Form Credentials Section (Right) */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <Card className="w-full max-w-md bg-white/70 dark:bg-gray-900/60 shadow-xl border-none">
          <Card.Header className="space-y-1 text-center p-6 pb-2">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-sm">
              <Shield className="h-6 w-6" />
            </div>
            <Card.Title className="text-2xl font-bold tracking-tight my-0">Welcome Back</Card.Title>
            <Card.Description className="text-xs">
              Enter your credentials to access the transport console.
            </Card.Description>
          </Card.Header>

          <Card.Content className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-3 text-center text-xs font-semibold text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Corporate Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="name@transport.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Access Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Log In Trigger */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-11 font-bold mt-2"
              >
                {submitting ? 'Authenticating...' : 'Sign In to Console'}
              </Button>
            </form>

            {/* Quick Login Guide */}
            <div className="mt-6 border-t border-gray-200/50 pt-4 text-center dark:border-gray-800/50">
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <Key className="h-3.5 w-3.5" />
                <span>Demo Accounts: <b>admin@transport.com</b> / <b>admin123</b></span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Login;
