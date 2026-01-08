import React, { useState } from 'react';
import { X, Stethoscope } from 'lucide-react';
import { addDoctorAssessment } from '../../domain/residentDataHelpers';

/**
 * DoctorExamModal - Doctor examination form
 * Based on AD-16 spec: comprehensive examination with ~30 fields
 */
const DoctorExamModal = ({ resident, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    // General
    generalCondition: '',
    consciousness: '',
    orientation: '',
    cooperation: '',

    // Skin
    skinCondition: '',
    skinTurgor: '',
    edema: '',
    edemaLocation: '',

    // Cardiovascular
    heartSounds: '',
    heartRhythm: '',
    bloodPressure: '',
    pulse: '',

    // Respiratory
    breathingSounds: '',
    breathingType: '',
    oxygenSaturation: '',

    // Abdomen
    abdomenPalpation: '',
    bowelSounds: '',
    liverPalpation: '',

    // Neurological
    neurologicalStatus: '',
    muscleStrength: '',
    reflexes: '',
    coordination: '',

    // Musculoskeletal
    jointMobility: '',
    muscleTone: '',
    gait: '',

    // Other
    findings: '',
    diagnosis: '',
    recommendations: '',
    followUpDate: '',

    // Meta
    assessedBy: 'Dakteris Gints',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    try {
      addDoctorAssessment(resident.id, {
        ...formData,
        assessedAt: new Date().toISOString()
      });
      onSave();
    } catch (error) {
      console.error('Error saving doctor assessment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Sections configuration
  const sections = [
    { id: 'general', label: 'Vispārējais' },
    { id: 'skin', label: 'Āda' },
    { id: 'cardiovascular', label: 'Sirds-asinsvadi' },
    { id: 'respiratory', label: 'Elpošana' },
    { id: 'abdomen', label: 'Vēders' },
    { id: 'neuro', label: 'Neiroloģija' },
    { id: 'musculo', label: 'Balsta-kustību' },
    { id: 'summary', label: 'Kopsavilkums' }
  ];

  // Dropdown options
  const conditionOptions = ['Labs', 'Apmierinošs', 'Vidēji smags', 'Smags', 'Kritisks'];
  const consciousnessOptions = ['Skaidra', 'Apmiglota', 'Sopors', 'Koma'];
  const orientationOptions = ['Pilnīgi orientēts', 'Daļēji dezorientēts', 'Pilnīgi dezorientēts'];
  const cooperationOptions = ['Pilnīgi sadarbojas', 'Daļēji sadarbojas', 'Nesadarbojas'];
  const skinOptions = ['Normāla', 'Sausa', 'Mitra', 'Blāva', 'Ciānotiski', 'Iktēriska'];
  const normalAbnormalOptions = ['Norma', 'Patoloģija'];
  const rhythmOptions = ['Regulārs', 'Neregulārs', 'Aritmija'];
  const breathingOptions = ['Vezikulāra', 'Pavājināta', 'Sēkšana', 'Krepitācija'];
  const edemaOptions = ['Nav', 'Viegla', 'Mērena', 'Izteikta'];

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vispārējais stāvoklis</label>
              <select
                value={formData.generalCondition}
                onChange={(e) => handleChange('generalCondition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                {conditionOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apziņa</label>
              <select
                value={formData.consciousness}
                onChange={(e) => handleChange('consciousness', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                {consciousnessOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Orientācija</label>
              <select
                value={formData.orientation}
                onChange={(e) => handleChange('orientation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                {orientationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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
                {cooperationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        );

      case 'skin':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ādas stāvoklis</label>
              <select
                value={formData.skinCondition}
                onChange={(e) => handleChange('skinCondition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                {skinOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ādas turgors</label>
              <select
                value={formData.skinTurgor}
                onChange={(e) => handleChange('skinTurgor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                {normalAbnormalOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tūska</label>
              <select
                value={formData.edema}
                onChange={(e) => handleChange('edema', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                {edemaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {formData.edema && formData.edema !== 'Nav' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tūskas lokalizācija</label>
                <input
                  type="text"
                  value={formData.edemaLocation}
                  onChange={(e) => handleChange('edemaLocation', e.target.value)}
                  placeholder="piem., kājas, potītes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
          </div>
        );

      case 'cardiovascular':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sirds toņi</label>
              <select
                value={formData.heartSounds}
                onChange={(e) => handleChange('heartSounds', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Skaidri">Skaidri</option>
                <option value="Klusi">Klusi</option>
                <option value="Troksnis">Ar troksni</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sirds ritms</label>
              <select
                value={formData.heartRhythm}
                onChange={(e) => handleChange('heartRhythm', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                {rhythmOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AS (mmHg)</label>
                <input
                  type="text"
                  value={formData.bloodPressure}
                  onChange={(e) => handleChange('bloodPressure', e.target.value)}
                  placeholder="120/80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pulss</label>
                <input
                  type="text"
                  value={formData.pulse}
                  onChange={(e) => handleChange('pulse', e.target.value)}
                  placeholder="sitieni/min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        );

      case 'respiratory':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Elpošanas trokšņi</label>
              <select
                value={formData.breathingSounds}
                onChange={(e) => handleChange('breathingSounds', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                {breathingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Elpošanas tips</label>
              <select
                value={formData.breathingType}
                onChange={(e) => handleChange('breathingType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Normāla">Normāla</option>
                <option value="Paātrināta">Paātrināta</option>
                <option value="Palēnināta">Palēnināta</option>
                <option value="Apgrūtināta">Apgrūtināta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Saturācija (%)</label>
              <input
                type="text"
                value={formData.oxygenSaturation}
                onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
                placeholder="95-100%"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        );

      case 'abdomen':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vēdera palpācija</label>
              <select
                value={formData.abdomenPalpation}
                onChange={(e) => handleChange('abdomenPalpation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Mīksts, nesāpīgs">Mīksts, nesāpīgs</option>
                <option value="Sāpīgs">Sāpīgs</option>
                <option value="Saspringts">Saspringts</option>
                <option value="Uzpūsts">Uzpūsts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zarnu trokšņi</label>
              <select
                value={formData.bowelSounds}
                onChange={(e) => handleChange('bowelSounds', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Normāli">Normāli</option>
                <option value="Pavājināti">Pavājināti</option>
                <option value="Pastiprināti">Pastiprināti</option>
                <option value="Nav dzirdami">Nav dzirdami</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aknu palpācija</label>
              <select
                value={formData.liverPalpation}
                onChange={(e) => handleChange('liverPalpation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Nav palielinātas">Nav palielinātas</option>
                <option value="Palielinātas">Palielinātas</option>
                <option value="Nav palpējamas">Nav palpējamas</option>
              </select>
            </div>
          </div>
        );

      case 'neuro':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Neiroloģiskais statuss</label>
              <textarea
                value={formData.neurologicalStatus}
                onChange={(e) => handleChange('neurologicalStatus', e.target.value)}
                rows={2}
                placeholder="Aprakstiet neiroloģisko stāvokli..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Muskuļu spēks</label>
              <select
                value={formData.muscleStrength}
                onChange={(e) => handleChange('muscleStrength', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Saglabāts">Saglabāts</option>
                <option value="Nedaudz samazināts">Nedaudz samazināts</option>
                <option value="Būtiski samazināts">Būtiski samazināts</option>
                <option value="Ļoti vājš">Ļoti vājš</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Refleksi</label>
              <select
                value={formData.reflexes}
                onChange={(e) => handleChange('reflexes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Normāli">Normāli</option>
                <option value="Pavājināti">Pavājināti</option>
                <option value="Pastiprināti">Pastiprināti</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Koordinācija</label>
              <select
                value={formData.coordination}
                onChange={(e) => handleChange('coordination', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Saglabāta">Saglabāta</option>
                <option value="Traucēta">Traucēta</option>
              </select>
            </div>
          </div>
        );

      case 'musculo':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locītavu kustīgums</label>
              <select
                value={formData.jointMobility}
                onChange={(e) => handleChange('jointMobility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Pilns apjoms">Pilns apjoms</option>
                <option value="Ierobežots">Ierobežots</option>
                <option value="Sāpīgs">Sāpīgs</option>
                <option value="Kontraktūras">Kontraktūras</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Muskuļu tonuss</label>
              <select
                value={formData.muscleTone}
                onChange={(e) => handleChange('muscleTone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Normāls">Normāls</option>
                <option value="Paaugstināts">Paaugstināts</option>
                <option value="Pazemināts">Pazemināts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gaita</label>
              <select
                value={formData.gait}
                onChange={(e) => handleChange('gait', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Izvēlieties...</option>
                <option value="Normāla">Normāla</option>
                <option value="Nestabila">Nestabila</option>
                <option value="Ar palīglīdzekļiem">Ar palīglīdzekļiem</option>
                <option value="Nestaigā">Nestaigā</option>
              </select>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Galvenie atrādumi</label>
              <textarea
                value={formData.findings}
                onChange={(e) => handleChange('findings', e.target.value)}
                rows={3}
                placeholder="Apkopojiet galvenos novērojumus..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnoze/Slēdziens</label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                rows={2}
                placeholder="Diagnoze vai slēdziens..."
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
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ārsta apskate</h2>
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
                    ? 'border-orange-500 text-orange-600'
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
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saglabā...' : 'Saglabāt apskati'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorExamModal;
