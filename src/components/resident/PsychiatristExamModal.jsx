import React, { useState } from 'react';
import { X, Brain } from 'lucide-react';
import { addPsychiatristAssessment } from '../../domain/residentDataHelpers';

/**
 * PsychiatristExamModal - Psychiatrist examination form
 * Based on AD-18 spec: mental status examination with ~20 fields
 */
const PsychiatristExamModal = ({ resident, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    // Appearance & Behavior
    appearance: '',
    psychomotorActivity: '',
    eyeContact: '',
    cooperation: '',

    // Speech & Language
    speechRate: '',
    speechVolume: '',
    speechCoherence: '',

    // Mood & Affect
    mood: '',
    affect: '',
    affectRange: '',

    // Thought Process & Content
    thoughtProcess: '',
    thoughtContent: '',
    suicidalIdeation: 'nav',
    homicidalIdeation: 'nav',
    hallucinations: 'nav',
    delusions: 'nav',

    // Cognition
    orientation: '',
    attention: '',
    memory: '',
    insight: '',
    judgment: '',

    // Summary
    diagnosis: '',
    mentalStatus: '',
    recommendations: '',
    medicationChanges: '',
    followUpDate: '',

    // Meta
    assessedBy: 'Psihiatrs',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('appearance');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      addPsychiatristAssessment(resident.id, {
        ...formData,
        assessedAt: new Date().toISOString()
      });
      onSave();
    } catch (error) {
      console.error('Error saving psychiatrist assessment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Sections configuration
  const sections = [
    { id: 'appearance', label: 'Izskats' },
    { id: 'speech', label: 'Runa' },
    { id: 'mood', label: 'Garastāvoklis' },
    { id: 'thought', label: 'Domāšana' },
    { id: 'cognition', label: 'Izziņas funkcijas' },
    { id: 'summary', label: 'Kopsavilkums' }
  ];

  // Dropdown options
  const yesNoOptions = [
    { value: 'nav', label: 'Nav' },
    { value: 'ir', label: 'Ir' },
    { value: 'iespējams', label: 'Iespējams' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ārējais izskats</label>
              <select
                value={formData.appearance}
                onChange={(e) => handleChange('appearance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Kārtīgs">Kārtīgs, rūpīgi ģērbts</option>
                <option value="Vidējs">Vidēji kārtīgs</option>
                <option value="Nekārtīgs">Nekārtīgs, nesakopts</option>
                <option value="Uzmanību piesaistošs">Uzmanību piesaistošs apģērbs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Psihomotorā aktivitāte</label>
              <select
                value={formData.psychomotorActivity}
                onChange={(e) => handleChange('psychomotorActivity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Normāla">Normāla</option>
                <option value="Paaugstināta">Paaugstināta / uzbudināts</option>
                <option value="Retardēta">Retardēta / palēnināta</option>
                <option value="Agitēta">Agitēta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acu kontakts</label>
              <select
                value={formData.eyeContact}
                onChange={(e) => handleChange('eyeContact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Labs">Labs / adekvāts</option>
                <option value="Izvairīgs">Izvairīgs</option>
                <option value="Intensīvs">Intensīvs / nemirkšķinošs</option>
                <option value="Nav">Nav</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sadarbība</label>
              <select
                value={formData.cooperation}
                onChange={(e) => handleChange('cooperation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Pilnīga">Pilnīgi sadarbojas</option>
                <option value="Daļēja">Daļēji sadarbojas</option>
                <option value="Pasīva">Pasīvs</option>
                <option value="Nesadarbojas">Nesadarbojas</option>
                <option value="Naidīgs">Naidīgs / pretestība</option>
              </select>
            </div>
          </div>
        );

      case 'speech':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Runas temps</label>
              <select
                value={formData.speechRate}
                onChange={(e) => handleChange('speechRate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Normāls">Normāls</option>
                <option value="Ātrs">Paātrināts</option>
                <option value="Lēns">Palēnināts</option>
                <option value="Spiedīgs">Spiedīgs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Runas skaļums</label>
              <select
                value={formData.speechVolume}
                onChange={(e) => handleChange('speechVolume', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Normāls">Normāls</option>
                <option value="Skaļš">Skaļš</option>
                <option value="Kluss">Kluss / čukstošs</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Runas sakarība</label>
              <select
                value={formData.speechCoherence}
                onChange={(e) => handleChange('speechCoherence', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Sakarīga">Sakarīga</option>
                <option value="Tangenciāla">Tangenciāla</option>
                <option value="Nesaistīta">Nesaistīta</option>
                <option value="Blokēta">Blokēta</option>
              </select>
            </div>
          </div>
        );

      case 'mood':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Garastāvoklis (pacienta aprakstīts)</label>
              <select
                value={formData.mood}
                onChange={(e) => handleChange('mood', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Labs">Labs</option>
                <option value="Neitrāls">Neitrāls</option>
                <option value="Nomākts">Nomākts / skumjš</option>
                <option value="Satraukts">Satraukts / nemierīgs</option>
                <option value="Dusmīgs">Dusmīgs / aizkaitināts</option>
                <option value="Eiforisks">Eiforisks</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Afekts (novērotāja vērtējums)</label>
              <select
                value={formData.affect}
                onChange={(e) => handleChange('affect', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Adekvāts">Adekvāts / atbilstošs</option>
                <option value="Plakans">Plakans / novājināts</option>
                <option value="Labils">Labils</option>
                <option value="Neadekvāts">Neadekvāts saturam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Afekta diapazons</label>
              <select
                value={formData.affectRange}
                onChange={(e) => handleChange('affectRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Pilns">Pilns</option>
                <option value="Ierobežots">Ierobežots</option>
                <option value="Plakans">Plakans</option>
              </select>
            </div>
          </div>
        );

      case 'thought':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domāšanas process</label>
              <select
                value={formData.thoughtProcess}
                onChange={(e) => handleChange('thoughtProcess', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Loģisks">Loģisks / mērķtiecīgs</option>
                <option value="Tangenciāls">Tangenciāls</option>
                <option value="Apkārtējs">Apkārtējs</option>
                <option value="Asociatīvi brīvs">Asociatīvi brīvs</option>
                <option value="Ideju bēgšana">Ideju bēgšana</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domāšanas saturs</label>
              <textarea
                value={formData.thoughtContent}
                onChange={(e) => handleChange('thoughtContent', e.target.value)}
                rows={2}
                placeholder="Aprakstiet domāšanas saturu..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Suicidālas domas</label>
                <select
                  value={formData.suicidalIdeation}
                  onChange={(e) => handleChange('suicidalIdeation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {yesNoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Homicidālas domas</label>
                <select
                  value={formData.homicidalIdeation}
                  onChange={(e) => handleChange('homicidalIdeation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {yesNoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Halucinācijas</label>
                <select
                  value={formData.hallucinations}
                  onChange={(e) => handleChange('hallucinations', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {yesNoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maldi</label>
                <select
                  value={formData.delusions}
                  onChange={(e) => handleChange('delusions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  {yesNoOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        );

      case 'cognition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orientācija</label>
              <select
                value={formData.orientation}
                onChange={(e) => handleChange('orientation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Pilnīga">Pilnīgi orientēts (x4)</option>
                <option value="Daļēja">Daļēji dezorientēts</option>
                <option value="Laikā">Tikai personā orientēts</option>
                <option value="Nav">Pilnīgi dezorientēts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uzmanība/Koncentrēšanās</label>
              <select
                value={formData.attention}
                onChange={(e) => handleChange('attention', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Laba">Laba</option>
                <option value="Nedaudz traucēta">Nedaudz traucēta</option>
                <option value="Būtiski traucēta">Būtiski traucēta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Atmiņa</label>
              <select
                value={formData.memory}
                onChange={(e) => handleChange('memory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Saglabāta">Saglabāta</option>
                <option value="Īstermiņa traucējumi">Īstermiņa traucējumi</option>
                <option value="Ilgtermiņa traucējumi">Ilgtermiņa traucējumi</option>
                <option value="Abi traucēti">Abi veidi traucēti</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kritika (insight)</label>
              <select
                value={formData.insight}
                onChange={(e) => handleChange('insight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Laba">Laba / pilnīga</option>
                <option value="Daļēja">Daļēja</option>
                <option value="Vāja">Vāja / trūkst</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spriedums</label>
              <select
                value={formData.judgment}
                onChange={(e) => handleChange('judgment', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Labs">Labs</option>
                <option value="Adekvāts">Adekvāts</option>
                <option value="Traucēts">Traucēts</option>
              </select>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Garīgais stāvoklis (kopsavilkums)</label>
              <textarea
                value={formData.mentalStatus}
                onChange={(e) => handleChange('mentalStatus', e.target.value)}
                rows={3}
                placeholder="Apkopojiet garīgo stāvokli..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnoze</label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                rows={2}
                placeholder="Psihiatriskā diagnoze..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medikamentu izmaiņas</label>
              <textarea
                value={formData.medicationChanges}
                onChange={(e) => handleChange('medicationChanges', e.target.value)}
                rows={2}
                placeholder="Izmaiņas medikamentos..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rekomendācijas</label>
              <textarea
                value={formData.recommendations}
                onChange={(e) => handleChange('recommendations', e.target.value)}
                rows={2}
                placeholder="Ārstēšanas rekomendācijas..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nākamā apskate</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => handleChange('followUpDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Papildus piezīmes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Psihiatra apskate</h2>
              <p className="text-sm text-gray-500">{resident.firstName} {resident.lastName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex px-4">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </form>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Atcelt
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saglabā...' : 'Saglabāt apskati'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PsychiatristExamModal;
