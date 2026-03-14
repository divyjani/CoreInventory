'use client';

import React, { useState, useEffect } from 'react';
import DeliveryForm from '../../components/deliveries/DeliveryForm';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [validating, setValidating] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/deliveries');
      const data = await res.json();
      if (data.ok) {
        setDeliveries(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch deliveries', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleValidate = async (deliveryId: string) => {
    if (!confirm("Validate delivery? This permanently removes stock.")) return;
    
    try {
      setValidating(deliveryId);
      const res = await fetch('/api/deliveries/validate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId })
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) {
        if (data.error === 'Insufficient stock' && data.details) {
          alert(`Cannot deliver: Insufficient stock for some products.`);
          fetchDeliveries(); // Reload to see the 'waiting' status
        } else {
          alert(data.error || 'Failed to validate delivery');
        }
        return;
      }
      
      setDeliveries(deliveries.map(d => d._id === deliveryId ? { ...d, status: 'done' } : d));
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
      case 'waiting': return 'warning';
      case 'done': return 'success';
      case 'cancelled': return 'danger';
      default: return 'neutral';
    }
  };

  const columns = [
    { key: 'ref', label: 'Reference' },
    { key: 'dest', label: 'Destination Address' },
    { key: 'date', label: 'Schedule Date' },
    { key: 'status', label: 'Status', align: 'center' as const },
    { key: 'actions', label: 'Actions', align: 'right' as const }
  ];

  const renderRow = (delivery: any) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{delivery.reference}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
         <span className="block font-medium text-gray-800 truncate max-w-[200px]">{delivery.deliveryAddress}</span>
         <span className="text-xs text-gray-400">from {delivery.warehouseId?.name}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(delivery.scheduleDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Badge variant={getStatusBadgeVariant(delivery.status)} className="uppercase tracking-wider">
          {delivery.status}
        </Badge>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
        {delivery.status !== 'done' && delivery.status !== 'cancelled' && (
          <Button 
            onClick={() => handleValidate(delivery._id)}
            disabled={validating === delivery._id}
            className="px-3 py-1.5 text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-800"
          >
            {validating === delivery._id ? 'Validating...' : 'Validate'}
          </Button>
        )}
        <Button variant="secondary" className="px-3 py-1.5 text-xs">Print</Button>
      </td>
    </>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Deliveries</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage outbound customer orders and shipments.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>+ New Delivery Order</Button>
      </div>

      <Table 
        columns={columns} 
        data={deliveries} 
        renderRow={renderRow} 
        loading={loading}
        emptyMessage="No pending deliveries found."
      />

      {isFormOpen && (
        <DeliveryForm onClose={() => setIsFormOpen(false)} onSuccess={() => { setIsFormOpen(false); fetchDeliveries(); }} />
      )}
    </div>
  );
}
