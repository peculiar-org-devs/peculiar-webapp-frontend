import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, FileText, Tag, DollarSign, ChevronRight, CheckCircle } from 'lucide-react';
import { api } from '../../../lib/api';

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

export default function VendorOnboarding() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    bio: '',
    categoryId: '',
    basePrice: '',
  });

  useEffect(() => {
    api.get<ServiceCategory[]>('/vendors/categories').then(setCategories).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/vendors', {
        businessName: formData.businessName,
        bio: formData.bio,
        categoryId: formData.categoryId,
        basePrice: parseFloat(formData.basePrice) || 0,
      });
      setSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-satoshi p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
          >
            <CheckCircle size={64} className="mx-auto mb-4" style={{ color: '#3A2256' }} />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#3A2256' }}>You're In!</h2>
          <p className="text-gray-500 mb-6">
            Your vendor profile has been created. You can now manage your portfolio and start receiving bookings.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 text-white"
            style={{ backgroundColor: '#3A2256' }}
          >
            Go to Dashboard
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-satoshi">
      {/* Header Banner */}
      <div className="py-12 px-6 text-center" style={{ backgroundColor: '#F7E6CA' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold"
          style={{ color: '#3A2256' }}
        >
          Become a Vendor
        </motion.h1>
        <p className="mt-2 text-sm opacity-80" style={{ color: '#3A2256' }}>
          Set up your business profile and start connecting with clients.
        </p>
        {/* Step Indicator */}
        <div className="flex items-center justify-center mt-6 gap-2">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s ? 'text-white shadow-md' : 'bg-white/50 text-gray-500'
                }`}
                style={step >= s ? { backgroundColor: '#3A2256' } : {}}
              >
                {s}
              </div>
              {s < 2 && <ChevronRight size={16} style={{ color: '#3A2256' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-5"
            >
              <h2 className="text-lg font-bold" style={{ color: '#3A2256' }}>Business Details</h2>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 size={18} className="text-gray-400" />
                </div>
                <input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Business Name"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                  placeholder="Tell clients about your business..."
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.businessName || !formData.bio}
                className="w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                style={{ backgroundColor: '#3A2256' }}
              >
                Next: Service Details
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-5"
            >
              <h2 className="text-lg font-bold" style={{ color: '#3A2256' }}>Service Details</h2>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className="text-gray-400" />
                </div>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none bg-white"
                  required
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} — {cat.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <input
                  name="basePrice"
                  type="number"
                  value={formData.basePrice}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                  placeholder="Starting Price (₦)"
                  min="0"
                />
              </div>

              {errorMsg && (
                <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md font-medium">
                  {errorMsg}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.categoryId}
                  className="flex-1 py-3 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
                  style={{ backgroundColor: '#3A2256' }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                    />
                  ) : (
                    'Create Profile'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
