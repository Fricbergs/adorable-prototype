import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, TrendingUp } from 'lucide-react';
import PageShell from '../components/PageShell';
import { getAllResidents } from '../domain/residentHelpers';

/**
 * ResidentReportsView - Rezidentu atskaites (AD-79)
 * Shows tenure of stay and other resident statistics
 */
export default function ResidentReportsView({ onBack }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const residents = getAllResidents();
    const activeResidents = residents.filter(r => r.status === 'active' && r.admissionDate);

    if (activeResidents.length === 0) {
      setStats({
        count: 0,
        avgDays: 0,
        minDays: 0,
        maxDays: 0,
        avgWeeks: 0,
        avgMonths: 0,
        distribution: []
      });
      return;
    }

    const today = new Date();
    const tenures = activeResidents.map(r => {
      const admission = new Date(r.admissionDate);
      const days = Math.floor((today - admission) / (1000 * 60 * 60 * 24));
      return {
        resident: r,
        days,
        weeks: Math.floor(days / 7),
        months: Math.floor(days / 30)
      };
    });

    const totalDays = tenures.reduce((sum, t) => sum + t.days, 0);
    const avgDays = Math.round(totalDays / tenures.length);

    // Distribution buckets
    const distribution = [
      { label: '< 1 mēnesis', count: tenures.filter(t => t.days < 30).length },
      { label: '1-3 mēneši', count: tenures.filter(t => t.days >= 30 && t.days < 90).length },
      { label: '3-6 mēneši', count: tenures.filter(t => t.days >= 90 && t.days < 180).length },
      { label: '6-12 mēneši', count: tenures.filter(t => t.days >= 180 && t.days < 365).length },
      { label: '> 1 gads', count: tenures.filter(t => t.days >= 365).length },
    ];

    // Top 5 longest stays
    const topTenure = [...tenures].sort((a, b) => b.days - a.days).slice(0, 5);

    setStats({
      count: activeResidents.length,
      avgDays,
      minDays: Math.min(...tenures.map(t => t.days)),
      maxDays: Math.max(...tenures.map(t => t.days)),
      avgWeeks: Math.round(avgDays / 7),
      avgMonths: Math.round(avgDays / 30),
      distribution,
      topTenure
    });
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
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rezidentu atskaites</h1>
          <p className="text-sm text-gray-500">Uzturēšanās ilguma statistika</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Aktīvie rezidenti</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.count}</p>
        </div>
        <div className="bg-white rounded-lg border border-purple-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500">Vid. uzturēšanās</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.avgDays}</p>
          <p className="text-xs text-gray-500">dienas</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Min / Max</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {stats.minDays} / {stats.maxDays}
          </p>
          <p className="text-xs text-gray-500">dienas</p>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">Vid. mēnešos</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.avgMonths}</p>
          <p className="text-xs text-gray-500">mēneši</p>
        </div>
      </div>

      {/* Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Uzturēšanās ilguma sadalījums</h3>
          <div className="space-y-3">
            {stats.distribution.map((bucket, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">{bucket.label}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${stats.count > 0 ? (bucket.count / stats.count) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{bucket.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tenure */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Ilgākā uzturēšanās</h3>
          {stats.topTenure && stats.topTenure.length > 0 ? (
            <div className="space-y-3">
              {stats.topTenure.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.resident.firstName} {item.resident.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Ist. {item.resident.roomNumber || '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{item.days} dienas</p>
                    <p className="text-xs text-gray-500">
                      {item.months} mēn. {item.weeks % 4} ned.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nav datu</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
