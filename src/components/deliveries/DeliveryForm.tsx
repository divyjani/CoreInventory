import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

type DeliveryFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function DeliveryForm({ onClose, onSuccess }: DeliveryFormProps) {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [responsibleUser, setResponsibleUser] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: '1' }]);
  
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
      const parsedItems = items.map(i => ({ productId: i.productId, quantity: parseInt(String(i.quantity)) || 1 }));
      if (parsedItems.some(i => !i.productId || i.quantity <= 0)) {
        throw new Error("Please select a product and enter a valid quantity for each line.");
      }

      const res = await fetch('/api/deliveries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryAddress, warehouseId, responsibleUser,
          scheduleDate: new Date(scheduleDate).toISOString(),
          items: parsedItems
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
          <h2 className="text-xl font-bold text-gray-900">Outbound Delivery Order</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        
        {error && <div className="bg-danger-50 text-danger-500 border border-danger-200 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Delivery Address *</label>
              <textarea required value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500" placeholder="123 Customer St..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Source Warehouse *</label>
              <select required value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-primary-500">
                <option value="">Select Location...</option>
                {warehouses.map(wh => (<option key={wh._id} value={wh._id}>{wh.name}</option>))}
              </select>
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
                  <input required type="number" min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} className="w-24 border border-gray-300 rounded shadow-sm px-2 py-2 text-sm text-right focus:ring-primary-500" />
                  {items.length > 1 && (
                    <button type="button" onClick={() => handleRemoveItem(index)} className="text-gray-400 hover:text-danger-500 px-2 py-1">&times;</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setItems([...items, { productId: '', quantity: 1 }])} className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-800">+ Add Line Item</button>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Discard</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Confirm Order'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
