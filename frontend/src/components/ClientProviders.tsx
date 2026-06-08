'use client';

import { LangProvider } from '@/lib/lang';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}