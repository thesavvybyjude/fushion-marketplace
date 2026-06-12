'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { toast_success, toast_error } from '@/components/ui';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: any[] }>('/admin/products/pending');
      setProducts(res.data || []);
    } catch (error) {
      toast_error('Failed to load pending products');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'ACTIVE' | 'REJECTED') => {
    try {
      await api.patch(`/admin/products/${id}/status`, { status });
      toast_success(`Product marked as ${status}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      toast_error('Failed to update product status');
    }
  };

  if (loading) return <div className="p-8 text-center text-coal/60">Loading approval queue...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-coal">Product Approvals</h1>
          <p className="text-coal/60">Review and approve new products submitted by vendors</p>
        </div>
        <Badge variant="ember">{products.length} Pending</Badge>
      </div>

      {products.length === 0 ? (
        <Card className="text-center py-16">
          <h3 className="text-lg font-bold text-coal mb-2">All caught up!</h3>
          <p className="text-coal/60">There are no products pending approval at the moment.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map(product => (
            <Card key={product.id} padding="md" className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 bg-coal/5 rounded-xl overflow-hidden shrink-0">
                {product.images?.[0] ? (
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-coal/20">No Image</div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-coal">{product.name}</h2>
                    <span className="text-lg font-black text-ember">₦{Number(product.basePrice).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm text-coal/70">
                    <span className="font-bold">Vendor:</span> {product.vendor?.storeName}
                  </div>
                  
                  <p className="text-sm text-coal/80 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-coal/5">
                  <Button variant="secondary" onClick={() => handleUpdateStatus(product.id, 'REJECTED')} className="text-red-600 border-red-200 hover:bg-red-50">
                    Reject
                  </Button>
                  <Button onClick={() => handleUpdateStatus(product.id, 'ACTIVE')} className="bg-market-green hover:bg-market-green/90 border-transparent text-white">
                    Approve Product
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
