import React, { useState, useEffect } from 'react';
import { Bed, ArrowLeft, Check, Home, User, AlertTriangle } from 'lucide-react';
import PageShell from '../components/PageShell';
import RoomCard from '../components/rooms/RoomCard';
import {
  getRoomsWithOccupancy,
  getAvailableBeds,
  reserveBed,
  cancelReservation
} from '../domain/roomHelpers';
import { createResidentFromLead } from '../domain/residentHelpers';
import { FLOORS, ROOM_TYPES } from '../constants/roomConstants';

/**
 * BedBookingView - Bed selection during agreement process
 * Shown after agreement is created, allows selecting room and bed
 *
 * Props:
 * - lead: The lead to create resident from (required unless selectionOnly)
 * - onComplete: Callback with created resident (used when creating resident)
 * - onSelectRoom: Callback with {room, bedNumber} (used when selectionOnly=true)
 * - onBack: Back navigation callback
 * - selectionOnly: If true, just returns room/bed selection without creating resident
 */
const BedBookingView = ({ lead, onComplete, onSelectRoom, onBack, selectionOnly = false }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(0); // 0 = all floors
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load rooms
  useEffect(() => {
    const roomsData = getRoomsWithOccupancy();
    setRooms(roomsData);
  }, []);

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    // Must have available beds
    if (room.freeBeds === 0 || room.status === 'maintenance') return false;
    // Floor filter
    if (selectedFloor !== 0 && room.floor !== selectedFloor) return false;
    // Type filter
    if (selectedRoomType !== 'all' && room.type !== selectedRoomType) return false;
    return true;
  });

  // Handle room/bed selection
  const handleRoomSelect = (room, bedNumber) => {
    if (bedNumber) {
      // Direct bed selection
      setSelectedRoom(room);
      setSelectedBed(bedNumber);
    } else {
      // Room selected, show beds
      setSelectedRoom(room);
      setSelectedBed(null);
    }
    setError('');
  };

  // Handle bed selection within selected room
  const handleBedSelect = (bedNumber) => {
    setSelectedBed(bedNumber);
    setError('');
  };

  // Handle confirm and create resident (or just return selection)
  const handleConfirm = async () => {
    if (!selectedRoom || !selectedBed) {
      setError('Lūdzu izvēlieties istabu un gultu');
      return;
    }

    // Selection-only mode: just return the selection without creating resident
    if (selectionOnly) {
      onSelectRoom?.({ room: selectedRoom, bedNumber: selectedBed });
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create resident from lead with room assignment
      const resident = createResidentFromLead(lead, selectedRoom.id, selectedBed);

      // Notify parent of completion
      onComplete?.(resident);
    } catch (err) {
      setError(err.message || 'Kļūda izveidojot rezidentu');
      setIsProcessing(false);
    }
  };

  // Get room type preference from lead consultation
  const preferredRoomType = lead?.consultation?.roomType || null;

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Atpakaļ uz līgumu
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bed className="w-7 h-7 text-orange-500" />
            Rezervēt gultu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Izvēlieties istabu un gultu jaunajam rezidentam
          </p>
        </div>

        {/* Lead Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {lead?.firstName} {lead?.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                Līgums: {lead?.agreementNumber}
                {preferredRoomType && (
                  <span className="ml-2">
                    • Vēlamā istaba: {ROOM_TYPES[preferredRoomType]?.label || preferredRoomType}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Floor filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Stāvs:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedFloor(0)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedFloor === 0
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
                }`}
              >
                Visi
              </button>
              {FLOORS.map((floor) => (
                <button
                  key={floor.value}
                  onClick={() => setSelectedFloor(floor.value)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    selectedFloor === floor.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  {floor.value}
                </button>
              ))}
            </div>
          </div>

          {/* Room type filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Tips:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedRoomType('all')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  selectedRoomType === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
                }`}
              >
                Visi
              </button>
              {Object.entries(ROOM_TYPES).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedRoomType(key)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    selectedRoomType === key
                      ? 'bg-orange-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-orange-300'
                  }${preferredRoomType === key ? ' ring-2 ring-orange-300' : ''}`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Room Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <Home className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nav pieejamu istabu ar izvēlētajiem filtriem</p>
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                className={`${selectedRoom?.id === room.id ? 'ring-2 ring-orange-500 rounded-lg' : ''}`}
              >
                <RoomCard
                  room={room}
                  selectable
                  selectedBed={selectedRoom?.id === room.id ? selectedBed : null}
                  onSelect={handleRoomSelect}
                />
              </div>
            ))
          )}
        </div>

        {/* Selected Room Detail */}
        {selectedRoom && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Izvēlētā istaba: {selectedRoom.number}
            </h3>

            {/* Bed selection if room has multiple beds */}
            {selectedRoom.bedCount > 1 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Izvēlieties gultu:</p>
                <div className="flex gap-2">
                  {selectedRoom.beds.map((bed) => (
                    <button
                      key={bed.id}
                      onClick={() => bed.status === 'free' && handleBedSelect(bed.bedNumber)}
                      disabled={bed.status !== 'free'}
                      className={`
                        flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors
                        ${bed.status === 'occupied'
                          ? 'bg-red-50 text-red-600 border-red-300 cursor-not-allowed'
                          : bed.status === 'reserved'
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-300 cursor-not-allowed'
                            : selectedBed === bed.bedNumber
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'bg-green-50 text-green-700 border-green-300 hover:border-orange-300'}
                      `}
                    >
                      <Bed className="w-4 h-4" />
                      Gulta {bed.bedNumber}
                      {bed.status !== 'free' && (
                        <span className="text-xs">({bed.status === 'occupied' ? 'aizņemta' : 'rezervēta'})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-select single bed */}
            {selectedRoom.bedCount === 1 && !selectedBed && (
              <p className="text-sm text-orange-700">
                Vienvietīga istaba - gulta tiks automātiski izvēlēta
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Atcelt
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedRoom || (!selectedBed && selectedRoom?.bedCount > 1) || isProcessing}
            className={`
              flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors
              ${(!selectedRoom || (!selectedBed && selectedRoom?.bedCount > 1) || isProcessing)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'}
            `}
          >
            {isProcessing ? (
              <>Apstrādā...</>
            ) : (
              <>
                <Check className="w-5 h-5" />
                {selectionOnly ? 'Izvēlēties šo istabu' : 'Apstiprināt un izveidot rezidentu'}
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        {selectedRoom && (selectedBed || selectedRoom.bedCount === 1) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Kopsavilkums</h3>
            <ul className="text-sm text-green-700 space-y-1">
              <li>Rezidents: <strong>{lead?.firstName} {lead?.lastName}</strong></li>
              <li>Istaba: <strong>{selectedRoom.number}</strong> ({ROOM_TYPES[selectedRoom.type]?.label})</li>
              <li>Gulta: <strong>{selectedBed || 1}</strong></li>
              <li>Stāvs: <strong>{selectedRoom.floor}. stāvs</strong></li>
            </ul>
          </div>
        )}
      </div>
    </PageShell>
  );
};

export default BedBookingView;
