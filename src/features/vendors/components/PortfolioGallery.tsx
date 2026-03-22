import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';

interface PortfolioImage {
  url: string;
  uploading?: boolean;
}

export default function PortfolioGallery() {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      // Validation
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg(`${file.name} is larger than 5MB. Please choose a smaller file.`);
        continue;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMsg(`${file.name} is not a supported format. Use JPG, PNG, or WEBP.`);
        continue;
      }

      // Add placeholder
      const tempId = `temp-${Date.now()}-${file.name}`;
      setImages((prev) => [...prev, { url: tempId, uploading: true }]);

      try {
        // Step 1: Get presigned URL from backend
        const { uploadUrl, publicUrl } = await api.post<{
          uploadUrl: string;
          publicUrl: string;
          vendorId: string;
        }>('/vendors/portfolio/upload-url', {
          fileName: file.name,
          contentType: file.type,
        });

        // Step 2: Upload directly to S3
        await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        });

        // Step 3: Confirm upload with backend
        await api.post('/vendors/portfolio/confirm', { url: publicUrl });

        // Replace temp with real URL
        setImages((prev) =>
          prev.map((img) =>
            img.url === tempId ? { url: publicUrl, uploading: false } : img
          )
        );
      } catch (error: any) {
        setErrorMsg(error.message || 'Upload failed');
        setImages((prev) => prev.filter((img) => img.url !== tempId));
      }
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (url: string) => {
    // TODO: Call DELETE endpoint when available
    setImages((prev) => prev.filter((img) => img.url !== url));
  };

  return (
    <div className="font-satoshi">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: '#3A2256' }}>
          Portfolio Gallery
        </h3>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
          style={{ backgroundColor: '#F7E6CA', color: '#3A2256' }}
        >
          <ImagePlus size={16} />
          Add Photos
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {errorMsg && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-500 bg-red-50 p-2 rounded-md font-medium mb-4"
        >
          {errorMsg}
          <button onClick={() => setErrorMsg('')} className="ml-2 underline">
            Dismiss
          </button>
        </motion.p>
      )}

      {images.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={40} className="text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">
            Drag photos here or <span className="underline font-medium" style={{ color: '#3A2256' }}>browse</span>
          </p>
          <p className="text-xs text-gray-300 mt-1">JPG, PNG, or WEBP — max 5MB each</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                key={img.url}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
              >
                {img.uploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 size={28} className="animate-spin text-gray-400" />
                  </div>
                ) : (
                  <>
                    <img
                      src={img.url}
                      alt="Portfolio"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleRemove(img.url)}
                        className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                      >
                        <X size={16} className="text-red-500" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add More Tile */}
          <motion.div
            layout
            className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus size={24} className="text-gray-300" />
          </motion.div>
        </div>
      )}
    </div>
  );
}
