'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/';

  if (isAuthRoute) {
    return (
      <main className="flex-1 w-full overflow-y-auto min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64 overflow-hidden h-screen bg-gray-50">
        <Header />
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </>
  );
}
