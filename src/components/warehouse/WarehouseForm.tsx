import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

type WarehouseFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function WarehouseForm({ onClose, onSuccess }: WarehouseFormProps) {
  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/warehouses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, shortCode, address })
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to create warehouse');
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
          <h2 className="text-xl font-bold text-gray-900">New Physical Facility</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">&times;</button>
        </div>
        
        {error && <div className="bg-danger-50 text-danger-500 border border-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Facility Name *</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
              placeholder="e.g. Main Distribution Center"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Code *</label>
            <input 
              required
              type="text" 
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value.toUpperCase())}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 uppercase font-mono tracking-wider focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
              placeholder="MDC"
              maxLength={10}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address</label>
            <textarea 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="123 Logistics Way..."
            />
          </div>
          
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Facility'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
