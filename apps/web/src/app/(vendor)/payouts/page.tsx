'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';

export default function VendorPayoutsPage() {
  const [balance] = useState(245000); // Mock data for MVP UI
  const [isRequesting, setIsRequesting] = useState(false);
  const [history] = useState([
    { id: '1', date: '2026-06-10', amount: 150000, status: 'SUCCESSFUL' },
    { id: '2', date: '2026-05-28', amount: 85000, status: 'SUCCESSFUL' },
    { id: '3', date: '2026-05-15', amount: 45000, status: 'FAILED' },
  ]);

  const handleWithdrawal = () => {
    setIsRequesting(true);
    // Real implementation would call api.post('/vendors/me/payouts')
    setTimeout(() => {
      setIsRequesting(false);
      alert('Withdrawal request submitted! Funds will be transferred to your registered bank account.');
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-black text-coal mb-8">Earnings & Payouts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="bg-coal text-white col-span-1 md:col-span-2">
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-white/60 mb-2 font-bold uppercase tracking-wider text-sm">Available Balance</p>
              <h2 className="text-5xl font-black text-ember">₦{balance.toLocaleString()}</h2>
            </div>
            <div className="mt-8 flex gap-4">
              <Button 
                onClick={handleWithdrawal} 
                disabled={balance < 1000 || isRequesting}
                className="bg-ember hover:bg-ember/90 border-transparent text-white w-full md:w-auto"
              >
                {isRequesting ? 'Processing...' : 'Request Withdrawal'}
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="bg-paper border border-coal/10 flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 bg-market-green/20 text-market-green rounded-full flex items-center justify-center mb-4">
            🏦
          </div>
          <h3 className="font-bold text-coal mb-1">GTBank</h3>
          <p className="text-coal/60 text-sm">**** 1234</p>
          <a href="/vendor/settings" className="text-ember text-sm font-bold mt-4 hover:underline">Update Bank Details</a>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-coal mb-4">Payout History</h2>
      <Card padding="none" className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-coal/5 border-b border-coal/10">
              <th className="p-4 font-bold text-sm text-coal/60 uppercase">Date</th>
              <th className="p-4 font-bold text-sm text-coal/60 uppercase">Reference</th>
              <th className="p-4 font-bold text-sm text-coal/60 uppercase text-right">Amount</th>
              <th className="p-4 font-bold text-sm text-coal/60 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((tx) => (
              <tr key={tx.id} className="border-b border-coal/5 hover:bg-coal/5 transition-colors">
                <td className="p-4 text-coal">{tx.date}</td>
                <td className="p-4 text-coal/60 text-sm font-mono">TRF-{tx.id.padStart(8, '0')}</td>
                <td className="p-4 text-coal font-bold text-right">₦{tx.amount.toLocaleString()}</td>
                <td className="p-4 text-right">
                  <Badge variant={tx.status === 'SUCCESSFUL' ? 'market-green' : 'ember'}>
                    {tx.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
