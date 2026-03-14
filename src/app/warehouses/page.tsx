'use client';

import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import WarehouseForm from '../../components/warehouse/WarehouseForm';

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/warehouses');
      const data = await res.json();
      if (data.ok) {
        setWarehouses(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch warehouses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchWarehouses();
  };

  const columns = [
    { key: 'name', label: 'Warehouse Name' },
    { key: 'code', label: 'Short Code', align: 'center' as const },
    { key: 'address', label: 'Address' },
    { key: 'actions', label: 'Actions', align: 'right' as const },
  ];

  const renderRow = (wh: any) => (
    <>
      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{wh.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono text-sm border border-gray-200">{wh.shortCode}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-xs">{wh.address}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <Button variant="secondary" className="px-3 py-1 text-xs">Edit</Button>
      </td>
    </>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Facilities</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage warehouses and physical locations.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>+ Add Warehouse</Button>
      </div>

      <Table 
        columns={columns} 
        data={warehouses} 
        renderRow={renderRow} 
        loading={loading}
        emptyMessage="No warehouses figured in this tenant. Add your primary facility to start."
      />

      {isFormOpen && (
        <WarehouseForm onClose={() => setIsFormOpen(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
