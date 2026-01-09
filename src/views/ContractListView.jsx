import React, { useState, useMemo } from 'react';
import { FileText, Plus, Search, Filter, Eye, Edit, Printer, MoreVertical, XCircle, FileX } from 'lucide-react';
import PageShell from '../components/PageShell';
import {
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
  formatContractNumber
} from '../domain/contracts';
import { RESIDENCE_LABELS, formatDailyRate } from '../domain/products';
import { useContracts } from '../hooks/useContracts';
import TerminateContractModal from '../components/contract/TerminateContractModal';

/**
 * ContractListView - Contract management list view
 * Displays all contracts with filtering, search, and actions
 */
const ContractListView = ({
  onCreateNew,
  onViewContract,
  onEditContract,
  onPrintContract
}) => {
  const {
    contracts,
    cancelContract,
    terminateContract,
    deleteContract
  } = useContracts();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [residenceFilter, setResidenceFilter] = useState('all');

  // Menu state for actions
  const [openMenuId, setOpenMenuId] = useState(null);

  // Terminate modal state
  const [terminateModalContract, setTerminateModalContract] = useState(null);

  // Filter and search contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      // Status filter
      if (statusFilter !== 'all' && contract.status !== statusFilter) {
        return false;
      }

      // Residence filter
      if (residenceFilter !== 'all' && contract.residence !== residenceFilter) {
        return false;
      }

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesNumber = contract.contractNumber?.toLowerCase().includes(term);
        const matchesResident = contract.residentName?.toLowerCase().includes(term);
        const matchesClient = contract.clientName?.toLowerCase().includes(term);
        return matchesNumber || matchesResident || matchesClient;
      }

      return true;
    }).sort((a, b) => {
      // Sort by creation date descending
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [contracts, searchTerm, statusFilter, residenceFilter]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const styles = {
      [CONTRACT_STATUS.DRAFT]: 'bg-gray-100 text-gray-700',
      [CONTRACT_STATUS.ACTIVE]: 'bg-green-100 text-green-700',
      [CONTRACT_STATUS.COMPLETED]: 'bg-blue-100 text-blue-700',
      [CONTRACT_STATUS.CANCELLED]: 'bg-red-100 text-red-700'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {CONTRACT_STATUS_LABELS[status] || status}
      </span>
    );
  };

  // Handle action menu toggle
  const toggleMenu = (contractId) => {
    setOpenMenuId(openMenuId === contractId ? null : contractId);
  };

  // Handle cancel contract
  const handleCancel = (contract) => {
    if (window.confirm(`Vai tiešām vēlaties anulēt līgumu ${contract.contractNumber || contract.id}?`)) {
      cancelContract(contract.id);
    }
    setOpenMenuId(null);
  };

  // Handle terminate contract - opens modal
  const handleTerminate = (contract) => {
    setTerminateModalContract(contract);
    setOpenMenuId(null);
  };

  // Confirm termination from modal
  const handleConfirmTerminate = (terminationDate, reason) => {
    if (terminateModalContract) {
      terminateContract(terminateModalContract.id, terminationDate, reason);
      setTerminateModalContract(null);
    }
  };

  // Handle delete draft
  const handleDelete = (contract) => {
    if (window.confirm(`Vai tiešām vēlaties dzēst melnrakstu ${contract.id}?`)) {
      deleteContract(contract.id);
    }
    setOpenMenuId(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('lv-LV');
  };

  return (
    <PageShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-7 h-7 text-orange-500" />
              Līgumi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {contracts.length} līgumi kopā
            </p>
          </div>

          <button
            onClick={onCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Jauns līgums
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Meklēt pēc numura, rezidenta vai klienta..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Visi statusi</option>
                {Object.entries(CONTRACT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Residence Filter */}
            <select
              value={residenceFilter}
              onChange={(e) => setResidenceFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">Visas rezidences</option>
              {Object.entries(RESIDENCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contract List */}
        {filteredContracts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {contracts.length === 0
                ? 'Nav neviena līguma'
                : 'Nav līgumu, kas atbilst meklēšanas kritērijiem'}
            </p>
            {contracts.length === 0 && (
              <button
                onClick={onCreateNew}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Izveidot pirmo līgumu
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Līguma Nr.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rezidents
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rezidence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periods
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cena
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statuss
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Darbības
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {formatContractNumber(contract.contractNumber)}
                        </span>
                        {contract.status === CONTRACT_STATUS.DRAFT && (
                          <span className="ml-2 text-xs text-gray-400">(melnraksts)</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">{contract.residentName || '—'}</p>
                          {contract.clientName && contract.clientName !== contract.residentName && (
                            <p className="text-xs text-gray-500">Apgādnieks: {contract.clientName}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {RESIDENCE_LABELS[contract.residence] || contract.residence || '—'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div>
                          <p>{formatDate(contract.startDate)}</p>
                          {contract.noEndDate ? (
                            <p className="text-xs text-gray-400">bez termiņa</p>
                          ) : (
                            <p className="text-xs text-gray-400">līdz {formatDate(contract.endDate)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {contract.dailyRateWithDiscount ? (
                          <div>
                            <p className="font-medium text-gray-900">
                              {contract.dailyRateWithDiscount.toFixed(2)} EUR
                            </p>
                            {contract.discountPercent > 0 && (
                              <p className="text-xs text-green-600">-{contract.discountPercent}%</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <StatusBadge status={contract.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick actions */}
                          <button
                            onClick={() => onViewContract?.(contract)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="Skatīt"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {contract.status === CONTRACT_STATUS.DRAFT && (
                            <button
                              onClick={() => onEditContract?.(contract)}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
                              title="Rediģēt"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          {contract.status === CONTRACT_STATUS.ACTIVE && (
                            <button
                              onClick={() => onPrintContract?.(contract)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Drukāt"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}

                          {/* More actions menu */}
                          <div className="relative">
                            <button
                              onClick={() => toggleMenu(contract.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {openMenuId === contract.id && (
                              <>
                                {/* Backdrop */}
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenMenuId(null)}
                                />

                                {/* Menu */}
                                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                                  {contract.status === CONTRACT_STATUS.ACTIVE && (
                                    <button
                                      onClick={() => handleTerminate(contract)}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                      <FileX className="w-4 h-4 text-blue-500" />
                                      Izbeigt līgumu
                                    </button>
                                  )}

                                  {(contract.status === CONTRACT_STATUS.DRAFT || contract.status === CONTRACT_STATUS.ACTIVE) && (
                                    <button
                                      onClick={() => handleCancel(contract)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Anulēt līgumu
                                    </button>
                                  )}

                                  {contract.status === CONTRACT_STATUS.DRAFT && (
                                    <button
                                      onClick={() => handleDelete(contract)}
                                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Dzēst melnrakstu
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(CONTRACT_STATUS_LABELS).map(([status, label]) => {
            const count = contracts.filter(c => c.status === status).length;
            return (
              <div key={status} className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Terminate Contract Modal */}
      {terminateModalContract && (
        <TerminateContractModal
          contract={terminateModalContract}
          onConfirm={handleConfirmTerminate}
          onClose={() => setTerminateModalContract(null)}
        />
      )}
    </PageShell>
  );
};

export default ContractListView;
