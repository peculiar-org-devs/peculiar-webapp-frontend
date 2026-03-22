import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, MapPin, ArrowLeft, Calendar, MessageCircle } from 'lucide-react';
import { api } from '../../../lib/api';

interface VendorProfile {
  id: string;
  businessName: string;
  bio: string;
  basePrice: number;
  rating: number;
  isVerified: boolean;
  portfolioUrls: string[];
  category: { id: string; name: string };
  createdAt: string;
}

export default function VendorProfilePage({ vendorId }: { vendorId: string }) {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<VendorProfile>(`/vendors/${vendorId}`)
      .then(setVendor)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [vendorId]);

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
        <h2 className="text-xl font-bold text-gray-700 mb-2">Vendor Not Found</h2>
        <p className="text-gray-400 mb-6">This vendor profile doesn't exist or has been removed.</p>
        <a href="/marketplace" className="underline" style={{ color: '#3A2256' }}>
          Back to Marketplace
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-satoshi">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <a
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Marketplace
        </a>
      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {/* Cover */}
          <div className="h-48 relative" style={{ backgroundColor: '#F7E6CA' }}>
            {vendor.portfolioUrls?.[0] && (
              <img
                src={vendor.portfolioUrls[0]}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Info */}
          <div className="p-6 -mt-8 relative">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4 border-4 border-white"
              style={{ backgroundColor: '#3A2256' }}
            >
              {vendor.businessName.charAt(0)}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#3A2256' }}>
                  {vendor.businessName}
                  {vendor.isVerified && <CheckCircle size={20} className="text-green-500" />}
                </h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: '#F7E6CA', color: '#3A2256' }}>
                    {vendor.category?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    Lagos, Nigeria
                  </span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    {vendor.rating > 0 ? vendor.rating : 'New'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="px-6 py-2.5 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  style={{ backgroundColor: '#3A2256' }}
                >
                  <Calendar size={16} />
                  Book Now
                </button>
                <button
                  className="px-4 py-2.5 rounded-full font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Details Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6"
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">About</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {vendor.bio || 'This vendor has not added a description yet.'}
            </p>
          </motion.div>

          {/* Portfolio Grid */}
          {vendor.portfolioUrls && vendor.portfolioUrls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Portfolio</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vendor.portfolioUrls.map((url, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer bg-gray-100"
                    onClick={() => setSelectedImage(url)}
                  >
                    <img src={url} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column — Pricing Card */}
        <div className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl shadow-sm p-6 sticky top-24"
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Pricing</h3>
            <p className="text-3xl font-bold mb-1" style={{ color: '#3A2256' }}>
              ₦{vendor.basePrice?.toLocaleString() || '—'}
            </p>
            <p className="text-xs text-gray-400 mb-6">Starting price per event</p>

            <button
              className="w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all active:scale-95"
              style={{ backgroundColor: '#3A2256' }}
            >
              Request Booking
            </button>

            <div className="mt-6 space-y-3 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Member since</span>
                <span className="font-medium text-gray-700">
                  {new Date(vendor.createdAt).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Response time</span>
                <span className="font-medium text-gray-700">Under 2 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Verification</span>
                <span className={`font-medium ${vendor.isVerified ? 'text-green-600' : 'text-amber-500'}`}>
                  {vendor.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={selectedImage}
            alt="Portfolio fullscreen"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </motion.div>
      )}
    </div>
  );
}
