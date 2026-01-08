import React from 'react';
import { User, Home, Phone, Mail, Calendar, AlertCircle, Edit2 } from 'lucide-react';
import { CARE_LEVELS, RESIDENT_STATUS } from '../../constants/residentConstants';
import { calculateAge, getResidentFullName } from '../../domain/residentHelpers';

/**
 * ResidentHeader - Displays resident basic info at top of profile
 */
const ResidentHeader = ({ resident, onEdit }) => {
  if (!resident) return null;

  const age = calculateAge(resident.birthDate);
  const careLevel = CARE_LEVELS[resident.careLevel] || CARE_LEVELS['3'];
  const status = RESIDENT_STATUS[resident.status] || RESIDENT_STATUS.active;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Top colored bar based on status */}
      <div className={`h-1 ${
        resident.status === 'active' ? 'bg-green-500' :
        resident.status === 'discharged' ? 'bg-gray-400' : 'bg-gray-300'
      }`} />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center">
              {resident.photo ? (
                <img
                  src={resident.photo}
                  alt={getResidentFullName(resident)}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600" />
              )}
            </div>
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {getResidentFullName(resident)}
                </h1>
                <p className="text-sm text-gray-500">
                  {resident.personalCode || 'ID nav norādīts'}
                  {age && <span className="ml-2">• {age} gadi</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}>
                  {status.label}
                </span>
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Room */}
              {resident.roomNumber && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  <Home className="w-3.5 h-3.5" />
                  Istaba {resident.roomNumber}
                  {resident.bedNumber && <span className="text-blue-500">/ Gulta {resident.bedNumber}</span>}
                </span>
              )}

              {/* Care Level */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                {careLevel.value}
              </span>

              {/* Allergies */}
              {resident.allergies && resident.allergies.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {resident.allergies.length} alerģija(s)
                </span>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
              {resident.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {resident.phone}
                </span>
              )}
              {resident.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {resident.email}
                </span>
              )}
              {resident.admissionDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Uzņemts: {new Date(resident.admissionDate).toLocaleDateString('lv-LV')}
                </span>
              )}
            </div>

            {/* Agreement Info */}
            {resident.agreementNumber && (
              <p className="text-xs text-gray-400 mt-2">
                Līgums: {resident.agreementNumber}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentHeader;
