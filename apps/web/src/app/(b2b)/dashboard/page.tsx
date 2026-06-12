'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';

export default function B2BDashboardPage() {
  const [invoices] = useState([
    { id: 'INV-001', date: '2026-05-15', dueDate: '2026-06-14', amount: 1500000, status: 'OVERDUE' },
    { id: 'INV-002', date: '2026-06-01', dueDate: '2026-07-01', amount: 3500000, status: 'ISSUED' },
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-coal">B2B Procurement Dashboard</h1>
          <p className="text-coal/60">Manage bulk orders, purchase orders, and net-30 invoices.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary">Upload PO</Button>
          <Button className="bg-coal text-white hover:bg-coal/90">New Bulk Order</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card padding="md" className="border-l-4 border-l-ember">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Outstanding Balance</p>
          <h2 className="text-3xl font-black text-ember">₦5,000,000</h2>
        </Card>
        
        <Card padding="md" className="border-l-4 border-l-coal">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Available Credit</p>
          <h2 className="text-3xl font-black text-coal">₦15,000,000</h2>
        </Card>

        <Card padding="md" className="border-l-4 border-l-market-green">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Active Shipments</p>
          <h2 className="text-3xl font-black text-coal">3</h2>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-coal mb-4">Net-30 Invoices</h2>
      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-coal/5 border-b border-coal/10">
              <th className="p-4 font-bold text-sm text-coal/60 uppercase">Invoice</th>
              <th className="p-4 font-bold text-sm text-coal/60 uppercase">Date Issued</th>
              <th className="p-4 font-bold text-sm text-coal/60 uppercase">Due Date</th>
              <th className="p-4 font-bold text-sm text-coal/60 uppercase">Amount</th>
              <th className="p-4 font-bold text-sm text-coal/60 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-coal/5 hover:bg-coal/5 transition-colors">
                <td className="p-4 font-bold text-coal">{inv.id}</td>
                <td className="p-4 text-coal/60">{inv.date}</td>
                <td className={`p-4 font-bold ${inv.status === 'OVERDUE' ? 'text-ember' : 'text-coal/60'}`}>{inv.dueDate}</td>
                <td className="p-4 text-coal font-bold">₦{inv.amount.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <Badge variant={inv.status === 'OVERDUE' ? 'ember' : 'coal'}>
                    {inv.status}
                  </Badge>
                  {inv.status === 'ISSUED' && <Button size="sm" className="ml-4">Pay Now</Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
