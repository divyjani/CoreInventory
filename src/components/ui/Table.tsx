import React, { ReactNode } from 'react';

type TableProps = {
  columns: { key: string; label: string; align?: 'left' | 'center' | 'right' }[];
  data: any[];
  renderRow: (item: any) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
};

export default function Table({ columns, data, renderRow, loading, emptyMessage = 'No data found.' }: TableProps) {
  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse bg-gray-50 rounded-xl border border-gray-100">Loading...</div>;
  if (!data?.length) return <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-gray-100">{emptyMessage}</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider ${
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item._id || index} className="hover:bg-gray-50 transition-colors">
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
