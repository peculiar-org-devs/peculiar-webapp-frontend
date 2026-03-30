import { useState } from 'react';

export default function WaitlistModal({ onClose }: { onClose: () => void }) {
  const [isCopied, setIsCopied] = useState(false);
  const referralLink = 'https://getswypd.com';

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      {/* Modal Card */}
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold">
          Thanks! You are number 601 on <span className="block">the waitlist</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xl text-gray-500 mt-3">
          Your place is saved. We’ll reach out when<span className="block">access begins.</span>
        </p>

        {/* Avatars */}
        <div className="flex justify-center mt-6 -space-x-4">
          <img src="/cartoons.png" className="rounded-full border-2 border-white" />
        </div>

        {/* Invite */}
        <p className="mt-6 text-xl text-left text-gray-500 text-sm">
          Invite and Earn Rewards :
        </p>

        {/* Link box */}
        <div className="mt-3 flex items-center justify-between bg-[#3c2356] text-white px-4 py-3 rounded-lg relative mb-5">
          <span className="text-sm">{referralLink}</span>
          <button 
            onClick={handleCopyToClipboard}
            className="cursor-pointer transition-opacity hover:opacity-70"
            title={isCopied ? 'Copied!' : 'Copy link'}
          >
            <img src="/copy.png" alt="Copy link" />
          </button>

          {/* Copied notification */}
          {isCopied && (
            <div className="absolute inset-0 bg-[#3c2356] rounded-lg flex items-center justify-center animate-in fade-in zoom-in duration-200">
              <span className="text-white font-medium">Copied!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}