import { useState } from 'react'

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    // Check if all fields are filled
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      formData.occupation === 'Occupation'
    ) {
      return // Don't submit if form is incomplete
    }

    // Clear form and show modal
    setFormData({
      fullName: '',
      occupation: '',
      email: '',
    })
    onSuccess?.()
  }

  return (
    <div className="w-full max-w-md mt-8 mb-40 space-y-4">
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
      <form onSubmit={handleSubmit}>
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2 mb-10"
      >
        Join Waitlist
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
