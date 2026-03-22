import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, FileText, DollarSign, ArrowLeft, Tag } from 'lucide-react';
import { api } from '../../../lib/api';

interface EventType {
  id: string;
  name: string;
}

interface BookingFormProps {
  vendorId: string;
  vendorName: string;
  vendorBasePrice: number;
  onSuccess: (bookingId: string) => void;
  onCancel: () => void;
}

export default function BookingForm({
  vendorId,
  vendorName,
  vendorBasePrice,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    eventTypeId: '',
    startDate: '',
    locationName: '',
  });

  const [totalPrice, setTotalPrice] = useState(vendorBasePrice || 0);

  useEffect(() => {
    api.get<EventType[]>('/event-types').then(setEventTypes).catch(console.error);
  }, []);

  const depositAmount = Math.round(totalPrice * 0.32);

  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      // Step 1: Create the event
      const event = await api.post<{ id: string }>('/events', {
        title: eventData.title,
        description: eventData.description,
        eventTypeId: eventData.eventTypeId,
        startDate: new Date(eventData.startDate).toISOString(),
        locationName: eventData.locationName,
      });

      // Step 2: Create the booking
      const booking = await api.post<{ id: string }>('/bookings', {
        eventId: event.id,
        vendorId,
        totalPrice,
      });

      onSuccess(booking.id);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-satoshi">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} style={{ color: '#3A2256' }} />
        </button>
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#3A2256' }}>
            Book {vendorName}
          </h2>
          <p className="text-xs text-gray-400">Step {step} of 2</p>
        </div>
      </div>

      {/* Step Dots */}
      <div className="flex gap-2 mb-6">
        {[1, 2].map((s) => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full transition-all"
            style={{ backgroundColor: step >= s ? '#3A2256' : '#e5e7eb' }}
          />
        ))}
      </div>

      {/* Step 1: Event Details */}
      {step === 1 && (
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Event Details</h3>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText size={18} className="text-gray-400" />
            </div>
            <input
              name="title"
              value={eventData.title}
              onChange={handleEventChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="Event Title (e.g. Jane's Wedding)"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag size={18} className="text-gray-400" />
            </div>
            <select
              name="eventTypeId"
              value={eventData.eventTypeId}
              onChange={handleEventChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all appearance-none bg-white"
              required
            >
              <option value="">Select event type...</option>
              {eventTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-gray-400" />
            </div>
            <input
              name="startDate"
              type="datetime-local"
              value={eventData.startDate}
              onChange={handleEventChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <input
              name="locationName"
              value={eventData.locationName}
              onChange={handleEventChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="Venue / Location"
            />
          </div>

          <textarea
            name="description"
            value={eventData.description}
            onChange={handleEventChange}
            rows={3}
            className="block w-full px-3 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
            placeholder="Additional details for the vendor..."
          />

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!eventData.title || !eventData.eventTypeId || !eventData.startDate}
            className="w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-50 mt-2"
            style={{ backgroundColor: '#3A2256' }}
          >
            Next: Pricing
          </button>
        </motion.div>
      )}

      {/* Step 2: Pricing & Confirm */}
      {step === 2 && (
        <motion.div
          key="step2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Pricing & Confirmation</h3>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={18} className="text-gray-400" />
            </div>
            <input
              type="number"
              value={totalPrice}
              onChange={(e) => { setTotalPrice(Number(e.target.value)); setErrorMsg(''); }}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              placeholder="Agreed Total Price (₦)"
              min="0"
            />
          </div>

          {/* Escrow Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Total agreed price</span>
              <span className="font-bold text-gray-800">₦{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Deposit (30%)</span>
              <span className="font-medium text-gray-700">₦{Math.round(totalPrice * 0.30).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Platform fee (2%)</span>
              <span className="font-medium text-gray-700">₦{Math.round(totalPrice * 0.02).toLocaleString()}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-sm">
              <span className="font-bold" style={{ color: '#3A2256' }}>You pay now</span>
              <span className="font-bold text-lg" style={{ color: '#3A2256' }}>₦{depositAmount.toLocaleString()}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Your deposit is held securely in escrow. The vendor receives it only after the event is marked as fulfilled. 
            The remaining ₦{(totalPrice - depositAmount).toLocaleString()} is paid on event day.
          </p>

          {errorMsg && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md font-medium">{errorMsg}</p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || totalPrice <= 0}
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
                'Confirm Booking'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
