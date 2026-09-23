import React from 'react';
import { BloodRequest, BLOOD_COMPATIBILITY, BloodGroup } from '../types';
import { MapPin, Building, Phone, Clock, AlertCircle, ChevronRight, Users } from 'lucide-react';

interface Props {
  request: BloodRequest;
  onSelect: () => void;
  filterBloodType?: BloodGroup | 'ALL';
}

export const BloodRequestCard: React.FC<Props> = ({ request, onSelect, filterBloodType }) => {
  const isCritical = request.urgency === 'CRITICAL';
  const isUrgent = request.urgency === 'URGENT';
  const isFulfilled = request.status === 'FULFILLED';

  const formatTimeAgo = (timestamp: number) => {
    const diffMin = Math.floor((Date.now() - timestamp) / 60000);
    if (diffMin < 1) return 'Az önce';
    if (diffMin < 60) return `${diffMin} dk önce`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} saat önce`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} gün önce`;
  };

  // Check if selected blood filter matches or is compatible
  const isCompatible = filterBloodType && filterBloodType !== 'ALL'
    ? (BLOOD_COMPATIBILITY[request.bloodType] || []).includes(filterBloodType)
    : false;

  return (
    <div 
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-4 shadow-sm hover:shadow-md cursor-pointer ${
        isFulfilled 
          ? 'opacity-65 border-slate-200 bg-slate-50/50' 
          : isCritical 
          ? 'border-red-200 hover:border-red-400 ring-1 ring-red-500/10' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Banner if Critical */}
      {isCritical && !isFulfilled && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 rounded-t-2xl" />
      )}

      <div className="flex items-start justify-between gap-3">
        {/* Left: Blood Group Badge */}
        <div className="flex items-start gap-3">
          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 transition-transform group-hover:scale-105 ${
            isFulfilled
              ? 'bg-slate-200 text-slate-600'
              : isCritical
              ? 'bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-500/20'
              : isUrgent
              ? 'bg-gradient-to-br from-red-500 to-amber-600 text-white shadow-sm'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span className="text-xl leading-none font-black">{request.bloodType}</span>
            <span className="text-[9px] font-semibold tracking-wider opacity-90 mt-0.5">KAN</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                isFulfilled
                  ? 'bg-emerald-100 text-emerald-800'
                  : isCritical
                  ? 'bg-red-100 text-red-700 animate-pulse'
                  : isUrgent
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isFulfilled ? '✓ Tamamlandı' : isCritical ? '🚨 Çok Acil' : isUrgent ? '⚠️ 24 Saat İçinde' : '📅 Planlı'}
              </span>

              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {request.componentType || 'Tam Kan'}
              </span>

              {isCompatible && (
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md">
                  Grubunuz Uyumlu ✨
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 text-base mt-1 group-hover:text-red-600 transition-colors line-clamp-1">
              {request.patientName}
            </h3>

            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{formatTimeAgo(request.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Right: Units needed indicator */}
        <div className="text-right shrink-0">
          <div className="text-xs font-semibold text-slate-500">İhtiyaç</div>
          <div className="text-lg font-black text-red-600">
            {request.unitsNeeded} <span className="text-xs font-normal text-slate-500">Ünite</span>
          </div>
          {request.unitsFulfilled ? (
            <div className="text-[10px] text-emerald-600 font-bold">
              {request.unitsFulfilled}/{request.unitsNeeded} sağlandı
            </div>
          ) : null}
        </div>
      </div>

      {/* Hospital and Location Info */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium text-slate-800">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{request.hospital}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="font-medium text-slate-700">{request.district ? `${request.district}, ` : ''}{request.city}</span>
          </div>

          <div className="flex items-center gap-1 text-red-600 font-semibold group-hover:translate-x-0.5 transition-transform">
            <span>İletişime Geç</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
