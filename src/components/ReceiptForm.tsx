import React, { useState, useEffect } from 'react';

type ReceiptFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function ReceiptForm({ onClose, onSuccess }: ReceiptFormProps) {
  const [supplier, setSupplier] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [responsibleUser, setResponsibleUser] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch Warehouses and Products for dropdowns
    const fetchSelectData = async () => {
      try {
        const [whRes, prodRes] = await Promise.all([
          fetch('/api/warehouses'),
          fetch('/api/products')
        ]);
        const whData = await whRes.json();
        const prodData = await prodRes.json();
        
        if (whData.ok) setWarehouses(whData.data);
        if (prodData.ok) setProducts(prodData.data);
      } catch (err) {
        console.error('Failed to load select data', err);
      }
    };
    fetchSelectData();
  }, []);

  const handleAddItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (items.some(i => !i.productId || i.quantity <= 0)) {
        throw new Error("Please fill out all product items with valid quantities.");
      }

      const payload = {
        supplier,
        warehouseId,
        responsibleUser,
        scheduleDate: new Date(scheduleDate).toISOString(),
        items
      };

      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to create receipt');
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">New Incoming Receipt</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-200">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier *</label>
              <input 
                required
                type="text" 
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:bg-white focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination Warehouse *</label>
              <select
                required
                value={warehouseId}
                onChange={(e) => setWarehouseId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Warehouse...</option>
                {warehouses.map(wh => (
                  <option key={wh._id} value={wh._id}>{wh.name} ({wh.shortCode})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsible User *</label>
              <input 
                required
                type="text" 
                value={responsibleUser}
                onChange={(e) => setResponsibleUser(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:bg-white focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Schedule Date *</label>
              <input 
                required
                type="datetime-local" 
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:bg-white focus:ring-blue-500 focus:border-blue-500" 
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3 border-b pb-2">Items to Receive</h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <select
                      required
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Product...</option>
                      {products.map(prod => (
                        <option key={prod._id} value={prod._id}>[{prod.sku}] {prod.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <input 
                      required
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-right focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  {items.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button 
              type="button" 
              onClick={handleAddItem}
              className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-800"
            >
              + Add another product
            </button>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-5 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Creating...' : 'Create Draft Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
