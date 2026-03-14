'use client';

import React, { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

export default function MoveHistoryPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const fetchMoves = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (typeFilter) query.set('type', typeFilter);
        
        const res = await fetch(`/api/movements?${query.toString()}`);
        const data = await res.json();
        if (data.ok) {
          setMovements(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch moves', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMoves();
  }, [typeFilter]);

  const filteredMoves = movements.filter(m => 
    (m.reference || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
    (m.productId?.name || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getMoveColor = (type: string) => {
    switch (type) {
      case 'IN': return 'success';
      case 'OUT': return 'danger';
      case 'TRANSFER': return 'info';
      case 'ADJUSTMENT': return 'warning';
      default: return 'neutral';
    }
  };

  const columns = [
    { key: 'ref', label: 'Reference' },
    { key: 'date', label: 'Date' },
    { key: 'product', label: 'Product' },
    { key: 'from', label: 'From Location' },
    { key: 'to', label: 'To Location' },
    { key: 'qty', label: 'Quantity', align: 'right' as const },
    { key: 'type', label: 'Type', align: 'center' as const },
    { key: 'status', label: 'Status', align: 'center' as const }
  ];

  const renderRow = (move: any) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{move.reference}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(move.date).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{move.productId?.name || 'Unknown'}</div>
        <div className="text-xs text-gray-400 font-mono mt-0.5">{move.productId?.sku}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {move.fromLocation ? (move.fromLocation.name || move.fromLocation) : <span className="text-gray-400 italic">Vendor / External</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {move.toLocation ? (move.toLocation.name || move.toLocation) : <span className="text-gray-400 italic">Customer / External</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
        {move.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Badge variant={getMoveColor(move.type)} className="w-24 justify-center uppercase tracking-wider text-[10px]">{move.type}</Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
         <span className={`text-xs font-semibold ${move.status === 'done' ? 'text-success-500' : 'text-gray-500'}`}>{move.status.toUpperCase()}</span>
      </td>
    </>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Movement History</h1>
        <p className="text-gray-500 mt-2 text-sm">Chronological ledger of all inventory operations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1 relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by reference or product name..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        <select 
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Movement Types</option>
          <option value="IN">Inward (IN)</option>
          <option value="OUT">Outward (OUT)</option>
        </select>
      </div>

      <Table 
        columns={columns} 
        data={filteredMoves} 
        renderRow={renderRow} 
        loading={loading}
        emptyMessage="No movement logs found matching your filters."
      />
    </div>
  );
}
