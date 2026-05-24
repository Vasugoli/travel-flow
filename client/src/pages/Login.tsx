import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Eye, EyeOff } from 'lucide-react';
import useAuth from '@/hooks/useAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex text-text-primary">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-surface border-r border-border relative overflow-hidden">
        {/* Blueprint dot grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Truck className="text-canvas" size={22} />
            </div>
            <span className="font-display font-bold text-2xl text-text-primary">
              TransportFlow
            </span>
          </div>
          <h2 className="font-display font-bold text-5xl text-text-primary leading-tight mb-4">
            Logistics<br />Command<br />Centre
          </h2>
          <p className="text-text-secondary text-base max-w-xs leading-relaxed">
            Full-stack transport management for manufacturing operations.
            Track every vehicle, driver, and delivery in real time.
          </p>
        </div>

        <p className="relative z-10 text-xs text-text-tertiary">
          © 2026 TransportFlow. All rights reserved.
        </p>
      </div>

      {/* Right login panel */}
      <div className="flex-1 lg:max-w-md flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Truck className="text-canvas" size={16} />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">TransportFlow</span>
          </div>

          <h1 className="font-display font-bold text-3xl text-text-primary mb-1">Welcome back</h1>
          <p className="text-sm text-text-secondary mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg border border-danger/25 bg-danger/10 p-3 text-center text-xs font-semibold text-danger">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Email</label>
              <input
                type="email"
                required
                className="w-full bg-elevated border border-border rounded-lg px-4 py-2.5
                           text-base text-text-primary placeholder:text-text-tertiary
                           focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                           transition-all duration-150"
                placeholder="admin@transport.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-secondary">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-elevated border border-border rounded-lg pl-4 pr-10 py-2.5
                             text-base text-text-primary placeholder:text-text-tertiary
                             focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                             transition-all duration-150"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary-hover text-canvas font-semibold
                         py-3 rounded-lg text-base transition-colors duration-150 active:scale-[0.98] mt-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div className="mt-8 border-t border-border pt-4 text-center">
            <p className="text-xs text-text-tertiary">
              Demo Account: <span className="font-mono text-text-secondary">admin@transport.com</span> / <span className="font-mono text-text-secondary">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
