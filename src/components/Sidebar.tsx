'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Products', href: '/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Facilities', href: '/warehouses', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Stock Ledger', href: '/stock', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  const operationsItems = [
    { name: 'Inbound Receipts', href: '/receipts', icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z' },
    { name: 'Outbound Deliveries', href: '/deliveries', icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { name: 'Movement History', href: '/move-history', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const RenderLinks = ({ items, title }: { items: any[], title: string }) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map(item => {
          const active = pathname === item.href;
          return (
            <li key={item.name}>
              <Link 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-sidebar-active text-white font-medium shadow-sm' 
                    : 'text-gray-300 hover:bg-sidebar-hover hover:text-white'
                }`}
              >
                <svg className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside className="w-64 bg-sidebar-bg text-gray-100 flex flex-col h-screen fixed shadow-xl z-30 font-primary">
      <div className="h-16 flex items-center px-6 border-b border-gray-700/50 mb-4 bg-gray-900/20">
        <svg className="w-8 h-8 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <span className="text-lg font-bold tracking-tight text-white">CloudERP</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
        <RenderLinks items={navItems} title="Core Catalog" />
        <RenderLinks items={operationsItems} title="Operations" />
        
        <div className="mt-8 border-t border-gray-700/50 pt-4">
          <Link 
            href="/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-sidebar-hover hover:text-white transition-all duration-200"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            System Settings
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-700/50 bg-gray-900/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
            WS
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Primary Tenant</span>
            <span className="text-xs text-gray-400">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
