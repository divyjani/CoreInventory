'use client';

import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    totalStock: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard');
        const json = await res.json();
        if (json.ok) {
          setStats(json.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-2 text-sm">Real-time update of your system metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Products</span>
            <span className="text-4xl font-extrabold text-gray-900">{stats.totalProducts}</span>
          </div>
        </Card>
        <Card className={stats.lowStockItems > 0 ? "border-l-4 border-l-danger-500" : ""}>
          <div className="flex flex-col">
             <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Low Stock Alerts</span>
             <span className="text-4xl font-extrabold text-danger-500">{stats.lowStockItems}</span>
          </div>
        </Card>
        <Card>
           <div className="flex flex-col">
             <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Units in Stock</span>
             <span className="text-4xl font-extrabold text-gray-900">{stats.totalStock}</span>
          </div>
        </Card>
        <Card>
           <div className="flex flex-col">
             <span className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">System Status</span>
             <div className="flex items-center gap-2 mt-2">
                <span className="w-3 h-3 rounded-full bg-success-500 animate-pulse"></span>
                <span className="text-xl font-bold text-success-500">Operational</span>
             </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <Card className="flex flex-col h-full">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h2 className="text-xl font-bold text-gray-800">Receipt Statistics</h2>
               <p className="text-sm text-gray-500 mt-1">Inbound operations requiring processing</p>
             </div>
             <Link href="/receipts"><Button variant="secondary" className="text-sm border-0 bg-gray-50">View All</Button></Link>
           </div>
           
           <div className="space-y-4 flex-1">
             <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
               <span className="font-medium text-gray-700">To Receive</span>
               <Badge variant="info" className="text-sm px-3 py-1">{stats.pendingReceipts}</Badge>
             </div>
             <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
               <span className="font-medium text-gray-700">Late Deliveries</span>
               <Badge variant="danger" className="text-sm px-3 py-1">0</Badge>
             </div>
             <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
               <span className="font-medium text-gray-700">Total Validated</span>
               <Badge variant="success" className="text-sm px-3 py-1">All Operations</Badge>
             </div>
           </div>
        </Card>

        <Card className="flex flex-col h-full">
           <div className="flex justify-between items-center mb-6">
             <div>
               <h2 className="text-xl font-bold text-gray-800">Delivery Statistics</h2>
               <p className="text-sm text-gray-500 mt-1">Outbound operations to prepare</p>
             </div>
             <Link href="/deliveries"><Button variant="secondary" className="text-sm border-0 bg-gray-50">View All</Button></Link>
           </div>
           
           <div className="space-y-4 flex-1">
             <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
               <span className="font-medium text-gray-700">To Deliver</span>
               <Badge variant="warning" className="text-sm px-3 py-1">{stats.pendingDeliveries}</Badge>
             </div>
             <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
               <span className="font-medium text-gray-700">Waiting on Stock</span>
               <Badge variant="danger" className="text-sm px-3 py-1">0</Badge>
             </div>
             <div className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border border-gray-100">
               <span className="font-medium text-gray-700">Total Processed</span>
               <Badge variant="success" className="text-sm px-3 py-1">All Operations</Badge>
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
