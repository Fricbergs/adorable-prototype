import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bed, Users, Building, AlertTriangle, Filter, RefreshCw, Clock } from 'lucide-react';
import PageShell from '../components/PageShell';
import { getAllRooms, getAllBeds, getOccupancyStats, getRoomsWithOccupancy } from '../domain/roomHelpers';
import { getTenureStats } from '../domain/residentHelpers';
import { DEPARTMENTS, DEPARTMENT_FILTER_OPTIONS } from '../constants/departmentConstants';

/**
 * BedFundView - Gultu fonda pārskats
 * Shows bed availability statistics and visual room/bed layout
 */
export default function BedFundView({ onBack }) {
  const [stats, setStats] = useState(null);
  const [tenureStats, setTenureStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');

  // Load data
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const occupancyStats = getOccupancyStats();
    const roomsWithOccupancy = getRoomsWithOccupancy();
    const tenure = getTenureStats();
    setStats(occupancyStats);
    setRooms(roomsWithOccupancy);
    setTenureStats(tenure);
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    if (departmentFilter !== 'all' && room.department !== departmentFilter) return false;
    if (floorFilter !== 'all' && room.floor !== parseInt(floorFilter)) return false;
    return true;
  });

  // Calculate filtered stats
  const filteredStats = {
    totalBeds: filteredRooms.reduce((sum, r) => sum + r.bedCount, 0),
    occupiedBeds: filteredRooms.reduce((sum, r) => sum + r.occupiedBeds, 0),
    reservedBeds: filteredRooms.reduce((sum, r) => sum + r.reservedBeds, 0),
    freeBeds: filteredRooms.reduce((sum, r) => sum + r.freeBeds, 0)
  };

  // Group rooms by floor
  const roomsByFloor = filteredRooms.reduce((acc, room) => {
    const floor = room.floor;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {});

  // Get department stats
  const getDepartmentStats = (dept) => {
    const deptRooms = rooms.filter(r => r.department === dept);
    return {
      totalBeds: deptRooms.reduce((sum, r) => sum + r.bedCount, 0),
      occupiedBeds: deptRooms.reduce((sum, r) => sum + r.occupiedBeds, 0),
      reservedBeds: deptRooms.reduce((sum, r) => sum + r.reservedBeds, 0),
      freeBeds: deptRooms.reduce((sum, r) => sum + r.freeBeds, 0)
    };
  };

  const regularStats = getDepartmentStats('regular');
  const dementiaStats = getDepartmentStats('dementia');

  // Bed status colors
  const getBedColor = (status) => {
    switch (status) {
      case 'occupied': return 'bg-red-500';
      case 'reserved': return 'bg-yellow-400';
      case 'free': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getBedLabel = (status) => {
    switch (status) {
      case 'occupied': return 'Aizņemta';
      case 'reserved': return 'Rezervēta';
      case 'free': return 'Brīva';
      default: return 'Nav zināms';
    }
  };

  if (!stats) {
    return (
      <PageShell maxWidth="max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </PageShell>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Gultu fonds</h1>
            <p className="text-sm text-gray-500">Istabu un gultu pieejamības pārskats</p>
          </div>
        </div>
        <button
          onClick={refreshData}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Atjaunot datus"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bed className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Kopā gultas</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBeds}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-500">Aizņemtas</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.occupiedBeds}</p>
          <p className="text-xs text-gray-500">{stats.occupancyRate}% noslogojums</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-sm text-gray-500">Rezervētas</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{stats.reservedBeds}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-500">Brīvas</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.freeBeds}</p>
        </div>
        {/* Tenure of Stay - AD-79 */}
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Vid. uzturēšanās</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{tenureStats?.avgDays || 0}</p>
          <p className="text-xs text-gray-500">dienas ({tenureStats?.count || 0} rez.)</p>
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Regular Department */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">{DEPARTMENTS.regular.label}</h3>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-xl font-bold text-gray-900">{regularStats.totalBeds}</p>
              <p className="text-xs text-gray-500">Kopā</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">{regularStats.occupiedBeds}</p>
              <p className="text-xs text-gray-500">Aizņemtas</p>
            </div>
            <div>
              <p className="text-xl font-bold text-yellow-600">{regularStats.reservedBeds}</p>
              <p className="text-xs text-gray-500">Rezervētas</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{regularStats.freeBeds}</p>
              <p className="text-xs text-gray-500">Brīvas</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="bg-red-500"
              style={{ width: `${(regularStats.occupiedBeds / regularStats.totalBeds) * 100}%` }}
            />
            <div
              className="bg-yellow-400"
              style={{ width: `${(regularStats.reservedBeds / regularStats.totalBeds) * 100}%` }}
            />
            <div
              className="bg-green-500"
              style={{ width: `${(regularStats.freeBeds / regularStats.totalBeds) * 100}%` }}
            />
          </div>
        </div>

        {/* Dementia Department */}
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-900">{DEPARTMENTS.dementia.label}</h3>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">3. stāvs</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-xl font-bold text-gray-900">{dementiaStats.totalBeds}</p>
              <p className="text-xs text-gray-500">Kopā</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">{dementiaStats.occupiedBeds}</p>
              <p className="text-xs text-gray-500">Aizņemtas</p>
            </div>
            <div>
              <p className="text-xl font-bold text-yellow-600">{dementiaStats.reservedBeds}</p>
              <p className="text-xs text-gray-500">Rezervētas</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{dementiaStats.freeBeds}</p>
              <p className="text-xs text-gray-500">Brīvas</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden flex">
            <div
              className="bg-red-500"
              style={{ width: `${(dementiaStats.occupiedBeds / dementiaStats.totalBeds) * 100}%` }}
            />
            <div
              className="bg-yellow-400"
              style={{ width: `${(dementiaStats.reservedBeds / dementiaStats.totalBeds) * 100}%` }}
            />
            <div
              className="bg-green-500"
              style={{ width: `${(dementiaStats.freeBeds / dementiaStats.totalBeds) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtri:</span>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {DEPARTMENT_FILTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">Visi stāvi</option>
            <option value="1">1. stāvs</option>
            <option value="2">2. stāvs</option>
            <option value="3">3. stāvs</option>
          </select>

          {/* Filtered stats summary */}
          {(departmentFilter !== 'all' || floorFilter !== 'all') && (
            <div className="ml-auto flex items-center gap-4 text-sm">
              <span className="text-gray-500">Filtrēts:</span>
              <span className="font-medium">{filteredStats.totalBeds} gultas</span>
              <span className="text-green-600">{filteredStats.freeBeds} brīvas</span>
            </div>
          )}
        </div>
      </div>

      {/* Room Grid by Floor */}
      <div className="space-y-6">
        {Object.keys(roomsByFloor).sort((a, b) => a - b).map(floor => (
          <div key={floor} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{floor}. stāvs</h3>
                {parseInt(floor) === 3 && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                    Demences nodaļa
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{roomsByFloor[floor].length} istabas</span>
                <span>{roomsByFloor[floor].reduce((s, r) => s + r.freeBeds, 0)} brīvas gultas</span>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {roomsByFloor[floor].map(room => (
                  <div
                    key={room.id}
                    className={`border rounded-lg p-3 ${
                      room.status === 'maintenance'
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">Ist. {room.number}</span>
                      {room.status === 'maintenance' && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" title="Remontā" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {room.beds.map(bed => (
                        <div
                          key={bed.id}
                          className={`w-6 h-6 rounded ${getBedColor(bed.status)} flex items-center justify-center`}
                          title={`Gulta ${bed.bedNumber}: ${getBedLabel(bed.status)}`}
                        >
                          <span className="text-white text-xs font-bold">{bed.bedNumber}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {room.type === 'single' ? 'Vienvietīga' : 'Divvietīga'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Apzīmējumi</h4>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-sm text-gray-600">Brīva</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-400"></div>
            <span className="text-sm text-gray-600">Rezervēta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm text-gray-600">Aizņemta</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600">Istaba remontā</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
