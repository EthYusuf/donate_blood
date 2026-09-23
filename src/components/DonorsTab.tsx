import React, { useState } from 'react';
import { DonorProfile, BloodGroup, BLOOD_COMPATIBILITY, CITIES_TR } from '../types';
import { Phone, MapPin, HeartHandshake, ShieldCheck, Search, Filter } from 'lucide-react';

interface Props {
  donors: DonorProfile[];
  onOpenRegisterModal: () => void;
}

export const DonorsTab: React.FC<Props> = ({ donors, onOpenRegisterModal }) => {
  const [filterBlood, setFilterBlood] = useState<BloodGroup | 'ALL'>('ALL');
  const [filterCity, setFilterCity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const bloodGroups: BloodGroup[] = ['0-', '0+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  const filteredDonors = donors.filter((d) => {
    if (filterBlood !== 'ALL' && d.bloodType !== filterBlood) return false;
    if (filterCity !== 'ALL' && d.city !== filterCity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.fullName.toLowerCase().includes(q);
      const matchCity = d.city.toLowerCase().includes(q);
      const matchDist = d.district.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchDist) return false;
    }
    return true;
  });

  const cleanPhone = (p: string) => p.replace(/[^0-9+]/g, '');

  return (
    <div className="space-y-4">
      {/* Hero Banner to encourage becoming a donor */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 rounded-2xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              Hayat Kurtaranlar Ağı
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold">Gönüllü Kan Bağışçısı Olun</h2>
          <p className="text-xs text-emerald-100 max-w-md mt-1">
            Bulunduğunuz şehirde acil kan arayan hasta yakınları veya hastaneler sizinle irtibata geçebilsin.
          </p>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="relative z-10 px-4 py-2.5 bg-white text-emerald-800 font-extrabold rounded-xl shadow-md hover:bg-emerald-50 active:scale-95 transition-all text-xs flex items-center gap-2 cursor-pointer shrink-0"
        >
          <HeartHandshake className="w-4 h-4 text-emerald-600" />
          Bağışçı Olarak Kaydol
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Bağışçı adı, ilçe veya notlarda ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Blood Type Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setFilterBlood('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                filterBlood === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tümü
            </button>
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => setFilterBlood(bg)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                  filterBlood === bg
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>

          {/* City selector */}
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="ALL">Tüm Şehirler</option>
            {CITIES_TR.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Donors List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Toplam {filteredDonors.length} gönüllü bağışçı listeleniyor</span>
        </div>

        {filteredDonors.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-slate-200">
            <HeartHandshake className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Bu kriterde bağışçı bulunamadı</p>
            <p className="text-xs text-slate-500 mt-1">Filtreleri temizleyebilir veya ilk bağışçı siz olabilirsiniz.</p>
            <button
              onClick={onOpenRegisterModal}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 cursor-pointer"
            >
              Gönüllü Bağışçı Ol
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredDonors.map((donor) => (
              <div 
                key={donor.id || donor.phone}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex flex-col items-center justify-center font-black shrink-0">
                      <span className="text-base leading-none">{donor.bloodType}</span>
                      <span className="text-[8px] font-bold text-emerald-600 mt-0.5">GRUP</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm">{donor.fullName}</h3>
                        {donor.canDonateApheresis && (
                          <span className="text-[10px] font-semibold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-md">
                            Aferez / Trombosit
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{donor.district ? `${donor.district}, ` : ''}{donor.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {donor.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2.5 line-clamp-2">
                    "{donor.notes}"
                  </p>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Bağışa Hazır
                  </span>

                  <a
                    href={`tel:${cleanPhone(donor.phone)}`}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ara: {donor.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
