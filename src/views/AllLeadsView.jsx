import React, { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import PageShell from '../components/PageShell';
import LeadAvatar from '../components/LeadAvatar';
import StatusBadge from '../components/StatusBadge';
import { STATUS } from '../constants/steps';

/**
 * All leads list view
 * Shows all leads in table (desktop) or card (mobile) format
 * Supports filtering by view type (all-leads or queue)
 */
const AllLeadsView = ({ allLeads, onAddNew, onSelectLead, filterView = 'all-leads' }) => {
  const [showCancelled, setShowCancelled] = useState(false);

  // Use real persisted leads, but show sample data if empty
  const sampleLeads = allLeads.length > 0 ? [] : [
    {
      id: 'L-2025-001',
      firstName: 'Mārtiņš',
      lastName: 'Ozols',
      email: 'martins.ozols@inbox.lv',
      phone: '+371 29111222',
      status: STATUS.AGREEMENT,
      createdDate: '2025-12-15',
      consultation: { careLevel: '3', price: 77 }
    },
    {
      id: 'L-2025-002',
      firstName: 'Līga',
      lastName: 'Kalniņa',
      email: 'liga.k@gmail.com',
      phone: '+371 26333444',
      status: STATUS.QUEUE,
      createdDate: '2025-12-16',
      consultation: { careLevel: '2', price: 70 }
    },
    {
      id: 'L-2025-003',
      firstName: 'Jānis',
      lastName: 'Bērziņš',
      email: 'janis.b@outlook.com',
      phone: '+371 22555666',
      status: STATUS.CONSULTATION,
      createdDate: '2025-12-17',
      consultation: { careLevel: '1', price: 65 }
    },
    {
      id: 'L-2025-004',
      firstName: 'Anna',
      lastName: 'Liepiņa',
      email: 'anna.l@inbox.lv',
      phone: '+371 28777888',
      status: STATUS.PROSPECT,
      createdDate: '2025-12-18'
    }
  ];

  const displayLeads = allLeads.length > 0 ? allLeads : sampleLeads;

  // Filter leads based on view and cancelled toggle
  let filteredLeads = filterView === 'queue'
    ? displayLeads.filter(lead => lead.status === STATUS.QUEUE)
    : displayLeads;

  // Exclude cancelled leads unless showCancelled is true
  if (!showCancelled) {
    filteredLeads = filteredLeads.filter(lead => lead.status !== STATUS.CANCELLED);
  }

  // Dynamic header text based on filter
  const headerText = filterView === 'queue' ? 'Rinda' : 'Visi pieteikumi un klienti';

  return (
    <PageShell maxWidth="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{headerText}</h1>
              <p className="text-sm text-gray-600">
                {filteredLeads.length} ieraksti
                {allLeads.length === 0 && ' (paraugdati)'}
              </p>
            </div>
          </div>
          <button
            onClick={onAddNew}
            className="w-full sm:w-auto px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Jauns pieteikums
          </button>
        </div>

        {/* Show Cancelled Toggle */}
        <div className="mt-3">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800 w-fit">
            <input
              type="checkbox"
              checked={showCancelled}
              onChange={(e) => setShowCancelled(e.target.checked)}
              className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
            />
            <span>Rādīt atceltus pieteikumus ({displayLeads.filter(l => l.status === STATUS.CANCELLED).length})</span>
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-orange-600">
            {filteredLeads.filter(l => l.status === STATUS.PROSPECT).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Pieteikumi</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-yellow-600">
            {filteredLeads.filter(l => l.status === STATUS.CONSULTATION).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Konsultācijas</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-purple-600">
            {filteredLeads.filter(l => l.status === STATUS.SURVEY_FILLED).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Anketas</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {filteredLeads.filter(l => l.status === STATUS.AGREEMENT).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Līgumi</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-blue-600">
            {filteredLeads.filter(l => l.status === STATUS.QUEUE).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Rindā</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <p className="text-xl sm:text-2xl font-bold text-gray-600">
            {displayLeads.filter(l => l.status === STATUS.CANCELLED).length}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">Atcelti</p>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredLeads.map((lead) => {
          const isCancelled = lead.status === STATUS.CANCELLED;
          return (
          <div
            key={lead.id}
            className={isCancelled
              ? "bg-white rounded-lg shadow-sm border border-gray-200 p-4 opacity-60 cursor-not-allowed"
              : "bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            }
            onClick={() => onSelectLead(lead)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <LeadAvatar
                  firstName={lead.firstName}
                  lastName={lead.lastName}
                  size="md"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{lead.id}</p>
                </div>
              </div>
              <StatusBadge status={lead.status} showIcon={false} />
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">{lead.email}</p>
              <p className="text-gray-600">{lead.phone}</p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-sm">
              <span className="text-gray-500">{lead.createdDate}</span>
              <div className="flex items-center gap-3">
                {lead.consultation?.careLevel && (
                  <span className="text-gray-700">{lead.consultation.careLevel}. līm.</span>
                )}
                {lead.consultation?.price && (
                  <span className="font-medium text-green-600">{lead.consultation.price} €/d</span>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Klients
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kontakti
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aprūpe
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cena
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Datums
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLeads.map((lead) => {
                const isCancelled = lead.status === STATUS.CANCELLED;
                return (
                <tr
                  key={lead.id}
                  className={isCancelled ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50 cursor-pointer"}
                  onClick={() => onSelectLead(lead)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <LeadAvatar
                        firstName={lead.firstName}
                        lastName={lead.lastName}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {lead.firstName} {lead.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{lead.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{lead.email}</p>
                    <p className="text-xs text-gray-500">{lead.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status} showIcon={false} />
                  </td>
                  <td className="px-4 py-3">
                    {lead.consultation?.careLevel ? (
                      <span className="text-sm text-gray-700">{lead.consultation.careLevel}. līmenis</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.consultation?.price ? (
                      <span className="text-sm font-medium text-gray-900">{lead.consultation.price} €/d</span>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{lead.createdDate}</span>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
};

export default AllLeadsView;
