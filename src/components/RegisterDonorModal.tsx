import React, { useState } from 'react';
import { BloodGroup, CITIES_TR } from '../types';
import { registerDonor } from '../services/bloodService';
import { X, HeartHandshake, Phone, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterDonorModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [bloodType, setBloodType] = useState<BloodGroup>('0+');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('');
  const [phone, setPhone] = useState('');
  const [canDonateApheresis, setCanDonateApheresis] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const bloodGroups: BloodGroup[] = ['0-', '0+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Lütfen adınızı soyadınızı girin');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Lütfen geçerli bir telefon numarası girin (Örn: 05xx xxx xx xx)');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await registerDonor({
        fullName: fullName.trim(),
        bloodType,
        city,
        district: district.trim(),
        phone: phone.trim(),
        canDonateApheresis,
        isAvailable: true,
        notes: notes.trim()
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError('Kayıt oluşturulurken hata meydana geldi: ' + (err.message || ''));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Gönüllü Bağışçı Ol</h2>
              <p className="text-xs text-emerald-100">İhtiyaç anında hayat kurtaran listeye katıl</p>
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
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/60 text-xs text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Bilgileriniz sadece acil kan arayan hasta yakınları veya hastane yetkililerinin size ulaşabilmesi amacıyla listelenir.
            </span>
          </div>

          {/* Ad Soyad */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Örn: Burak Kaya"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
              required
            />
          </div>

          {/* Kan Grubu Seçimi */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Kan Grubunuz <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((bg) => (
                <button
                  type="button"
                  key={bg}
                  onClick={() => setBloodType(bg)}
                  className={`py-2 text-sm font-extrabold rounded-xl border transition-all cursor-pointer ${
                    bloodType === bg
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-102'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Telefon */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              İletişim Numarası (Telefon) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                placeholder="05xx xxx xx xx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-semibold text-emerald-800"
                required
              />
            </div>
          </div>

          {/* İl & İlçe */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Bulunduğunuz Şehir</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
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
                placeholder="Örn: Şişli, Nilüfer"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Aferez Onayı */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={canDonateApheresis}
                onChange={(e) => setCanDonateApheresis(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
              />
              <span className="text-xs font-semibold text-slate-700">
                Trombosit (Aferez) bağışı yapabilirim
              </span>
            </label>
            <p className="text-[11px] text-slate-500 mt-1 pl-6">
              Aferez cihazı ile sadece trombosit veya plazma ayrıştırılır, lösemi ve kemoterapi hastaları için hayati öneme sahiptir.
            </p>
          </div>

          {/* Not */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Bağışçı Notu (İsteğe bağlı)
            </label>
            <textarea
              rows={2}
              placeholder="Örn: Hafta içi saat 18:00 sonrası veya hafta sonu her an hastaneye gelebilirim."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {isSubmitting ? 'Kaydediliyor...' : 'Gönüllü Bağışçı Olarak Kaydol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
