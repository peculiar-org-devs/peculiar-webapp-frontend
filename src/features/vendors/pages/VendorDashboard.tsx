import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Star, Calendar, Settings } from 'lucide-react';
import { api } from '../../../lib/api';
import PortfolioGallery from '../components/PortfolioGallery';

interface VendorProfile {
  id: string;
  businessName: string;
  bio: string;
  basePrice: number;
  rating: number;
  isVerified: boolean;
  portfolioUrls: string[];
  category: { id: string; name: string };
}

export default function VendorDashboard() {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<VendorProfile>('/vendors/profile')
      .then(setVendor)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-satoshi p-6 text-center">
        <Store size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">No Vendor Profile Found</h2>
        <p className="text-gray-400 mb-6 max-w-sm">
          You haven't set up a vendor profile yet. Get started to connect with clients.
        </p>
        <a
          href="/vendor/onboarding"
          className="px-8 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
          style={{ backgroundColor: '#3A2256' }}
        >
          Become a Vendor
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-satoshi">
      {/* Profile Header */}
      <div className="py-10 px-6" style={{ backgroundColor: '#F7E6CA' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ backgroundColor: '#3A2256' }}
            >
              {vendor.businessName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold" style={{ color: '#3A2256' }}>
                  {vendor.businessName}
                </h1>
                {vendor.isVerified && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium text-green-700 bg-green-100">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm opacity-70 mt-1" style={{ color: '#3A2256' }}>
                {vendor.category?.name} • ₦{vendor.basePrice?.toLocaleString()} starting
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={18} fill="currentColor" />
              <span className="font-bold">{vendor.rating || '—'}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Calendar, label: 'Bookings', value: '—' },
            { icon: Star, label: 'Reviews', value: '—' },
            { icon: Settings, label: 'Status', value: vendor.isVerified ? 'Active' : 'Pending' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-4 text-center"
            >
              <stat.icon size={20} className="mx-auto mb-1 text-gray-400" />
              <p className="text-lg font-bold" style={{ color: '#3A2256' }}>{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bio Section */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">About</h3>
          <p className="text-gray-700 text-sm leading-relaxed">{vendor.bio || 'No bio provided.'}</p>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="max-w-3xl mx-auto px-4 mt-6 pb-12">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <PortfolioGallery />
        </div>
      </div>
    </div>
  );
}
