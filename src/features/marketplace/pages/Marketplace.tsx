import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../../../lib/api';
import VendorCard from '../components/VendorCard';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

interface Vendor {
  id: string;
  businessName: string;
  bio: string;
  basePrice: number;
  rating: number;
  isVerified: boolean;
  portfolioUrls: string[];
  category: { id: string; name: string };
}

export default function Marketplace() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Load categories once
  useEffect(() => {
    api.get<ServiceCategory[]>('/vendors/categories').then(setCategories).catch(console.error);
  }, []);

  // Load vendors on filter change
  useEffect(() => {
    setLoading(true);
    const fetchVendors = async () => {
      try {
        let data: Vendor[];
        if (searchQuery.trim()) {
          data = await api.get<Vendor[]>(`/vendors/search?q=${encodeURIComponent(searchQuery)}`);
        } else if (selectedCategory) {
          data = await api.get<Vendor[]>(`/vendors?categoryId=${selectedCategory}`);
        } else {
          data = await api.get<Vendor[]>('/vendors');
        }
        setVendors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchVendors, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
  };

  const hasFilters = searchQuery || selectedCategory;

  return (
    <div className="min-h-screen bg-gray-50 font-satoshi">
      {/* Hero Section */}
      <div className="py-12 px-6" style={{ backgroundColor: '#F7E6CA' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: '#3A2256' }}
          >
            Find Your Perfect Vendor
          </motion.h1>
          <p className="text-sm opacity-70 mb-8" style={{ color: '#3A2256' }}>
            Browse verified professionals for your next event.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto relative"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or category..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white shadow-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
              style={{ '--tw-ring-color': '#3A2256' } as React.CSSProperties}
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <SlidersHorizontal
                size={20}
                className={showFilters ? 'text-purple-700' : 'text-gray-400'}
              />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Category Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b bg-white overflow-hidden"
          >
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={!selectedCategory ? { backgroundColor: '#3A2256' } : {}}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={selectedCategory === cat.id ? { backgroundColor: '#3A2256' } : {}}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Active Filters Bar */}
        {hasFilters && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')}><X size={12} /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('')}><X size={12} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-xs underline text-gray-400 ml-2">
              Clear all
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 border-3 rounded-full border-t-transparent"
              style={{ borderColor: '#3A2256', borderTopColor: 'transparent' }}
            />
          </div>
        ) : vendors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <Search size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="text-lg font-bold text-gray-500 mb-1">No vendors found</h3>
            <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              <span className="font-bold text-gray-600">{vendors.length}</span> vendor{vendors.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vendors.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <VendorCard vendor={v} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
