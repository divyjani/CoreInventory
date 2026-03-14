import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

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
        console.error('Failed to load selects', err);
      }
    };
    fetchSelectData();
  }, []);

  const handleItemChange = (index: number, field: 'productId' | 'quantity', value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (items.some(i => !i.productId || i.quantity <= 0)) {
        throw new Error("Invalid items configuration.");
      }

      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier, warehouseId, responsibleUser, 
          scheduleDate: new Date(scheduleDate).toISOString(), 
          items
        })
      });
      const data = await res.json();
      
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to create');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <Card className="w-full max-w-2xl shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Incoming Shipment Draft</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        
        {error && <div className="bg-danger-50 text-danger-500 border border-danger-200 p-3 rounded-lg mb-6 text-sm flex gap-2"><svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Supplier Name *</label>
              <input required type="text" value={supplier} onChange={(e) => setSupplier(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Destination *</label>
              <select required value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-primary-500">
                <option value="">Select Location...</option>
                {warehouses.map(wh => (<option key={wh._id} value={wh._id}>{wh.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Worker</label>
              <input required type="text" value={responsibleUser} onChange={(e) => setResponsibleUser(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Expected Date *</label>
              <input required type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-primary-500" />
            </div>
          </div>

          <div className="mt-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Operations Lines</h3>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <select required value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} className="flex-1 border border-gray-300 rounded shadow-sm px-2 py-2 text-sm focus:ring-primary-500">
                    <option value="">Pick Item...</option>
                    {products.map(prod => (<option key={prod._id} value={prod._id}>[{prod.sku}] {prod.name}</option>))}
                  </select>
                  <input required type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="w-24 border border-gray-300 rounded shadow-sm px-2 py-2 text-sm text-right focus:ring-primary-500" />
                  {items.length > 1 && (
                    <button type="button" onClick={() => handleRemoveItem(index)} className="text-gray-400 hover:text-danger-500 px-2 py-1">&times;</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setItems([...items, { productId: '', quantity: 1 }])} className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-800">+ Add Line Item</button>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Discard Draft</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Confirm Draft'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
