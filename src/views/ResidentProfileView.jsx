import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Activity, ClipboardList, Stethoscope, Brain,
  Syringe, Pill, HeartPulse, AlertTriangle, AlertCircle,
  Package, Wrench
} from 'lucide-react';
import PageShell from '../components/PageShell';
import ResidentHeader from '../components/resident/ResidentHeader';
import ProfileSection from '../components/resident/ProfileSection';
import VitalsSection from '../components/resident/VitalsSection';
import DiagnosesSection from '../components/resident/DiagnosesSection';
import { getResidentById } from '../domain/residentHelpers';
import {
  getResidentDiagnoses,
  getLatestVitals,
  getVitalsHistory,
  getResidentVaccinations,
  getDoctorAssessments,
  getNurseAssessments,
  getPsychiatristAssessments,
  getPhysiotherapistAssessments,
  getLatestMorseScore,
  getLatestBradenScore,
  getLatestBarthelIndex,
  getResidentTechnicalAids,
  getResidentDataSummary,
  getRiskLevelColor
} from '../domain/residentDataHelpers';
import { RISK_SCALES } from '../constants/residentConstants';

/**
 * ResidentProfileView - Full resident profile with all sections
 * Matches the "Rezidenta atvērums" design
 */
const ResidentProfileView = ({ residentId, onBack, onNavigateToPrescriptions, onNavigateToInventory }) => {
  const [resident, setResident] = useState(null);
  const [summary, setSummary] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [vitals, setVitals] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [doctorAssessments, setDoctorAssessments] = useState([]);
  const [nurseAssessments, setNurseAssessments] = useState([]);
  const [psychiatristAssessments, setPsychiatristAssessments] = useState([]);
  const [physioAssessments, setPhysioAssessments] = useState([]);
  const [morseScore, setMorseScore] = useState(null);
  const [bradenScore, setBradenScore] = useState(null);
  const [barthelIndex, setBarthelIndex] = useState(null);
  const [technicalAids, setTechnicalAids] = useState([]);

  // Load all data
  useEffect(() => {
    if (residentId) {
      const residentData = getResidentById(residentId);
      setResident(residentData);

      if (residentData) {
        setSummary(getResidentDataSummary(residentId));
        setDiagnoses(getResidentDiagnoses(residentId));
        setVitals(getLatestVitals(residentId));
        setVaccinations(getResidentVaccinations(residentId));
        setDoctorAssessments(getDoctorAssessments(residentId));
        setNurseAssessments(getNurseAssessments(residentId));
        setPsychiatristAssessments(getPsychiatristAssessments(residentId));
        setPhysioAssessments(getPhysiotherapistAssessments(residentId));
        setMorseScore(getLatestMorseScore(residentId));
        setBradenScore(getLatestBradenScore(residentId));
        setBarthelIndex(getLatestBarthelIndex(residentId));
        setTechnicalAids(getResidentTechnicalAids(residentId).filter(a => a.status === 'active'));
      }
    }
  }, [residentId]);

  if (!resident) {
    return (
      <PageShell>
        <div className="text-center py-12 text-gray-500">
          <p>Rezidents nav atrasts</p>
          <button
            onClick={onBack}
            className="mt-4 text-orange-600 hover:text-orange-700"
          >
            Atgriezties
          </button>
        </div>
      </PageShell>
    );
  }

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('lv-LV');
  };

  // Get risk badge
  const getRiskBadge = (score, scaleType) => {
    if (!score) return null;
    const scale = RISK_SCALES[scaleType];
    const level = scale?.levels.find(l => l.level === score.riskLevel);
    return level ? { label: level.label, color: level.color } : null;
  };

  return (
    <PageShell>
      <div className="space-y-4">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Atpakaļ uz sarakstu
        </button>

        {/* Resident Header */}
        <ResidentHeader
          resident={resident}
          onEdit={() => {/* TODO: Edit modal */}}
        />

        {/* Profile Sections */}
        <div className="space-y-3">
          {/* Diagnoses */}
          <ProfileSection
            title="Diagnozes"
            icon={ClipboardList}
            count={diagnoses.length}
            onAdd={() => {/* TODO: Add diagnosis modal */}}
            defaultOpen={diagnoses.length > 0}
          >
            <DiagnosesSection
              diagnoses={diagnoses}
              onEdit={(d) => {/* TODO: Edit diagnosis */}}
              onDelete={(id) => {/* TODO: Delete diagnosis */}}
            />
          </ProfileSection>

          {/* Vitals (Māsas apskate) */}
          <ProfileSection
            title="Māsas apskate"
            icon={Activity}
            lastUpdate={vitals ? formatDate(vitals.measuredAt) : null}
            onAdd={() => {/* TODO: Record vitals modal */}}
            onHistory={() => {/* TODO: Vitals history modal */}}
            defaultOpen={true}
          >
            <VitalsSection
              vitals={vitals}
              onRecordNew={() => {/* TODO: Record vitals */}}
            />
          </ProfileSection>

          {/* Doctor Assessment */}
          <ProfileSection
            title="Ārsta apskate"
            icon={Stethoscope}
            count={doctorAssessments.length}
            lastUpdate={doctorAssessments[0] ? formatDate(doctorAssessments[0].assessedAt) : null}
            onAdd={() => {/* TODO */}}
            onHistory={() => {/* TODO */}}
          >
            {doctorAssessments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nav apskašu ierakstu</p>
            ) : (
              <div className="space-y-2">
                {doctorAssessments.slice(0, 3).map(a => (
                  <div key={a.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex justify-between text-gray-500 text-xs mb-1">
                      <span>{formatDate(a.assessedAt)}</span>
                      <span>{a.assessedBy}</span>
                    </div>
                    <p className="text-gray-700">{a.findings || a.notes || 'Nav piezīmju'}</p>
                  </div>
                ))}
              </div>
            )}
          </ProfileSection>

          {/* Psychiatrist Assessment */}
          <ProfileSection
            title="Psihiatra apskate"
            icon={Brain}
            count={psychiatristAssessments.length}
            lastUpdate={psychiatristAssessments[0] ? formatDate(psychiatristAssessments[0].assessedAt) : null}
            onAdd={() => {/* TODO */}}
            onHistory={() => {/* TODO */}}
          >
            {psychiatristAssessments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nav apskašu ierakstu</p>
            ) : (
              <div className="space-y-2">
                {psychiatristAssessments.slice(0, 3).map(a => (
                  <div key={a.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex justify-between text-gray-500 text-xs mb-1">
                      <span>{formatDate(a.assessedAt)}</span>
                      <span>{a.assessedBy}</span>
                    </div>
                    <p className="text-gray-700">{a.findings || a.notes || 'Nav piezīmju'}</p>
                  </div>
                ))}
              </div>
            )}
          </ProfileSection>

          {/* Vaccinations */}
          <ProfileSection
            title="Vakcinācija"
            icon={Syringe}
            count={vaccinations.length}
            lastUpdate={vaccinations[0] ? formatDate(vaccinations[0].administeredDate) : null}
            onAdd={() => {/* TODO */}}
          >
            {vaccinations.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nav vakcinācijas ierakstu</p>
            ) : (
              <div className="space-y-2">
                {vaccinations.map(v => (
                  <div key={v.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{v.vaccineName}</p>
                      <p className="text-sm text-gray-500">
                        Sērija: {v.series || '—'} • Datums: {formatDate(v.administeredDate)}
                      </p>
                    </div>
                    {v.expirationDate && (
                      <span className="text-xs text-gray-400">
                        Derīgs līdz: {formatDate(v.expirationDate)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ProfileSection>

          {/* Prescriptions Link */}
          <ProfileSection
            title="Ordinācijas plāns"
            icon={Pill}
            defaultOpen={false}
          >
            <div className="text-center py-4">
              <p className="text-gray-500 mb-3">Skatīt rezidenta medikamentu plānu</p>
              <button
                onClick={() => onNavigateToPrescriptions?.(resident)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Atvērt ordinācijas plānu
              </button>
            </div>
          </ProfileSection>

          {/* Physiotherapy Assessment */}
          <ProfileSection
            title="Fizioterapeita apskate"
            icon={HeartPulse}
            count={physioAssessments.length}
            lastUpdate={physioAssessments[0] ? formatDate(physioAssessments[0].assessedAt) : null}
            onAdd={() => {/* TODO */}}
            onHistory={() => {/* TODO */}}
          >
            {physioAssessments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nav apskašu ierakstu</p>
            ) : (
              <div className="space-y-2">
                {physioAssessments.slice(0, 3).map(a => (
                  <div key={a.id} className="p-3 bg-gray-50 rounded-lg text-sm">
                    <div className="flex justify-between text-gray-500 text-xs mb-1">
                      <span>{formatDate(a.assessedAt)}</span>
                      <span>{a.assessedBy}</span>
                    </div>
                    <p className="text-gray-700">{a.findings || a.notes || 'Nav piezīmju'}</p>
                  </div>
                ))}
              </div>
            )}
          </ProfileSection>

          {/* Morse Fall Risk */}
          <ProfileSection
            title="Kritienu riska novērtējums pēc Morsa skalas"
            icon={AlertTriangle}
            badge={morseScore ? getRiskBadge(morseScore, 'morse')?.label : null}
            badgeColor={morseScore ? getRiskBadge(morseScore, 'morse')?.color : 'gray'}
            lastUpdate={morseScore ? formatDate(morseScore.assessedAt) : null}
            onAdd={() => {/* TODO */}}
            onHistory={() => {/* TODO */}}
          >
            {!morseScore ? (
              <p className="text-center text-gray-500 py-4">Nav novērtējuma</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kopējais punktu skaits</span>
                  <span className="text-2xl font-bold text-gray-900">{morseScore.score}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Novērtēja: {morseScore.assessedBy} • {formatDate(morseScore.assessedAt)}
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Braden Pressure Ulcer Risk */}
          <ProfileSection
            title="Izgulējumu riska noteikšana pēc Bradena skalas"
            icon={AlertCircle}
            badge={bradenScore ? getRiskBadge(bradenScore, 'braden')?.label : null}
            badgeColor={bradenScore ? getRiskBadge(bradenScore, 'braden')?.color : 'gray'}
            lastUpdate={bradenScore ? formatDate(bradenScore.assessedAt) : null}
            onAdd={() => {/* TODO */}}
            onHistory={() => {/* TODO */}}
          >
            {!bradenScore ? (
              <p className="text-center text-gray-500 py-4">Nav novērtējuma</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kopējais punktu skaits</span>
                  <span className="text-2xl font-bold text-gray-900">{bradenScore.score}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Novērtēja: {bradenScore.assessedBy} • {formatDate(bradenScore.assessedAt)}
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Barthel ADL Index */}
          <ProfileSection
            title="Personu pašaprūpes un mobilitātes spēju novērtējums pēc Bartela indeksa"
            icon={Activity}
            badge={barthelIndex ? getRiskBadge(barthelIndex, 'barthel')?.label : null}
            badgeColor={barthelIndex ? getRiskBadge(barthelIndex, 'barthel')?.color : 'gray'}
            lastUpdate={barthelIndex ? formatDate(barthelIndex.assessedAt) : null}
            onAdd={() => {/* TODO */}}
            onHistory={() => {/* TODO */}}
          >
            {!barthelIndex ? (
              <p className="text-center text-gray-500 py-4">Nav novērtējuma</p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Kopējais punktu skaits</span>
                  <span className="text-2xl font-bold text-gray-900">{barthelIndex.score}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Novērtēja: {barthelIndex.assessedBy} • {formatDate(barthelIndex.assessedAt)}
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Technical Aids */}
          <ProfileSection
            title="Tehnisko palīglīdzekļu izmantošana"
            icon={Wrench}
            count={technicalAids.length}
            onAdd={() => {/* TODO */}}
          >
            {technicalAids.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nav piešķirtu palīglīdzekļu</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {technicalAids.map(aid => (
                  <span
                    key={aid.id}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {aid.description || aid.aidType}
                  </span>
                ))}
              </div>
            )}
          </ProfileSection>

          {/* Inventory Link */}
          <ProfileSection
            title="Rezidenta noliktava"
            icon={Package}
            defaultOpen={false}
          >
            <div className="text-center py-4">
              <p className="text-gray-500 mb-3">Skatīt rezidenta medikamentu krājumus</p>
              <button
                onClick={() => onNavigateToInventory?.(resident)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Atvērt noliktavu
              </button>
            </div>
          </ProfileSection>
        </div>
      </div>
    </PageShell>
  );
};

export default ResidentProfileView;
