'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVerificationStatus } from '@/lib/use-verification-status';
import { useAuthenticatedRequest } from '@/lib/use-csrf';
export default function SetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { makeRequest, isLoading: csrfLoading } = useAuthenticatedRequest();
  
  const { loading: authLoading, verified, name, code } = useVerificationStatus({
    enableRealtime: false,
    autoRedirect: false,
  });

  // Redirect if not verified
  useEffect(() => {
    if (!authLoading && !verified) {
      router.push('/verification-status');
    }
  }, [authLoading, verified, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Basic client-side validation (server will do full validation)
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      setError('Password must contain at least one letter');
      setLoading(false);
      return;
    }

    try {
      const response = await makeRequest('/api/set-password', {
        method: 'POST',
        body: JSON.stringify({ 
          password,
          code // Include the verification code to link the password to the verified user
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Redirect to protected page with a small delay to ensure cookie is set
          setTimeout(() => {
            router.push('/protected');
          }, 100);
        } else {
          // Check if user already exists
          if (data.redirectToLogin) {
            setError(data.error);
          } else {
            setError(data.error || 'Failed to set password');
          }
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to set password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || csrfLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!verified) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Your Password
          </h1>
          <p className="text-gray-600">
            {name ? `Welcome ${name}!` : 'Please'} set a secure password to {name ? 'complete your account setup' : 'reset your password'}.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a secure password"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters with at least one letter
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
              {error.includes('already exists') && (
                <div className="mt-2">
                  <button
                    onClick={() => router.push('/')}
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Go to Login Page
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            {loading ? 'Setting Password...' : 'Complete Setup'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}