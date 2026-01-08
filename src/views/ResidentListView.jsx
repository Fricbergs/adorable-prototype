import { useState, useEffect } from 'react';
import { ArrowLeft, Search, User, Home, Heart, ChevronRight, Users } from 'lucide-react';
import PageShell from '../components/PageShell';
import { getActiveResidents } from '../domain/residentHelpers';
import { getAllResidents as getPrescriptionResidents } from '../domain/prescriptionHelpers';

/**
 * ResidentListView - List of residents for selecting
 * mode: 'prescriptions' (go to prescriptions) or 'profile' (go to profile)
 */
export default function ResidentListView({ onSelectResident, onBack, mode = 'prescriptions' }) {
  const [residents, setResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load residents based on mode
    // For profile mode, use the new unified resident system
    // For prescriptions mode, use the prescription residents (backwards compatibility)
    const loadedResidents = mode === 'profile'
      ? getActiveResidents()
      : getPrescriptionResidents();
    setResidents(loadedResidents);
  }, [mode]);

  // Filter residents by search query
  const filteredResidents = residents.filter(resident => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const fullName = `${resident.firstName} ${resident.lastName}`.toLowerCase();
    return (
      fullName.includes(query) ||
      resident.roomNumber?.toLowerCase().includes(query) ||
      resident.personalCode?.includes(query)
    );
  });

  // Calculate age
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atpakaļ
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === 'profile' ? 'Rezidenti' : 'Ordinācijas plāns'}
        </h1>
        <p className="text-gray-600 mt-1">
          {mode === 'profile'
            ? 'Izvēlieties rezidentu, lai atvērtu profilu'
            : 'Izvēlieties rezidentu, lai skatītu ordinācijas plānu'}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Meklēt rezidentu pēc vārda, istabas vai personas koda..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {/* Residents list */}
      <div className="space-y-3">
        {filteredResidents.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            {searchQuery ? 'Nav atrasti rezidenti ar šiem meklēšanas kritērijiem' : 'Nav pievienotu rezidentu'}
          </div>
        ) : (
          filteredResidents.map(resident => {
            const age = calculateAge(resident.birthDate);
            const hasAllergies = resident.allergies && resident.allergies.length > 0;

            return (
              <button
                key={resident.id}
                onClick={() => onSelectResident(resident)}
                className="w-full bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-lg font-bold flex-shrink-0">
                    {resident.firstName?.[0]}{resident.lastName?.[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {resident.firstName} {resident.lastName}
                      </span>
                      {hasAllergies && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                          Alerģijas
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                      <span className="inline-flex items-center gap-1">
                        <Home className="w-3.5 h-3.5" />
                        Istaba {resident.roomNumber}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {resident.careLevel}
                      </span>
                      {age && (
                        <span>{age} gadi</span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Info notice */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">Demo režīms</h3>
            <p className="text-sm text-blue-700 mt-1">
              Šis ir prototips ar demonstrācijas datiem. Reālajā sistēmā rezidenti tiktu ielādēti no datubāzes.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
