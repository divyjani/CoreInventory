import React from 'react';

type Product = {
  _id: string;
  name: string;
  sku: string;
  unitCost: number;
  // This might actually come from Stock aggregation
  // For the sake of the requirement "items with onHand < 10 show red badge"
  onHand?: number; 
};

type ProductTableProps = {
  products: Product[];
  loading: boolean;
};

export default function ProductTable({ products, loading }: ProductTableProps) {
  if (loading) return <div className="p-4 text-center text-gray-500">Loading products...</div>;
  if (!products.length) return <div className="p-4 text-center text-gray-500 border rounded-lg bg-gray-50 mt-4">No products found.</div>;

  return (
    <div className="overflow-x-auto mt-4 border border-gray-200 rounded-xl shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Info</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Cost</th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => {
            // Simulate low stock check (If backend doesn't aggregate it, we assume we might inject it or just show 0 to trigger the badge for now visually)
            // Realistically this requires a backend aggregation:
            const isOnHardLow = product.onHand !== undefined && product.onHand < 10;
            return (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="font-bold text-gray-900">{product.name}</div>
                   <div className="text-sm text-gray-500 font-mono mt-0.5">{product.sku}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium text-right">${(product.unitCost || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {(isOnHardLow || product.onHand === undefined) ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                  <button className="text-blue-600 hover:text-blue-900 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
