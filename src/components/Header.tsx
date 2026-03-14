import React from 'react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <input 
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Search anything (Press '/' to focus)"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-6">
        <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
           </svg>
           <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-danger-500 border-2 border-white rounded-full"></span>
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white cursor-pointer select-none">
          DJ
        </div>
      </div>
    </header>
  );
}
