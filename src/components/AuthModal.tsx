import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Chrome } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend authentication endpoint
    console.log(isLogin ? 'Logging in...' : 'Registering...', formData);
  };

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:3000/api/auth/google'; // Adjust according to environment
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-satoshi">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10 mx-4"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors z-20"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Header Content */}
            <div className="px-8 pt-10 pb-6 text-center" style={{ backgroundColor: '#F7E6CA' }}>
              <motion.img 
                src="/logo-purple.png" 
                alt="Peculiar Logo" 
                className="w-16 h-16 mx-auto mb-4 object-contain"
                layoutId="logo"
              />
              <h2 className="text-2xl font-bold" style={{ color: '#3A2256' }}>
                {isLogin ? 'Welcome Back' : 'Join Peculiar'}
              </h2>
              <p className="text-sm mt-2 opacity-80" style={{ color: '#3A2256' }}>
                {isLogin 
                  ? 'Enter your credentials to access your account.' 
                  : 'Create an account to start planning your perfect event.'}
              </p>
            </div>

            {/* Form Content */}
            <div className="px-8 py-6 bg-white">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Registration Only Fields */}
                <AnimatePresence mode="popLayout">
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                          style={{ ':focus': { ringColor: '#3A2256' } } as React.CSSProperties}
                          placeholder="First Name"
                          required={!isLogin}
                        />
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                          placeholder="Last Name"
                          required={!isLogin}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Shared Fields */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="relative flex flex-col items-end">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    placeholder="Password"
                    required
                  />
                  {isLogin && (
                    <button type="button" className="text-xs mt-2 hover:underline transition-all" style={{ color: '#3A2256' }}>
                      Forgot Password?
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-white font-medium rounded-xl shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-2"
                  style={{ backgroundColor: '#3A2256' }}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs text-gray-400 uppercase tracking-wider">Or continue with</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all active:scale-95"
              >
                <Chrome size={20} className="text-blue-500" />
                Google
              </button>

              <div className="mt-8 text-center text-sm text-gray-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-bold hover:underline transition-all"
                  style={{ color: '#3A2256' }}
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
