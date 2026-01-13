import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, User, Home, Heart, ChevronRight, Package, Pill, Building, Brain, Layers } from 'lucide-react';
import PageShell from '../components/PageShell';
import { getActiveResidents } from '../domain/residentHelpers';
import { getResidentInventory } from '../domain/inventoryHelpers';
import { getActivePrescriptionsForResident } from '../domain/prescriptionHelpers';
import { DEPARTMENTS, FLOOR_DEPARTMENT_MAP } from '../constants/departmentConstants';

/**
 * ResidentListView - Unified list of residents
 * Navigates to ResidentProfileView with tabs for Profile, Prescriptions, Inventory
 */
export default function ResidentListView({ onSelectResident, onBack }) {
  const [residents, setResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    const loadedResidents = getActiveResidents();
    setResidents(loadedResidents);
  }, []);

  // Extract floor from room number (e.g., "301" -> 3)
  const getFloorFromRoom = (roomNumber) => {
    if (!roomNumber) return null;
    const firstDigit = parseInt(roomNumber.charAt(0));
    return isNaN(firstDigit) ? null : firstDigit;
  };

  // Get department for a resident based on their floor
  const getDepartmentForResident = (resident) => {
    const floor = getFloorFromRoom(resident.roomNumber);
    if (!floor) return 'unknown';
    return FLOOR_DEPARTMENT_MAP[floor] || 'regular';
  };

  // Dynamic filter options based on actual resident data
  const filterOptions = useMemo(() => {
    const floors = new Set();
    const departments = new Set();

    residents.forEach(resident => {
      const floor = getFloorFromRoom(resident.roomNumber);
      if (floor) {
        floors.add(floor);
        departments.add(FLOOR_DEPARTMENT_MAP[floor] || 'regular');
      }
    });

    return {
      floors: Array.from(floors).sort((a, b) => a - b),
      departments: Array.from(departments)
    };
  }, [residents]);

  // Filter residents by search query, floor, and department
  const filteredResidents = residents.filter(resident => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${resident.firstName} ${resident.lastName}`.toLowerCase();
      const matchesSearch = (
        fullName.includes(query) ||
        resident.roomNumber?.toLowerCase().includes(query) ||
        resident.personalCode?.includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Floor filter
    if (selectedFloor !== 'all') {
      const floor = getFloorFromRoom(resident.roomNumber);
      if (floor !== parseInt(selectedFloor)) return false;
    }

    // Department filter
    if (selectedDepartment !== 'all') {
      const department = getDepartmentForResident(resident);
      if (department !== selectedDepartment) return false;
    }

    return true;
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

  // Get summary stats for a resident
  const getResidentStats = (residentId) => {
    const prescriptions = getActivePrescriptionsForResident(residentId);
    const inventory = getResidentInventory(residentId);
    return {
      prescriptionCount: prescriptions?.length || 0,
      inventoryCount: inventory?.length || 0
    };
  };

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rezidenti</h1>
        <p className="text-gray-600 mt-1">
          Izvēlieties rezidentu, lai skatītu profilu, ordinācijas vai noliktavu
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
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

      {/* Dynamic Filters */}
      <div className="mb-6 space-y-3">
        {/* Floor Filter */}
        {filterOptions.floors.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Layers className="w-4 h-4" />
              Stāvs:
            </span>
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedFloor === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Visi
            </button>
            {filterOptions.floors.map(floor => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor.toString())}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedFloor === floor.toString()
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {floor}. stāvs
              </button>
            ))}
          </div>
        )}

        {/* Department Filter */}
        {filterOptions.departments.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Brain className="w-4 h-4" />
              Nodaļa:
            </span>
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedDepartment === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Visas
            </button>
            {filterOptions.departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedDepartment === dept
                    ? dept === 'dementia' ? 'bg-purple-500 text-white' : 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {DEPARTMENTS[dept]?.label || dept}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats summary */}
      <div className="mb-6 flex items-center gap-4 text-sm text-gray-500">
        <span>{filteredResidents.length} rezidenti</span>
        {(selectedFloor !== 'all' || selectedDepartment !== 'all') && (
          <button
            onClick={() => { setSelectedFloor('all'); setSelectedDepartment('all'); }}
            className="text-orange-600 hover:text-orange-700 underline"
          >
            Notīrīt filtrus
          </button>
        )}
      </div>

      {/* Residents list */}
      <div className="space-y-3">
        {filteredResidents.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            {(searchQuery || selectedFloor !== 'all' || selectedDepartment !== 'all')
              ? 'Nav atrasti rezidenti ar šiem kritērijiem'
              : 'Nav pievienotu rezidentu'}
          </div>
        ) : (
          filteredResidents.map(resident => {
            const age = calculateAge(resident.birthDate);
            const hasAllergies = resident.allergies && resident.allergies.length > 0;
            const stats = getResidentStats(resident.id);

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
                    {/* Quick stats */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Pill className="w-3 h-3" />
                        {stats.prescriptionCount} medikamenti
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {stats.inventoryCount} noliktavā
                      </span>
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
