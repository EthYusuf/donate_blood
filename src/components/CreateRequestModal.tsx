import React, { useState } from 'react';
import { BloodGroup, UrgencyLevel, CITIES_TR } from '../types';
import { createBloodRequest } from '../services/bloodService';
import { X, AlertCircle, Heart, Phone, MapPin, Building, Activity, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateRequestModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [patientName, setPatientName] = useState('');
  const [bloodType, setBloodType] = useState<BloodGroup>('A+');
  const [componentType, setComponentType] = useState<'Tam Kan' | 'Trombosit (Aferez)' | 'Eritrosit' | 'Plazma'>('Tam Kan');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(2);
  const [urgency, setUrgency] = useState<UrgencyLevel>('URGENT');
  const [hospital, setHospital] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [additionalPhone, setAdditionalPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const bloodGroups: BloodGroup[] = ['0-', '0+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Lütfen hasta adını belirtin');
      return;
    }
    if (!hospital.trim()) {
      setError('Lütfen hastane adını belirtin');
      return;
    }
    if (!contactPerson.trim()) {
      setError('Lütfen irtibat kişisini belirtin');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Lütfen geçerli bir telefon numarası girin (Örn: 05xx xxx xx xx)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await createBloodRequest({
        patientName: patientName.trim(),
        bloodType,
        componentType,
        unitsNeeded: Number(unitsNeeded) || 1,
        hospital: hospital.trim(),
        city,
        district: district.trim(),
        urgency,
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        additionalPhone: additionalPhone.trim(),
        notes: notes.trim()
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError('İlan kaydedilirken bir hata oluştu: ' + (err.message || 'Lütfen tekrar deneyin.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Acil Kan İlanı Oluştur</h2>
              <p className="text-xs text-red-100">Gönüllü bağışçılara anında ulaşın</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-slate-800 text-sm">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Aciliyet Durumu */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Aciliyet Seviyesi</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('CRITICAL')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  urgency === 'CRITICAL'
                    ? 'bg-red-600 text-white border-red-600 shadow-sm ring-2 ring-red-400/40'
                    : 'bg-red-50/60 text-red-700 border-red-200 hover:bg-red-100'
                }`}
              >
                🚨 ÇOK ACİL (Hayati)
              </button>
              <button
                type="button"
                onClick={() => setUrgency('URGENT')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  urgency === 'URGENT'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                ⚠️ 24 Saat İçinde
              </button>
              <button
                type="button"
                onClick={() => setUrgency('NORMAL')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  urgency === 'NORMAL'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-400/40'
                    : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                }`}
              >
                📅 Planlı Ameliyat
              </button>
            </div>
          </div>

          {/* Kan Grubu Seçimi */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              İhtiyaç Duyulan Kan Grubu <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodType(bg)}
                  className={`py-2 text-sm font-extrabold rounded-xl border transition-all cursor-pointer ${
                    bloodType === bg
                      ? 'bg-red-600 text-white border-red-600 shadow-md scale-102'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Bileşen & Ünite */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kan Bileşeni</label>
              <select
                value={componentType}
                onChange={(e) => setComponentType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs font-medium"
              >
                <option value="Tam Kan">Tam Kan</option>
                <option value="Trombosit (Aferez)">Trombosit (Aferez)</option>
                <option value="Eritrosit">Eritrosit Süspansiyonu</option>
                <option value="Plazma">Taze Donmuş Plazma</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kaç Ünite Gerekli?</label>
              <input
                type="number"
                min="1"
                max="20"
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs font-medium"
                required
              />
            </div>
          </div>

          {/* Hasta Adı */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Hasta Adı Soyadı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Örn: Mehmet Öz veya A. Y."
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
              required
            />
          </div>

          {/* İl & İlçe */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">İl (Şehir)</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
              >
                {CITIES_TR.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">İlçe</label>
              <input
                type="text"
                placeholder="Örn: Kadıköy, Çankaya"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Hastane */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Hastane / Sağlık Merkezi Adı <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Örn: Şehir Hastanesi, Kan Merkezi Kat: 1"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
                required
              />
            </div>
          </div>

          {/* İletişim Kişisi & Telefon */}
          <div className="bg-red-50/50 p-3 rounded-xl border border-red-100 space-y-3">
            <h4 className="text-xs font-bold text-red-900 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              İletişim Bilgileri (Bağışçılar bu numaradan arayacaktır)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  İrtibat Kişisi & Yakınlık <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Örn: Ahmet Kaya (Babası)"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Telefon Numarası <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="05xx xxx xx xx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs font-semibold text-red-700"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                İkinci / Yedek Telefon (İsteğe bağlı)
              </label>
              <input
                type="tel"
                placeholder="Örn: 0544 xxx xx xx"
                value={additionalPhone}
                onChange={(e) => setAdditionalPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Açıklama / Notlar */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Ek Açıklama & Hasta Durumu (İsteğe bağlı)
            </label>
            <textarea
              rows={2}
              placeholder="Örn: Ameliyat saati 14:00. Kan merkezinde hasta yakını Ahmet Bey karşılayacaktır. Son 48 saatte ilaç alınmamış olması rica olunur."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none text-xs resize-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'İlan Yayınlanıyor...' : 'Acil Kan İlanını Yayınla'}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2">
              İlanınız anında tüm bağışçılara gösterilir ve veritabanına işlenir.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
