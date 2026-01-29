import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Pencil, Trash2, X, Clock, Euro, ChevronRight, Settings, Play } from 'lucide-react';
import PageShell from '../components/PageShell';

const STORAGE_KEY = 'adorable-services';

/**
 * Get services from localStorage
 */
const getServices = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error loading services:', e);
    return [];
  }
};

/**
 * Save services to localStorage
 */
const saveServices = (services) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
};

/**
 * Generate unique ID
 */
const generateId = () => `svc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * SettingsView - System settings with Services management
 */
export default function SettingsView({ onBack, onNavigate, onStartDemo }) {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingService, setViewingService] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    durationMinutes: '',
    price: '',
    isFree: false
  });
  const [formErrors, setFormErrors] = useState({});

  // Load services on mount
  useEffect(() => {
    setServices(getServices());
  }, []);

  // Open modal for new service
  const handleAddNew = () => {
    setFormData({ name: '', durationMinutes: '', price: '', isFree: false });
    setFormErrors({});
    setEditingService(null);
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      durationMinutes: service.durationMinutes.toString(),
      price: service.price.toString(),
      isFree: service.isFree
    });
    setFormErrors({});
    setEditingService(service);
    setShowModal(true);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Nosaukums ir obligāts';
    }
    if (!formData.durationMinutes || parseInt(formData.durationMinutes) <= 0) {
      errors.durationMinutes = 'Ilgums ir obligāts';
    }
    if (!formData.isFree && (!formData.price || parseFloat(formData.price) < 0)) {
      errors.price = 'Cena ir obligāta maksas pakalpojumam';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save service
  const handleSave = () => {
    if (!validateForm()) return;

    const serviceData = {
      id: editingService?.id || generateId(),
      name: formData.name.trim(),
      durationMinutes: parseInt(formData.durationMinutes),
      price: formData.isFree ? 0 : parseFloat(formData.price),
      isFree: formData.isFree
    };

    let updatedServices;
    if (editingService) {
      updatedServices = services.map(s => s.id === editingService.id ? serviceData : s);
    } else {
      updatedServices = [...services, serviceData];
    }

    saveServices(updatedServices);
    setServices(updatedServices);
    setShowModal(false);
    setEditingService(null);
  };

  // Delete service
  const handleDelete = (serviceId) => {
    const updatedServices = services.filter(s => s.id !== serviceId);
    saveServices(updatedServices);
    setServices(updatedServices);
    setDeleteConfirm(null);
  };

  // Format duration for display
  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <PageShell maxWidth="max-w-4xl">
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
            <h1 className="text-2xl font-bold text-gray-900">Iestatījumi</h1>
            <p className="text-sm text-gray-500">Sistēmas konfigurācija</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Pakalpojumi</h2>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Pievienot pakalpojumu
          </button>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          {services.length} pakalpojumi
        </div>

        {services.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="mb-2">Nav pievienotu pakalpojumu</p>
            <p className="text-sm">Pievienojiet pakalpojumus, lai tos varētu izmantot grupu pasākumos</p>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => setViewingService(service)}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  {/* Service Icon */}
                  <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-8 h-8 text-blue-500" />
                  </div>

                  {/* Service Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{service.name}</span>
                      {service.isFree ? (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Bezmaksas
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          €{service.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(service.durationMinutes)}
                      </span>
                      {!service.isFree && (
                        <span className="inline-flex items-center gap-1">
                          <Euro className="w-3.5 h-3.5" />
                          {service.price.toFixed(2)} EUR
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Import History Section */}
      <div className="mb-6">
        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold text-gray-900">Importu vēsture</h2>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Skatiet visu noliktavas darbību vēsturi — XML importus, manuālās ievades, pārvietošanas un radinieku atnestos medikamentus.
          </p>
          <button
            onClick={() => onNavigate && onNavigate('import-history')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            Skatīt vēsturi
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Section */}
      <div className="mb-6">
        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-5 h-5 text-gray-700" />
            <h2 className="font-semibold text-gray-900">Demo</h2>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Izejiet cauri pilnam demonstrācijas scenārijam, kas pārklāj visus noliktavas darbības veidus.
          </p>
          <button
            onClick={() => onStartDemo && onStartDemo()}
            disabled={!onStartDemo}
            title={!onStartDemo ? 'Drīzumā' : undefined}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              onStartDemo
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Sākt demo
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {editingService ? 'Rediģēt pakalpojumu' : 'Jauns pakalpojums'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nosaukums *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="piem., Rīta vingrošana"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
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
                  placeholder="piem., 30"
                />
                {formErrors.durationMinutes && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.durationMinutes}</p>
                )}
              </div>

              {/* Free checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="isFree" className="text-sm text-gray-700">
                  Bezmaksas pakalpojums
                </label>
              </div>

              {/* Price (only if not free) */}
              {!formData.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cena (EUR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      formErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="piem., 5.00"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>
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

      {/* View Service Modal */}
      {viewingService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{viewingService.name}</h3>
              <button
                onClick={() => setViewingService(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{viewingService.name}</div>
                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    viewingService.isFree
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {viewingService.isFree ? 'Bezmaksas' : `€${viewingService.price.toFixed(2)}`}
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Ilgums</span>
                  <span className="font-medium text-gray-900">{formatDuration(viewingService.durationMinutes)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Cena</span>
                  <span className="font-medium text-gray-900">
                    {viewingService.isFree ? 'Bezmaksas' : `€${viewingService.price.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">Veids</span>
                  <span className="font-medium text-gray-900">
                    {viewingService.isFree ? 'Bezmaksas pakalpojums' : 'Maksas pakalpojums'}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const service = viewingService;
                    setViewingService(null);
                    handleEdit(service);
                  }}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Rediģēt
                </button>
                <button
                  onClick={() => {
                    const serviceId = viewingService.id;
                    setViewingService(null);
                    setDeleteConfirm(serviceId);
                  }}
                  className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Dzēst
                </button>
              </div>
              <button
                onClick={() => setViewingService(null)}
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
            <h3 className="font-semibold text-gray-900 mb-2">Dzēst pakalpojumu?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Vai tiešām vēlaties dzēst šo pakalpojumu? Šī darbība ir neatgriezeniska.
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
