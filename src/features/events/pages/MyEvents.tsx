import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../../lib/api';

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  locationName: string;
  eventType: { id: string; name: string };
}

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: '', description: '', locationName: '', startDate: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchEvents = () => {
    setLoading(true);
    api
      .get<any>(`/events/my?page=${page}&limit=${limit}`)
      .then((response) => {
        setEvents(response.data || response);
        if (response.meta) {
          setTotalPages(response.meta.totalPages);
          setTotal(response.meta.total);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setEditData({
      title: event.title,
      description: event.description || '',
      locationName: event.locationName || '',
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
    });
  };

  const handleSave = async (eventId: string) => {
    try {
      await api.put(`/events/${eventId}`, editData);
      setEditingId(null);
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to update event');
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;

    try {
      await api.delete(`/events/${eventId}`);
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete event');
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold" style={{ color: '#3A2256' }}>My Events</h1>
          <p className="text-sm opacity-70 mt-1" style={{ color: '#3A2256' }}>Manage your event details.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {events.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="text-lg font-bold text-gray-500 mb-1">No events yet</h3>
            <p className="text-sm text-gray-400">Your events will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm p-5">
                {editingId === event.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Event title"
                    />
                    <input
                      type="text"
                      value={editData.locationName}
                      onChange={(e) => setEditData({ ...editData, locationName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Location"
                    />
                    <input
                      type="datetime-local"
                      value={editData.startDate}
                      onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                      rows={2}
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(event.id)}
                        className="flex-1 py-2 rounded-lg font-semibold text-white text-sm"
                        style={{ backgroundColor: '#3A2256' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 py-2 rounded-lg font-semibold border border-gray-200 text-gray-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{event.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{event.eventType?.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    </div>
                    {event.description && <p className="text-sm text-gray-600 mb-3">{event.description}</p>}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {event.startDate ? new Date(event.startDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                      {event.locationName && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.locationName}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages} ({total} total)
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
