'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, LogIn, TriangleAlert } from 'lucide-react';

const inputClass =
  'w-full rounded-md border border-line-strong bg-bg px-4 py-3 text-base text-fg transition-colors duration-200 disabled:opacity-60';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Check if session was created successfully
        const session = await getSession();
        if (session) {
          router.push('/admin');
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-bg px-5 py-12">
      <div aria-hidden="true" className="hero-grid absolute inset-0 -z-10" />

      <div className="hero-in w-full max-w-md">
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-lift">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#f87171]" />
            <span className="h-3 w-3 rounded-full bg-[#fbbf24]" />
            <span className="h-3 w-3 rounded-full bg-[#4ade80]" />
            <span className="ml-3 font-mono text-xs text-muted">
              admin@portfolio: ~/login
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-semibold text-fg">
              <span className="text-brand" aria-hidden="true">
                $ {''}
              </span>
              Admin login
            </h1>
            <p className="mt-2 text-muted">
              Sign in to manage your portfolio content.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-fg">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={inputClass}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm text-fg"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={inputClass}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
                >
                  <TriangleAlert
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-accent w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    Signing in
                  </>
                ) : (
                  <>
                    Sign in
                    <LogIn className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex min-h-[2.75rem] items-center gap-2 font-mono text-sm text-muted transition-colors duration-200 hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to site
        </Link>
      </div>
    </div>
  );
}
