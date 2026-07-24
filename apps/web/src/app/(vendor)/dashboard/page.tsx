import { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { toast_error } from '@/components/ui';

export default function VendorDashboardPage() {
  const [stats, setStats] = useState({
    gmv: 0,
    totalOrders: 0,
    unitsSold: 0,
    chartData: [] as Array<{ date: string; revenue: number }>
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get<{ data: typeof stats }>('/vendors/me/analytics');
        setStats(res.data);
      } catch (err) {
        toast_error('Failed to load analytics. Displaying mock data.');
        setStats({
          gmv: 1250000,
          totalOrders: 142,
          unitsSold: 350,
          chartData: [
            { date: 'Mon', revenue: 12000 },
            { date: 'Tue', revenue: 19000 },
            { date: 'Wed', revenue: 15000 },
            { date: 'Thu', revenue: 22000 },
            { date: 'Fri', revenue: 30000 },
            { date: 'Sat', revenue: 45000 },
            { date: 'Sun', revenue: 38000 },
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-coal">Vendor Dashboard</h1>
          <p className="text-coal/60">Welcome back to your store!</p>
        </div>
        <Button variant="secondary" className="hidden md:inline-flex">+ Add New Product</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card padding="md" className="border-l-4 border-l-ember">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Total GMV</p>
          <h2 className="text-3xl font-black text-coal">
            {loading ? '...' : `₦${stats.gmv.toLocaleString()}`}
          </h2>
        </Card>
        
        <Card padding="md" className="border-l-4 border-l-market-green">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Total Orders</p>
          <h2 className="text-3xl font-black text-coal">
            {loading ? '...' : stats.totalOrders.toLocaleString()}
          </h2>
        </Card>

        <Card padding="md" className="border-l-4 border-l-gold-dust">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Units Sold</p>
          <h2 className="text-3xl font-black text-coal">
            {loading ? '...' : stats.unitsSold.toLocaleString()}
          </h2>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card padding="md">
            <h3 className="text-lg font-bold text-coal mb-6">Revenue Over Time (7 Days)</h3>
            <div className="h-[300px] w-full">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-coal/60">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `₦${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#E8642A" strokeWidth={3} dot={{ r: 4, fill: '#E8642A' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card padding="md" className="bg-coal text-white">
            <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
            <p className="text-white/70 text-sm mb-6">Access vendor resources, tutorials, and support center to grow your business on Fushion.</p>
            <Button variant="secondary" className="w-full bg-white/10 text-white border-transparent hover:bg-white/20">
              Vendor Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
