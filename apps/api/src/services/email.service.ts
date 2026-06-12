import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@fushion.ng';

export class EmailService {
  
  async sendOrderConfirmation(email: string, orderNumber: string, items: any[], totalAmount: number) {
    if (!resend) {
      console.warn('RESEND_API_KEY not set. Skipping email send.');
      return;
    }

    try {
      const itemsListHtml = items.map(i => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${i.productSnapshot.name}</strong> ${i.productSnapshot.variantName ? `(${i.productSnapshot.variantName})` : ''}
            <br/><span style="color: #666; font-size: 12px;">Qty: ${i.quantity}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ₦${Number(i.totalPrice).toLocaleString()}
          </td>
        </tr>
      `).join('');

      await resend.emails.send({
        from: `Fushion <${FROM_EMAIL}>`,
        to: email,
        subject: `Order Confirmation - ${orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A0E08;">
            <h1 style="color: #E8642A;">Thank you for your order!</h1>
            <p>Your order <strong>${orderNumber}</strong> has been confirmed and is being processed by our vendors.</p>
            
            <h3 style="margin-top: 30px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsListHtml}
              <tr>
                <td style="padding: 10px; font-weight: bold;">Total Paid</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #E8642A;">
                  ₦${Number(totalAmount).toLocaleString()}
                </td>
              </tr>
            </table>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666;">
              If you have any questions, please reply to this email.
            </p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  }

  async sendVendorNewOrderNotification(vendorEmail: string, vendorName: string, orderItem: any) {
    if (!resend) return;

    try {
      await resend.emails.send({
        from: `Fushion Vendors <${FROM_EMAIL}>`,
        to: vendorEmail,
        subject: 'New Order Received! 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A0E08;">
            <h2>Hello ${vendorName},</h2>
            <p>You have a new order for <strong>${orderItem.productSnapshot.name}</strong>.</p>
            <p>Quantity: ${orderItem.quantity}</p>
            <p>Please log in to your vendor dashboard to fulfill this order.</p>
            <a href="https://fushion.ng/vendor/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #2C5F4A; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">
              View Dashboard
            </a>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error sending vendor notification email:', error);
    }
  }
}
