"use client";

import { SessionProvider } from 'next-auth/react';
import { DashboardProvider } from '@/context/DashboardContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </SessionProvider>
  );
}
