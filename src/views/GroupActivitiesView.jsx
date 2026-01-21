import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, X, Clock, Euro, Users, Calendar, Search, Check, ChevronRight } from 'lucide-react';
import PageShell from '../components/PageShell';

const ACTIVITIES_KEY = 'adorable-group-activities';
const SERVICES_KEY = 'adorable-services';
const RESIDENTS_KEY = 'adorable-residents';
const SOCIAL_CARE_KEY = 'adorable-social-care-entries';

/**
 * Get data from localStorage
 */
const getFromStorage = (key, defaultValue = []) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return defaultValue;
  }
};

/**
 * Save data to localStorage
 */
const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Generate unique ID
 */
const generateId = () => `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Format date for display
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('lv-LV', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

/**
 * Format duration for display
 */
const formatDuration = (minutes) => {
  if (!minutes) return '-';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Generate social care entries for activity participants
 */
const generateSocialCareEntries = (activity) => {
  const entries = getFromStorage(SOCIAL_CARE_KEY);

  // Remove old entries for this activity
  const filteredEntries = entries.filter(e => e.activityId !== activity.id);

  // Create new entries for each participant
  const newEntries = activity.participants.map(residentId => ({
    id: `sce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    residentId,
    date: activity.date,
    description: `Grupu pasākums: ${activity.serviceName}`,
    activityId: activity.id,
    createdAt: new Date().toISOString()
  }));

  saveToStorage(SOCIAL_CARE_KEY, [...filteredEntries, ...newEntries]);
};

/**
 * Remove social care entries for an activity
 */
const removeSocialCareEntries = (activityId) => {
  const entries = getFromStorage(SOCIAL_CARE_KEY);
  const filteredEntries = entries.filter(e => e.activityId !== activityId);
  saveToStorage(SOCIAL_CARE_KEY, filteredEntries);
};

/**
 * GroupActivitiesView - Group activities management
 */
export default function GroupActivitiesView({ onBack }) {
  const [activities, setActivities] = useState([]);
  const [services, setServices] = useState([]);
  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingParticipants, setViewingParticipants] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    durationMinutes: '',
    participants: []
  });
  const [formErrors, setFormErrors] = useState({});

  // Load data on mount
  useEffect(() => {
    setActivities(getFromStorage(ACTIVITIES_KEY));
    setServices(getFromStorage(SERVICES_KEY));
    setResidents(getFromStorage(RESIDENTS_KEY));
  }, []);

  // Get selected service
  const selectedService = services.find(s => s.id === formData.serviceId);

  // Filter residents by search
  const filteredResidents = residents.filter(r => {
    if (!searchQuery) return true;
    const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  // Open modal for new activity
  const handleAddNew = () => {
    if (services.length === 0) {
      alert('Vispirms pievienojiet pakalpojumus iestatījumos!');
      return;
    }
    setFormData({
      serviceId: '',
      date: new Date().toISOString().split('T')[0],
      time: '',
      durationMinutes: '',
      participants: []
    });
    setFormErrors({});
    setEditingActivity(null);
    setSearchQuery('');
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (activity) => {
    setFormData({
      serviceId: activity.serviceId,
      date: activity.date,
      time: activity.time || '',
      durationMinutes: activity.durationMinutes.toString(),
      participants: [...activity.participants]
    });
    setFormErrors({});
    setEditingActivity(activity);
    setSearchQuery('');
    setShowModal(true);
  };

  // Handle service selection - auto-fill duration
  const handleServiceChange = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    setFormData({
      ...formData,
      serviceId,
      durationMinutes: service ? service.durationMinutes.toString() : ''
    });
  };

  // Toggle participant selection
  const toggleParticipant = (residentId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(residentId)
        ? prev.participants.filter(id => id !== residentId)
        : [...prev.participants, residentId]
    }));
  };

  // Select all filtered residents
  const selectAllFiltered = () => {
    const filteredIds = filteredResidents.map(r => r.id);
    const currentSelected = new Set(formData.participants);
    const allSelected = filteredIds.every(id => currentSelected.has(id));

    if (allSelected) {
      // Deselect all filtered
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.filter(id => !filteredIds.includes(id))
      }));
    } else {
      // Select all filtered
      setFormData(prev => ({
        ...prev,
        participants: [...new Set([...prev.participants, ...filteredIds])]
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.serviceId) {
      errors.serviceId = 'Pakalpojums ir obligāts';
    }
    if (!formData.date) {
      errors.date = 'Datums ir obligāts';
    }
    if (!formData.durationMinutes || parseInt(formData.durationMinutes) <= 0) {
      errors.durationMinutes = 'Ilgums ir obligāts';
    }
    if (formData.participants.length === 0) {
      errors.participants = 'Izvēlieties vismaz vienu dalībnieku';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save activity
  const handleSave = () => {
    if (!validateForm()) return;

    const service = services.find(s => s.id === formData.serviceId);

    const activityData = {
      id: editingActivity?.id || generateId(),
      serviceId: formData.serviceId,
      serviceName: service?.name || '',
      date: formData.date,
      time: formData.time || null,
      durationMinutes: parseInt(formData.durationMinutes),
      isFree: service?.isFree || false,
      price: service?.isFree ? 0 : (service?.price || 0),
      participants: formData.participants,
      createdAt: editingActivity?.createdAt || new Date().toISOString(),
      createdBy: 'current-user' // TODO: Get from auth context
    };

    let updatedActivities;
    if (editingActivity) {
      updatedActivities = activities.map(a => a.id === editingActivity.id ? activityData : a);
    } else {
      updatedActivities = [activityData, ...activities];
    }

    saveToStorage(ACTIVITIES_KEY, updatedActivities);
    setActivities(updatedActivities);

    // Generate social care entries
    generateSocialCareEntries(activityData);

    setShowModal(false);
    setEditingActivity(null);
  };

  // Delete activity
  const handleDelete = (activityId) => {
    const updatedActivities = activities.filter(a => a.id !== activityId);
    saveToStorage(ACTIVITIES_KEY, updatedActivities);
    setActivities(updatedActivities);

    // Remove social care entries
    removeSocialCareEntries(activityId);

    setDeleteConfirm(null);
  };

  // Get resident name by ID
  const getResidentName = (residentId) => {
    const resident = residents.find(r => r.id === residentId);
    return resident ? `${resident.firstName} ${resident.lastName}` : 'Nezināms';
  };

  return (
    <PageShell maxWidth="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grupu pasākumi</h1>
            <p className="text-sm text-gray-500">Dalībnieku reģistrācija un aktivitāšu pārskats</p>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Jauns pasākums
        </button>
      </div>

      {/* Activity Count */}
      <div className="text-sm text-gray-500 mb-4">
        {activities.length} pasākumi
      </div>

      {/* Activities List - Card Layout */}
      {activities.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="mb-2">Nav reģistrētu pasākumu</p>
          <p className="text-sm">Spiediet "Jauns pasākums", lai pievienotu grupu aktivitāti</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => (
            <button
              key={activity.id}
              onClick={() => setViewingParticipants(activity)}
              className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                {/* Activity Icon/Avatar */}
                <div className="w-16 h-16 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>

                {/* Activity Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{activity.serviceName}</span>
                    {activity.isFree ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Bezmaksas
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        €{activity.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(activity.date)}
                    </span>
                    {activity.time && (
                      <span>{activity.time}</span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(activity.durationMinutes)}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-orange-600 inline-flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{activity.participants.length} dalībnieki</span>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {editingActivity ? 'Rediģēt pasākumu' : 'Jauns pasākums'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pakalpojums *
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    formErrors.serviceId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Izvēlieties pakalpojumu...</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({formatDuration(service.durationMinutes)}) - {service.isFree ? 'Bezmaksas' : `€${service.price.toFixed(2)}`}
                    </option>
                  ))}
                </select>
                {formErrors.serviceId && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.serviceId}</p>
                )}
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Datums *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      formErrors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.date && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Laiks
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ilgums (minūtes) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    formErrors.durationMinutes ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.durationMinutes && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.durationMinutes}</p>
                )}
              </div>

              {/* Participant Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dalībnieki * ({formData.participants.length} izvēlēti)
                  </label>
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    {filteredResidents.every(r => formData.participants.includes(r.id))
                      ? 'Noņemt visiem'
                      : 'Izvēlēties visus'}
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Meklēt rezidentu..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {formErrors.participants && (
                  <p className="mb-2 text-sm text-red-500">{formErrors.participants}</p>
                )}

                {/* Resident List */}
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredResidents.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      {residents.length === 0
                        ? 'Nav pieejamu rezidentu'
                        : 'Nav atrasts neviens rezidents'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredResidents.map(resident => (
                        <label
                          key={resident.id}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            formData.participants.includes(resident.id)
                              ? 'bg-orange-500 border-orange-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.participants.includes(resident.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={formData.participants.includes(resident.id)}
                            onChange={() => toggleParticipant(resident.id)}
                            className="sr-only"
                          />
                          <span className="text-sm text-gray-900">
                            {resident.firstName} {resident.lastName}
                          </span>
                          {resident.roomNumber && (
                            <span className="text-xs text-gray-500">
                              Ist. {resident.roomNumber}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Service Info */}
              {selectedService && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pakalpojums:</span>
                    <span className="font-medium">{selectedService.name}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-600">Cena vienam dalībniekam:</span>
                    <span className={`font-medium ${selectedService.isFree ? 'text-green-600' : 'text-blue-600'}`}>
                      {selectedService.isFree ? 'Bezmaksas' : `€${selectedService.price.toFixed(2)}`}
                    </span>
                  </div>
                  {!selectedService.isFree && formData.participants.length > 0 && (
                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-200">
                      <span className="text-gray-600">Kopā ({formData.participants.length} dalībnieki):</span>
                      <span className="font-medium text-blue-600">
                        €{(selectedService.price * formData.participants.length).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Atcelt
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
              >
                Saglabāt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Participants Modal */}
      {viewingParticipants && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div>
                <h3 className="font-semibold text-gray-900">{viewingParticipants.serviceName}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(viewingParticipants.date)}{viewingParticipants.time ? ` • ${viewingParticipants.time}` : ''} • {formatDuration(viewingParticipants.durationMinutes)}
                </p>
              </div>
              <button
                onClick={() => setViewingParticipants(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">{viewingParticipants.participants.length} dalībnieki</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                viewingParticipants.isFree
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {viewingParticipants.isFree ? 'Bezmaksas' : `€${viewingParticipants.price.toFixed(2)}`}
              </span>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="divide-y divide-gray-100">
                {viewingParticipants.participants.map((participantId) => {
                  const resident = residents.find(r => r.id === participantId);
                  if (!resident) {
                    return (
                      <div key={participantId} className="px-4 py-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                          ?
                        </div>
                        <span className="text-sm text-gray-500">Nezināms rezidents</span>
                      </div>
                    );
                  }
                  const initials = `${resident.firstName?.[0] || ''}${resident.lastName?.[0] || ''}`.toUpperCase();
                  return (
                    <div
                      key={participantId}
                      className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-400 text-sm font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">
                          {resident.firstName} {resident.lastName}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {resident.roomNumber && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              Istaba {resident.roomNumber}
                            </span>
                          )}
                          {resident.careLevel && (
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              {resident.careLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const activity = viewingParticipants;
                    setViewingParticipants(null);
                    handleEdit(activity);
                  }}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Rediģēt
                </button>
                <button
                  onClick={() => {
                    const activityId = viewingParticipants.id;
                    setViewingParticipants(null);
                    setDeleteConfirm(activityId);
                  }}
                  className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Dzēst
                </button>
              </div>
              <button
                onClick={() => setViewingParticipants(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Aizvērt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Dzēst pasākumu?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vai tiešām vēlaties dzēst šo pasākumu? Tiks dzēsti arī sociālās aprūpes ieraksti visiem dalībniekiem.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Atcelt
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Dzēst
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
