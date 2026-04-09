import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://peculiar-webapp-backend.onrender.com'

export default function WaitlistForm({
  onSuccess,
}: {
  onSuccess?: () => void
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    occupation: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      formData.occupation === 'Occupation' ||
      !formData.occupation
    ) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          occupation: formData.occupation,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to join waitlist')
      }

      setFormData({
        fullName: '',
        occupation: '',
        email: '',
      })
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mt-8 mb-20 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        
        <input
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          placeholder="Full Name"
          className="w-full sm:w-1/2 px-4 py-3 rounded-lg bg-[#5a3a73] text-white placeholder-gray-300 outline-none"
        />

        <select
          value={formData.occupation}
          onChange={(e) => handleInputChange('occupation', e.target.value)}
          className="w-full sm:w-1/2 px-4 py-3 rounded-lg bg-[#5a3a73] text-white outline-none px-4"
        >
          <option>Occupation</option>
          <option>Client</option>
          <option>Vendor</option>
        </select>
      </div>

      <input
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        placeholder="Email Id"
        className="w-full px-4 py-3 rounded-lg bg-[#5a3a73] text-white placeholder-gray-300 outline-none"
      />
      
      {error && (
        <p className="text-sm text-red-300 bg-red-900/30 p-2 rounded-lg">{error}</p>
      )}
      
      <form onSubmit={handleSubmit}>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2 mb-10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Joining...' : 'Join Waitlist'}
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
          <path
            d="M4.16669 10H15.8334M15.8334 10L10 4.16669M15.8334 10L10 15.8334"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      </form>
    </div>
  )
}
