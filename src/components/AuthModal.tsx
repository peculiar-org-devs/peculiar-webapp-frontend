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

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            email: formData.email, 
            password: formData.password, 
            firstName: formData.firstName, 
            lastName: formData.lastName, 
            phone: '0000000000' // Stub requirement for backend
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (isLogin) {
        // Assume data returns { accessToken, user: { id, email, role, ... } }
        import('../lib/storage').then(({ storage }) => {
          storage.setUser({
            id: data.user.id,
            name: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim() || data.user.email,
            email: data.user.email,
            role: data.user.role,
            token: data.accessToken
          });
          window.location.reload();
        });
      } else {
        // Registration successful
        // The backend might ask for email verification, show message or switch to login
        setIsLogin(true);
        setErrorMsg('Registration successful! Please log in (check email for verification).');
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
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

                {errorMsg && (
                  <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md font-medium">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 text-white font-medium rounded-xl shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 mt-2 disabled:opacity-70 flex justify-center items-center"
                  style={{ backgroundColor: '#3A2256' }}
                >
                  {loading ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                    />
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
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
