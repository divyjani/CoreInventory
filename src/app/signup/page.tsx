'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [loginId, setLoginId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pass: string) => {
    // 6–12 characters, 1 uppercase, 1 lowercase, 1 special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,12}$/;
    return regex.test(pass);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginId || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be 6-12 characters long and include at least one uppercase letter, one lowercase letter, and one special character.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, email, password }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        router.push('/login');
      } else {
        setError(data.error || 'Failed to sign up');
      }
    } catch (err: any) {
      setError('An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="bg-white p-8 rounded-lg shadow-md border border-[#E2E8F0] w-full max-w-md">
        <div className="text-center mb-8">
           <div className="flex justify-center mb-4">
            <svg className="w-10 h-10 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Create an account</h2>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1">Login ID</label>
            <input
              type="text"
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              placeholder="Choose a Login ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1">Password</label>
             <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              placeholder="6-12 chars, 1 upper, 1 lower, 1 special"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1">Confirm Password</label>
             <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-2 px-4 rounded-md transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

         <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-[#4F46E5] hover:text-[#4338CA] font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
