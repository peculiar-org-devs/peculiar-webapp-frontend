import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle } from 'lucide-react';

interface VendorCardProps {
  id: string;
  businessName: string;
  bio: string;
  basePrice: number;
  rating: number;
  isVerified: boolean;
  portfolioUrls: string[];
  category: { id: string; name: string };
}

export default function VendorCard({ vendor }: { vendor: VendorCardProps }) {
  const coverImage = vendor.portfolioUrls?.[0];

  return (
    <motion.a
      href={`/vendors/${vendor.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={vendor.businessName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#F7E6CA' }}>
            <span className="text-4xl font-bold opacity-30" style={{ color: '#3A2256' }}>
              {vendor.businessName.charAt(0)}
            </span>
          </div>
        )}
        {/* Category Badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md"
          style={{ backgroundColor: '#3A2256' }}
        >
          {vendor.category?.name || 'Service'}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-gray-800 truncate flex items-center gap-1.5">
            {vendor.businessName}
            {vendor.isVerified && (
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
            )}
          </h3>
          <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
            <Star size={14} fill="currentColor" />
            <span className="text-sm font-bold">{vendor.rating > 0 ? vendor.rating : '—'}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 line-clamp-2 mb-3 leading-relaxed">
          {vendor.bio || 'No description provided.'}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: '#3A2256' }}>
            ₦{vendor.basePrice?.toLocaleString() || '—'}
            <span className="text-xs font-normal text-gray-400 ml-1">starting</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={12} />
            Lagos
          </span>
        </div>
      </div>
    </motion.a>
  );
}
