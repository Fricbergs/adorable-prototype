import React, { useState, useEffect } from 'react';
import { X, Home, Plus } from 'lucide-react';
import { ROOM_TYPES, ROOM_STATUS, FLOORS, ROOM_FEATURES } from '../../constants/roomConstants';

/**
 * RoomEditModal - Modal for creating/editing rooms
 */
const RoomEditModal = ({ isOpen, onClose, room, onSave }) => {
  const [formData, setFormData] = useState({
    number: '',
    floor: 1,
    type: 'double',
    status: 'available',
    features: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number || '',
        floor: room.floor || 1,
        type: room.type || 'double',
        status: room.status || 'available',
        features: room.features || []
      });
    } else {
      setFormData({
        number: '',
        floor: 1,
        type: 'double',
        status: 'available',
        features: []
      });
    }
    setError('');
  }, [room, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.number.trim()) {
      setError('Lūdzu ievadiet istabas numuru');
      return;
    }

    onSave(formData);
  };

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {room ? 'Rediģēt istabu' : 'Jauna istaba'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Room Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Istabas numurs *
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
              placeholder="piem., 101, 205"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              disabled={!!room} // Can't change room number after creation
            />
          </div>

          {/* Floor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stāvs
            </label>
            <div className="flex gap-2">
              {FLOORS.map((floor) => (
                <button
                  key={floor.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, floor: floor.value }))}
                  className={`
                    flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors
                    ${formData.floor === floor.value
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'}
                  `}
                >
                  {floor.label}
                </button>
              ))}
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Istabas tips
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ROOM_TYPES).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: key }))}
                  className={`
                    px-3 py-2 border rounded-lg text-sm font-medium transition-colors
                    ${formData.type === key
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'}
                  `}
                >
                  {config.label}
                  <span className="block text-xs opacity-75">{config.bedCount} gulta(s)</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statuss
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="available">{ROOM_STATUS.available.label}</option>
              <option value="maintenance">{ROOM_STATUS.maintenance.label}</option>
            </select>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ērtības
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(ROOM_FEATURES).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleFeature(key)}
                  className={`
                    px-3 py-1.5 border rounded-full text-sm transition-colors
                    ${formData.features.includes(key)
                      ? 'bg-orange-100 text-orange-700 border-orange-300'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-orange-300'}
                  `}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Atcelt
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              {room ? 'Saglabāt' : <><Plus className="w-4 h-4" /> Pievienot</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomEditModal;
