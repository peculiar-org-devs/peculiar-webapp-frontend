import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, CreditCard, ChevronRight } from 'lucide-react';
import { api } from '../../../lib/api';

interface Booking {
  id: string;
  totalPrice: number;
  depositAmount: number;
  status: string;
  isDepositPaid: boolean;
  createdAt: string;
  event: { id: string; title: string; startDate: string; locationName: string };
  vendor: { id: string; businessName: string };
}

const statusConfig: Record<string, { color: string; bg: string; icon: typeof CheckCircle; label: string }> = {
  PENDING: { color: '#D97706', bg: '#FEF3C7', icon: Clock, label: 'Pending Approval' },
  APPROVED: { color: '#059669', bg: '#D1FAE5', icon: CheckCircle, label: 'Approved' },
  REJECTED: { color: '#DC2626', bg: '#FEE2E2', icon: XCircle, label: 'Rejected' },
  DEPOSIT_PAID: { color: '#7C3AED', bg: '#EDE9FE', icon: CreditCard, label: 'Deposit Paid' },
  FULFILLED: { color: '#059669', bg: '#D1FAE5', icon: CheckCircle, label: 'Completed' },
  CANCELLED: { color: '#6B7280', bg: '#F3F4F6', icon: AlertCircle, label: 'Cancelled' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Booking[]>('/bookings/my')
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePay = async (bookingId: string, amount: number) => {
    try {
      const result = await api.post<{ authorization_url: string }>('/payments/initialize', {
        bookingId,
        amount,
      });
      // Redirect to Paystack checkout
      if (result.authorization_url) {
        window.location.href = result.authorization_url;
      }
    } catch (err: any) {
      alert(err.message || 'Payment failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-3 rounded-full border-t-transparent"
          style={{ borderColor: '#3A2256', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-satoshi">
      {/* Header */}
      <div className="py-10 px-6" style={{ backgroundColor: '#F7E6CA' }}>
        <div className="max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
            style={{ color: '#3A2256' }}
          >
            My Bookings
          </motion.h1>
          <p className="text-sm opacity-70 mt-1" style={{ color: '#3A2256' }}>
            Track your event vendor bookings and payments.
          </p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <Calendar size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="text-lg font-bold text-gray-500 mb-1">No bookings yet</h3>
            <p className="text-sm text-gray-400 mb-6">
              Browse the marketplace to find and book your perfect vendor.
            </p>
            <a
              href="/marketplace"
              className="inline-block px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all"
              style={{ backgroundColor: '#3A2256' }}
            >
              Explore Marketplace
            </a>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {bookings.map((booking, i) => {
                const config = statusConfig[booking.status] || statusConfig.PENDING;
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800">{booking.event?.title || 'Untitled Event'}</h3>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {booking.vendor?.businessName} • {booking.event?.locationName || 'TBD'}
                          </p>
                        </div>
                        <span
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: config.bg, color: config.color }}
                        >
                          <StatusIcon size={12} />
                          {config.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {booking.event?.startDate
                            ? new Date(booking.event.startDate).toLocaleDateString('en-NG', {
                                day: 'numeric', month: 'short', year: 'numeric',
                              })
                            : '—'}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard size={14} />
                          ₦{Number(booking.totalPrice).toLocaleString()}
                        </span>
                      </div>

                      {/* Pay Deposit CTA */}
                      {booking.status === 'APPROVED' && !booking.isDepositPaid && (
                        <button
                          onClick={() => handlePay(booking.id, Number(booking.depositAmount))}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-white shadow-sm transition-all active:scale-95 text-sm"
                          style={{ backgroundColor: '#3A2256' }}
                        >
                          <CreditCard size={16} />
                          Pay Deposit — ₦{Number(booking.depositAmount).toLocaleString()}
                          <ChevronRight size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
