import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, ArrowLeft, Camera } from 'lucide-react';
import { api } from '../../../lib/api';
import { storage } from '../../../lib/storage';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  bio: string;
  avatarUrl: string;
}

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    bio: '',
    avatarUrl: '',
  });

  useEffect(() => {
    api
      .get<UserProfile>('/users/profile')
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size must be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/users/profile/avatar', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${storage.getUser()?.token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setProfile({ ...profile, avatarUrl: data.avatarUrl });
      setSuccessMsg('Avatar updated!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload avatar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await api.put('/users/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        location: profile.location,
        bio: profile.bio,
      });

      const user = storage.getUser();
      if (user) {
        storage.setUser({
          ...user,
          name: `${profile.firstName} ${profile.lastName}`.trim() || user.email,
        });
      }

      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => navigate({ to: '/' }), 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
      <div className="py-10 px-6" style={{ backgroundColor: '#F7E6CA' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/' })}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} style={{ color: '#3A2256' }} />
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#3A2256' }}>Edit Profile</h1>
            <p className="text-sm opacity-70 mt-1" style={{ color: '#3A2256' }}>Update your account information.</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                style={{
                  backgroundColor: '#3A2256',
                  backgroundImage: profile.avatarUrl ? `url(${profile.avatarUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!profile.avatarUrl && (profile.firstName?.[0] || profile.email?.[0] || 'U')}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Camera size={16} style={{ color: '#3A2256' }} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400">Click camera icon to upload (max 5MB)</p>
          </div>

          {/* First Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="Last Name"
            />
          </div>

          {/* Email (read-only) */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input
              value={profile.email}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500"
              placeholder="Email"
              disabled
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-400" />
            </div>
            <input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="Phone Number"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="Location (City, State)"
            />
          </div>

          {/* Bio */}
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            rows={4}
            className="block w-full px-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
            placeholder="Bio (optional)"
          />

          {/* Messages */}
          {errorMsg && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{successMsg}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#3A2256' }}
          >
            {saving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
              />
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
