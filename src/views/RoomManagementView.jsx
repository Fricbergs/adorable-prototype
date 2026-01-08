import React, { useState, useEffect } from 'react';
import { Home, Plus, RefreshCw, Users, Bed, AlertTriangle } from 'lucide-react';
import PageShell from '../components/PageShell';
import RoomCard from '../components/rooms/RoomCard';
import RoomEditModal from '../components/rooms/RoomEditModal';
import {
  getRoomsWithOccupancy,
  getOccupancyStats,
  createRoom,
  updateRoom,
  deleteRoom
} from '../domain/roomHelpers';
import { FLOORS } from '../constants/roomConstants';

/**
 * RoomManagementView - Full room management dashboard
 */
const RoomManagementView = ({ onNavigate }) => {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(0); // 0 = all floors
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [error, setError] = useState('');

  // Load data
  const loadData = () => {
    const roomsData = getRoomsWithOccupancy();
    setRooms(roomsData);
    setStats(getOccupancyStats());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter rooms by floor
  const filteredRooms = selectedFloor === 0
    ? rooms
    : rooms.filter(r => r.floor === selectedFloor);

  // Handle room save
  const handleSaveRoom = (formData) => {
    setError('');
    try {
      if (editingRoom) {
        updateRoom(editingRoom.id, formData);
      } else {
        createRoom(formData);
      }
      loadData();
      setShowEditModal(false);
      setEditingRoom(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle room edit
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowEditModal(true);
  };

  // Handle add new room
  const handleAddRoom = () => {
    setEditingRoom(null);
    setShowEditModal(true);
  };

  // Get occupancy color
  const getOccupancyColor = (rate) => {
    if (rate >= 80) return 'text-red-600';
    if (rate >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <button
                onClick={() => onNavigate && onNavigate('resident-list')}
                className="hover:text-orange-600 transition-colors"
              >
                Rezidenti
              </button>
              <span>/</span>
              <span className="text-gray-700">Istabu pārvaldība</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Home className="w-7 h-7 text-orange-500" />
              Istabu pārvaldība
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Atjaunot"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleAddRoom}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Jauna istaba
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Home className="w-4 h-4" />
                <span className="text-xs">Istabas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Bed className="w-4 h-4" />
                <span className="text-xs">Gultas</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBeds}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">Aizņemtība</span>
              </div>
              <p className={`text-2xl font-bold ${getOccupancyColor(stats.occupancyRate)}`}>
                {stats.occupancyRate}%
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <span className="w-4 h-4 flex items-center justify-center text-green-500 font-bold">B</span>
                <span className="text-xs">Brīvas gultas</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.freeBeds}</p>
            </div>
          </div>
        )}

        {/* Floor Statistics */}
        {stats && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Aizņemtība pa stāviem</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.byFloor.map((floor) => (
                <div key={floor.floor} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600">
                    {floor.floor}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{floor.floor}. stāvs</span>
                      <span className={`font-medium ${getOccupancyColor(floor.occupancyRate)}`}>
                        {floor.occupancyRate}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          floor.occupancyRate >= 80 ? 'bg-red-500' :
                          floor.occupancyRate >= 50 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${floor.occupancyRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {floor.occupied}/{floor.beds} gultas aizņemtas
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Floor Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedFloor(0)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedFloor === 0
                ? 'bg-orange-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
            }`}
          >
            Visi stāvi
          </button>
          {FLOORS.map((floor) => (
            <button
              key={floor.value}
              onClick={() => setSelectedFloor(floor.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFloor === floor.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
              }`}
            >
              {floor.label}
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nav atrasta neviena istaba</p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={handleEditRoom}
              />
            ))
          )}
        </div>

        {/* Room Type Summary */}
        {stats && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Istabu tipi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.byType.map((type) => (
                <div
                  key={type.type}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.rooms} istabas, {type.beds} gultas</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getOccupancyColor(type.occupancyRate)}`}>
                      {type.occupancyRate}%
                    </p>
                    <p className="text-xs text-gray-500">{type.occupied} aizņemtas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <RoomEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingRoom(null);
          setError('');
        }}
        room={editingRoom}
        onSave={handleSaveRoom}
      />
    </PageShell>
  );
};

export default RoomManagementView;
