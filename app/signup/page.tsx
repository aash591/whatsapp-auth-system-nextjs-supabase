'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthenticatedRequest } from '@/lib/use-csrf';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { makeRequest, isLoading: csrfLoading } = useAuthenticatedRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await makeRequest('/api/generate-code', {
        method: 'POST',
        body: JSON.stringify({ name, whatsappNumber }),
      });

      const data = await response.json();

      if (data.success) {
        // Clean phone number and construct WhatsApp URL
        let botNumber = process.env.NEXT_PUBLIC_WHATSAPP_BOT_NUMBER || '';
        botNumber = botNumber.replace(/[\s\-\(\)\+]/g, '');
        
        const messageTemplate = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE_TEMPLATE || 'verify {CODE}';
        const message = messageTemplate.replace('{CODE}', data.code);
        const encodedMessage = encodeURIComponent(message);
        
        const whatsappUrl = `https://wa.me/${botNumber}?text=${encodedMessage}`;
        
        // Redirect to verification status page
        router.push('/verification-status');
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
      } else {
        // Check if user already exists
        if (data.redirectToLogin) {
          setError(data.error);
        } else {
          setError(data.error || 'Failed to generate code');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading if CSRF token is being fetched
  if (csrfLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Verify your identity via WhatsApp to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <input
              id="phone"
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
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
            {loading ? 'Generating Code...' : 'Continue with WhatsApp'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
