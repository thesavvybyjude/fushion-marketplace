import { useState } from 'react';
import { Button, Badge } from '@/components/ui';

export function ReviewList({ productId }: { productId: string }) {
  const [reviews] = useState([
    { id: '1', user: 'Jane Doe', rating: 5, date: '2026-06-10', title: 'Excellent Quality', body: 'This product exceeded my expectations. Very durable and looks exactly like the pictures.' },
    { id: '2', user: 'John Smith', rating: 4, date: '2026-06-08', title: 'Good value', body: 'Nice product, delivery was a bit slow though.' },
    { id: '3', user: 'Adaobi N.', rating: 5, date: '2026-06-01', title: 'Highly recommend!', body: 'Vendor was responsive. Will buy again.' }
  ]);

  return (
    <div className="mt-12 max-w-4xl">
      <h3 className="text-xl font-bold text-coal mb-6">Customer Reviews</h3>
      
      <div className="flex gap-8 mb-8 items-center bg-paper p-6 rounded-2xl border border-coal/10">
        <div className="text-center">
          <h1 className="text-5xl font-black text-coal">4.8</h1>
          <div className="flex text-gold-dust text-xl justify-center my-2">★★★★★</div>
          <p className="text-sm text-coal/60">Based on {reviews.length} reviews</p>
        </div>
        
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(star => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-12 text-coal font-bold">{star} star</span>
              <div className="flex-1 h-2 bg-coal/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gold-dust rounded-full" 
                  style={{ width: star === 5 ? '80%' : star === 4 ? '20%' : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <Button>Write a Review</Button>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="border-b border-coal/10 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-gold-dust text-sm">
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
              <h4 className="font-bold text-coal">{review.title}</h4>
            </div>
            <p className="text-coal/80 mb-3">{review.body}</p>
            <div className="flex items-center gap-2 text-sm text-coal/60">
              <span className="font-bold text-coal">{review.user}</span>
              <span>•</span>
              <span>{review.date}</span>
              <Badge variant="green" className="ml-2 scale-75 origin-left">Verified Buyer</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
