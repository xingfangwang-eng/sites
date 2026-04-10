"use client";

import { signIn } from 'next-auth/react';
import { Globe } from 'lucide-react';

export default function GoogleLoginButton() {
  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
    >
      <Globe size={20} className="text-gray-600" />
      <span className="text-sm font-medium text-gray-900">Sign in with Google</span>
    </button>
  );
}
