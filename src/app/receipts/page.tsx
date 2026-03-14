'use client';

import React, { useState, useEffect } from 'react';
import ReceiptForm from '../../components/receipts/ReceiptForm';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [validating, setValidating] = useState<string | null>(null);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/receipts');
      const data = await res.json();
      if (data.ok) {
        setReceipts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch receipts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleValidate = async (receiptId: string) => {
    if (!confirm("Validate receipt? This permanently records inward stock.")) return;
    
    try {
      setValidating(receiptId);
      const res = await fetch('/api/receipts/validate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptId })
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) {
        alert(data.error || 'Failed to validate receipt');
        return;
      }
      
      setReceipts(receipts.map(r => r._id === receiptId ? { ...r, status: 'done' } : r));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setValidating(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case 'draft': return 'neutral';
      case 'ready': return 'info';
      case 'done': return 'success';
      default: return 'neutral';
    }
  };

  const columns = [
    { key: 'ref', label: 'Reference' },
    { key: 'supp', label: 'Supplier & Destination' },
    { key: 'date', label: 'Schedule Date' },
    { key: 'status', label: 'Status', align: 'center' as const },
    { key: 'actions', label: 'Actions', align: 'right' as const }
  ];

  const renderRow = (receipt: any) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{receipt.reference}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
         <span className="block font-medium text-gray-800">{receipt.supplier}</span>
         <span className="text-xs text-gray-400">to {receipt.warehouseId?.name}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(receipt.scheduleDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Badge variant={getStatusBadgeVariant(receipt.status)} className="uppercase tracking-wider">
          {receipt.status}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
        {receipt.status !== 'done' && (
          <Button 
            onClick={() => handleValidate(receipt._id)}
            disabled={validating === receipt._id}
            className="px-3 py-1.5 text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-800"
          >
            {validating === receipt._id ? 'Validating...' : 'Validate'}
          </Button>
        )}
        <Button variant="secondary" className="px-3 py-1.5 text-xs">Print</Button>
      </td>
    </>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Receipts</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage incoming supplier inventory.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>+ New Receipt</Button>
      </div>

      <Table 
        columns={columns} 
        data={receipts} 
        renderRow={renderRow} 
        loading={loading}
        emptyMessage="No pending receipts found."
      />

      {isFormOpen && (
        <ReceiptForm onClose={() => setIsFormOpen(false)} onSuccess={() => { setIsFormOpen(false); fetchReceipts(); }} />
      )}
    </div>
  );
}
