import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

type ProductFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function ProductForm({ onClose, onSuccess }: ProductFormProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [unitCost, setUnitCost] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sku, unitCost: parseFloat(unitCost) || 0 })
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to create product');
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">New Product Configuration</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">&times;</button>
        </div>
        
        {error && <div className="bg-danger-50 text-danger-500 border border-red-200 p-3 rounded mb-5 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name *</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
              placeholder="e.g. Ergonomic Office Chair"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">SKU Reference *</label>
            <input 
              required
              type="text" 
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
              placeholder="e.g. CHR-001"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Standard Unit Cost</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input 
                type="number" 
                min="0"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors" 
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Product'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
