import React, { useState } from 'react';
import { BloodGroup, BLOOD_COMPATIBILITY } from '../types';
import { Droplet, Info, Check, X, Shield, ArrowRight } from 'lucide-react';

export const BloodCompatibilityGuide: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('A+');
  const bloodGroups: BloodGroup[] = ['0-', '0+', 'B-', 'B+', 'A-', 'A+', 'AB-', 'AB+'];

  // Groups this selected group can RECEIVE from
  const canReceiveFrom = BLOOD_COMPATIBILITY[selectedGroup] || [];

  // Groups this selected group can GIVE to
  const canGiveTo = bloodGroups.filter(bg => (BLOOD_COMPATIBILITY[bg] || []).includes(selectedGroup));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-red-100 text-red-700 rounded-xl">
          <Droplet className="w-5 h-5 fill-red-600 text-red-600" />
        </div>
        <div>
          <h2 className="font-bold text-base text-slate-900">Kan Grubu Uyumluluk Rehberi</h2>
          <p className="text-xs text-slate-500">Kimin kime kan verebileceğini tek tıkla öğrenin</p>
        </div>
      </div>

      {/* Select Blood Group buttons */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          İncelemek İstediğiniz Kan Grubunu Seçin:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {bloodGroups.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedGroup(bg)}
              className={`py-2 px-1 text-sm font-extrabold rounded-xl border transition-all cursor-pointer ${
                selectedGroup === bg
                  ? 'bg-red-600 text-white border-red-600 shadow-md scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Can Receive From */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
              {selectedGroup} Kimlerden Kan Alabilir?
            </span>
            <span className="text-xs font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full">
              {canReceiveFrom.length} Grup
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {bloodGroups.map((bg) => {
              const compatible = canReceiveFrom.includes(bg);
              return (
                <div
                  key={bg}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    compatible
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white/60 text-slate-300 border-slate-200 line-through'
                  }`}
                >
                  <span>{bg}</span>
                  {compatible ? <Check className="w-3 h-3 text-white" /> : null}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-blue-700/90 pt-1">
            {selectedGroup === 'AB+' 
              ? '⭐️ AB Rh (+) Genel Alıcıdır, her kan grubundan tam kan veya eritrosit alabilir.'
              : selectedGroup === '0-'
              ? '⚠️ 0 Rh (-) sadece kendi grubu olan 0 Rh (-)\'den kan alabilir.'
              : `${selectedGroup} grubu hastalar yukarıda belirtilen gruplardan güvenle kan kabul edebilir.`}
          </p>
        </div>

        {/* Can Give To */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
              {selectedGroup} Kimlere Kan Verebilir?
            </span>
            <span className="text-xs font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
              {canGiveTo.length} Grup
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {bloodGroups.map((bg) => {
              const compatible = canGiveTo.includes(bg);
              return (
                <div
                  key={bg}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                    compatible
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white/60 text-slate-300 border-slate-200 line-through'
                  }`}
                >
                  <span>{bg}</span>
                  {compatible ? <Check className="w-3 h-3 text-white" /> : null}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-emerald-700/90 pt-1">
            {selectedGroup === '0-' 
              ? '⭐️ 0 Rh (-) Genel Vericidir, acil durumlarda herkese kan verebilir.'
              : selectedGroup === 'AB+'
              ? 'AB Rh (+) sadece AB Rh (+) grubuna kan verebilir.'
              : `${selectedGroup} bağışçısı yukarıdaki gruplardaki hastalara can olabilir.`}
          </p>
        </div>
      </div>

      {/* Blood Donation Conditions */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
        <span className="font-bold text-slate-800 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-red-600" /> Kan Bağışı Genel Şartları:
        </span>
        <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-slate-600">
          <li>18 - 65 yaş aralığında olmak ve en az 50 kg ağırlığında olmak.</li>
          <li>Son 24 saat içinde alkol almamış olmak, son 48 saat içinde aspirin/ağrı kesici kullanmamış olmak (aferez için).</li>
          <li>Erkekler 90 günde bir (yılda 4), kadınlar 120 günde bir (yılda 3) tam kan bağışlayabilir.</li>
        </ul>
      </div>
    </div>
  );
};
