'use client';

import React, { useState, useEffect } from 'react';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';

export default function StockPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/stocks');
        const data = await res.json();
        if (data.ok) {
           // Sort by product name for better UX
          setStocks(data.data.sort((a: any, b: any) => 
            (a.productId?.name || '').localeCompare(b.productId?.name || '')
          ));
        }
      } catch (err) {
        console.error('Failed to fetch stocks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const columns = [
    { key: 'product', label: 'Product Details' },
    { key: 'location', label: 'Warehouse' },
    { key: 'cost', label: 'Unit Cost', align: 'right' as const },
    { key: 'onhand', label: 'On Hand', align: 'right' as const },
    { key: 'reserved', label: 'Reserved', align: 'right' as const },
    { key: 'freetouse', label: 'Free To Use', align: 'right' as const },
    { key: 'status', label: 'Health', align: 'center' as const }
  ];

  const renderRow = (stock: any) => {
    const isOutOfStock = stock.onHand === 0;
    const isLowStock = stock.onHand > 0 && stock.onHand < 10;
    
    return (
      <>
        <td className="px-6 py-4 whitespace-nowrap">
           <div className="font-bold text-gray-900">{stock.productId?.name || 'Unknown'}</div>
           <div className="text-xs text-gray-500 font-mono mt-0.5">{stock.productId?.sku || 'N/A'}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
           {stock.warehouseId?.shortCode || stock.warehouseId?.name || 'Unknown Location'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
          ${(stock.productId?.unitCost || 0).toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-right">
          {stock.onHand}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-right">
          {stock.reserved}
        </td>
        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 text-right">
          {stock.freeToUse !== undefined ? stock.freeToUse : (stock.onHand - stock.reserved)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {isOutOfStock ? (
            <Badge variant="danger">Out of Stock</Badge>
          ) : isLowStock ? (
            <Badge variant="warning">Low Stock</Badge>
          ) : (
             <Badge variant="success">Healthy</Badge>
          )}
        </td>
      </>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Stock Ledger</h1>
        <p className="text-gray-500 mt-2 text-sm">Real-time trace of inventory metrics per warehouse.</p>
      </div>

      <Table 
        columns={columns} 
        data={stocks} 
        renderRow={renderRow} 
        loading={loading}
        emptyMessage="No stock data found."
      />
    </div>
  );
}
