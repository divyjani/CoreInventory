'use client';

import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import ProductForm from '../../components/products/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.ok) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSuccess = () => {
    setIsFormOpen(false);
    fetchProducts();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'info', label: 'Product Info' },
    { key: 'cost', label: 'Unit Cost', align: 'right' as const },
    { key: 'status', label: 'Status', align: 'center' as const },
    { key: 'actions', label: 'Actions', align: 'right' as const },
  ];

  const renderRow = (product: any) => {
    const isOnHardLow = product.onHand !== undefined && product.onHand < 10;
    return (
      <>
        <td className="px-6 py-4 whitespace-nowrap">
           <div className="font-bold text-gray-900">{product.name}</div>
           <div className="text-sm text-gray-500 font-mono mt-0.5">{product.sku}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium text-right">
          ${(product.unitCost || 0).toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-center">
          {(isOnHardLow || product.onHand === undefined) ? (
            <Badge variant="danger">Low Stock</Badge>
          ) : (
            <Badge variant="success">In Stock</Badge>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
          <Button variant="secondary" className="px-3 py-1.5 text-xs">Edit</Button>
        </td>
      </>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Products Catalog</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage items, variants, and base pricing rules.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="shadow-md">+ Create Product</Button>
      </div>

      <Card className="mb-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      <Table 
        columns={columns} 
        data={filteredProducts} 
        renderRow={renderRow} 
        loading={loading}
        emptyMessage="No products found in the catalog. Create one to get started." 
      />

      {isFormOpen && (
        <ProductForm onClose={() => setIsFormOpen(false)} onSuccess={handleSuccess} />
      )}
    </div>
  );
}
