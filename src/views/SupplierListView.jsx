import React, { useState, useEffect } from 'react';
import { Truck, ArrowLeft, Plus, Pencil, X } from 'lucide-react';
import PageShell from '../components/PageShell';
import { getAllSuppliers, createSupplier, updateSupplier } from '../domain/supplierHelpers';
import { SUPPLIER_CATALOG_TYPES } from '../constants/supplierConstants';

/**
 * Supplier management page with list table and add/edit modal
 */
const SupplierListView = ({ onBack }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Load suppliers
  const loadSuppliers = () => {
    setSuppliers(getAllSuppliers());
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  // Open modal for adding
  const handleAdd = () => {
    setEditingSupplier(null);
    setShowModal(true);
  };

  // Open modal for editing
  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
  };

  // Save supplier (create or update)
  const handleSave = (data) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, data);
    } else {
      createSupplier(data);
    }
    loadSuppliers();
    handleCloseModal();
  };

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <button
                onClick={onBack}
                className="hover:text-orange-600 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Noliktava
              </button>
              <span>/</span>
              <span className="text-gray-700">Piegādātāji</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-7 h-7 text-orange-500" />
              Piegādātāji
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Piegādātāju pārvaldība un kontaktinformācija
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Pievienot piegādātāju
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {suppliers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">Nav piegādātāju</p>
              <p className="text-sm mt-1">Pievienojiet pirmo piegādātāju, nospiežot pogu augstāk.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Nosaukums</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Kataloga veids</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Kontaktinformācija</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Statuss</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-700">Darbības</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {suppliers.map((supplier) => {
                    const catalogType = SUPPLIER_CATALOG_TYPES[supplier.catalogType];
                    const hasContact = supplier.contactInfo?.email || supplier.contactInfo?.phone;

                    return (
                      <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {supplier.name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {catalogType ? catalogType.label : supplier.catalogType}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {hasContact ? (
                            <div className="space-y-0.5">
                              {supplier.contactInfo.email && (
                                <div className="text-xs">{supplier.contactInfo.email}</div>
                              )}
                              {supplier.contactInfo.phone && (
                                <div className="text-xs">{supplier.contactInfo.phone}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">Nav norādīta</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {supplier.isActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Aktīvs
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Neaktīvs
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {supplier.isPseudoSupplier ? (
                            <span className="text-xs text-gray-400 italic">(sistēmas)</span>
                          ) : (
                            <button
                              onClick={() => handleEdit(supplier)}
                              className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                              title="Rediģēt"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {suppliers.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
              Kopā: {suppliers.length} piegādātāj{suppliers.length === 1 ? 's' : 'i'}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <SupplierModal
          supplier={editingSupplier}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </PageShell>
  );
};

/**
 * Modal for adding/editing a supplier
 */
const SupplierModal = ({ supplier, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    catalogType: supplier?.catalogType || 'manual',
    email: supplier?.contactInfo?.email || '',
    phone: supplier?.contactInfo?.phone || '',
    address: supplier?.contactInfo?.address || '',
    isActive: supplier?.isActive !== undefined ? supplier.isActive : true
  });
  const [errors, setErrors] = useState({});

  const isEditing = !!supplier;
  const isDefault = supplier?.isDefault === true;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Nosaukums ir obligāts';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: formData.name.trim(),
      catalogType: formData.catalogType,
      contactInfo: {
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim()
      },
      isActive: formData.isActive
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Rediģēt piegādātāju' : 'Jauns piegādātājs'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nosaukums *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Piem., Aptieka SIA"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Catalog Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kataloga veids
            </label>
            <select
              value={formData.catalogType}
              onChange={(e) => handleChange('catalogType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {Object.values(SUPPLIER_CATALOG_TYPES).map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-pasts
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="info@aptieka.lv"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tālrunis
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="+371 20000000"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adrese
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Brīvības iela 1, Rīga"
            />
          </div>

          {/* Active toggle - only for existing non-default suppliers */}
          {isEditing && !isDefault && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Aktīvs
              </label>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Atcelt
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Saglabāt
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierListView;
