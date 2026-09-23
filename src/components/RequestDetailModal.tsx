import React, { useState, useEffect } from 'react';
import { BloodRequest, DonationPledge, BLOOD_COMPATIBILITY, BloodGroup } from '../types';
import { 
  X, 
  Phone, 
  MapPin, 
  Building, 
  Share2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  ShieldAlert, 
  MessageSquare,
  Users,
  Heart,
  Droplet
} from 'lucide-react';
import { addDonationPledge, subscribePledges, incrementFulfilledUnits, updateRequestStatus } from '../services/bloodService';
import confetti from 'canvas-confetti';

interface Props {
  request: BloodRequest;
  onClose: () => void;
  onStatusChange?: () => void;
}

export const RequestDetailModal: React.FC<Props> = ({ request, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [pledges, setPledges] = useState<DonationPledge[]>([]);
  const [showPledgeForm, setShowPledgeForm] = useState(false);
  
  // Pledge form state
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorBloodType, setDonorBloodType] = useState<BloodGroup>(request.bloodType);
  const [pledgeMessage, setPledgeMessage] = useState('');
  const [submittingPledge, setSubmittingPledge] = useState(false);
  const [pledgeSuccess, setPledgeSuccess] = useState(false);

  useEffect(() => {
    if (!request.id) return;
    const unsub = subscribePledges(request.id, (data) => {
      setPledges(data);
    });
    return () => unsub();
  }, [request.id]);

  const compatibleDonors = BLOOD_COMPATIBILITY[request.bloodType] || [request.bloodType];

  const handleShare = () => {
    const text = `🚨 ACİL KAN İHTİYACI!
Hasta: ${request.patientName}
Kan Grubu: ${request.bloodType} (${request.componentType || 'Tam Kan'})
Miktar: ${request.unitsNeeded} Ünite
Hastane: ${request.hospital}, ${request.district ? request.district + ' / ' : ''}${request.city}
İletişim: ${request.contactPerson} - ${request.phone}
${request.notes ? 'Not: ' + request.notes : ''}
Lütfen paylaşarak destek olun!`;

    if (navigator.share) {
      navigator.share({
        title: `Acil Kan İlanı - ${request.bloodType}`,
        text: text,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.id || !donorName.trim() || !donorPhone.trim()) return;

    try {
      setSubmittingPledge(true);
      await addDonationPledge({
        requestId: request.id,
        donorName: donorName.trim(),
        donorPhone: donorPhone.trim(),
        donorBloodType,
        message: pledgeMessage.trim()
      });
      setPledgeSuccess(true);
      confetti({ particleCount: 50, spread: 60 });
      setShowPledgeForm(false);
      setDonorName('');
      setDonorPhone('');
      setPledgeMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPledge(false);
    }
  };

  const handleAddFulfilledUnit = async () => {
    if (!request.id) return;
    await incrementFulfilledUnits(request.id, request.unitsFulfilled || 0, request.unitsNeeded);
  };

  const handleMarkFulfilled = async () => {
    if (!request.id) return;
    await updateRequestStatus(request.id, 'FULFILLED');
    confetti({ particleCount: 100, spread: 80 });
  };

  const cleanPhone = (p: string) => p.replace(/[^0-9+]/g, '');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header Banner */}
        <div className={`px-5 py-4 text-white flex items-center justify-between ${
          request.urgency === 'CRITICAL' 
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700' 
            : request.urgency === 'URGENT' 
            ? 'bg-gradient-to-r from-amber-600 to-orange-600'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white text-red-600 rounded-2xl flex flex-col items-center justify-center font-black shadow-md shrink-0">
              <span className="text-base leading-none">{request.bloodType}</span>
              <span className="text-[10px] text-slate-500 font-medium">GRUP</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wide bg-white/25 px-2 py-0.5 rounded-full">
                  {request.urgency === 'CRITICAL' ? '🚨 Hayati Acil' : request.urgency === 'URGENT' ? '⚠️ 24 Saat İçinde' : '📅 Planlı İhtiyaç'}
                </span>
                {request.status === 'FULFILLED' && (
                  <span className="text-[11px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Tamamlandı
                  </span>
                )}
              </div>
              <h2 className="font-bold text-lg mt-0.5 leading-snug">{request.patientName}</h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 text-sm">
          
          {/* Main Key Info Box */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 block">Kan Bileşeni</span>
              <span className="font-bold text-slate-800 text-sm">{request.componentType || 'Tam Kan'}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 block">İhtiyaç / Sağlanan</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-red-600 text-base">{request.unitsNeeded} Ünite</span>
                {request.unitsFulfilled ? (
                  <span className="text-xs text-emerald-600 font-semibold">({request.unitsFulfilled} bulundu)</span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-start gap-2.5">
              <Building className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Hastane & Kan Merkezi</span>
                <span className="font-bold text-slate-900 text-sm">{request.hospital}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1 border-t border-slate-200/60">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span className="text-xs text-slate-600 font-medium">
                {request.district ? `${request.district}, ` : ''}{request.city}
              </span>
            </div>
          </div>

          {/* Compatible Blood Types Info */}
          <div className="bg-rose-50/60 border border-rose-100 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 mb-1.5">
              <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
              Bu Hastaya Kan Verebilecek Uyumlu Gruplar:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {compatibleDonors.map((bg) => (
                <span 
                  key={bg} 
                  className={`text-xs px-2.5 py-1 rounded-lg font-extrabold ${
                    bg === request.bloodType 
                      ? 'bg-red-600 text-white shadow-xs' 
                      : 'bg-white border border-rose-200 text-rose-800'
                  }`}
                >
                  {bg}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          {request.notes && (
            <div className="p-3 bg-amber-50/60 border border-amber-200/70 rounded-xl text-xs text-amber-900">
              <div className="font-bold mb-1 flex items-center gap-1 text-amber-800">
                <AlertTriangle className="w-3.5 h-3.5" /> Hasta Yakını Notu:
              </div>
              <p className="leading-relaxed whitespace-pre-wrap">{request.notes}</p>
            </div>
          )}

          {/* Direct Contact Call Buttons (Primary Purpose of Request) */}
          <div className="bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-2xl text-white shadow-lg space-y-3">
            <div>
              <span className="text-xs text-red-100 block">Doğrudan İrtibat Kişisi:</span>
              <h3 className="font-extrabold text-base">{request.contactPerson}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href={`tel:${cleanPhone(request.phone)}`}
                className="py-2.5 px-4 bg-white text-red-600 font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-red-50 active:scale-[0.98] transition-all"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>Hemen Ara</span>
                <span className="text-xs text-slate-500 font-medium">({request.phone})</span>
              </a>

              <a
                href={`https://wa.me/${cleanPhone(request.phone).replace('+', '')}?text=${encodeURIComponent(`Merhaba ${request.contactPerson}, KanBağı platformundaki ${request.patientName} için verdiğiniz ${request.bloodType} kan ilanı hakkında ulaşıyorum. Size kan vermek istiyorum.`)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp İle Yaz</span>
              </a>
            </div>

            {request.additionalPhone && (
              <div className="pt-1 text-center">
                <a
                  href={`tel:${cleanPhone(request.additionalPhone)}`}
                  className="text-xs text-white/90 underline hover:text-white"
                >
                  Yedek Numara: {request.additionalPhone}
                </a>
              </div>
            )}
          </div>

          {/* Action Row: Share and Pledge */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-3 border border-slate-200 rounded-xl font-semibold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              {copied ? 'Metin Kopyalandı! ✅' : 'İlanı Paylaş'}
            </button>

            <button
              onClick={() => setShowPledgeForm(!showPledgeForm)}
              className="flex-1 py-2.5 px-3 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              {showPledgeForm ? 'Formu Kapat' : 'Kan Verebilirim De'}
            </button>
          </div>

          {/* Quick Pledge Form */}
          {showPledgeForm && (
            <form onSubmit={handlePledgeSubmit} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-fadeIn">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-red-600" />
                "Ben Kan Verebilirim" Bildirimi Bırakın
              </h4>
              <p className="text-[11px] text-slate-500">
                Hasta yakınına kan verebileceğinizi bildirin, numaranız ilana bakan hasta yakınına listelenir.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Adınız Soyadınız *"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  required
                />
                <input
                  type="tel"
                  placeholder="Telefonunuz *"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={donorBloodType}
                  onChange={(e) => setDonorBloodType(e.target.value as BloodGroup)}
                  className="px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                >
                  {compatibleDonors.map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Kısa not (Örn: 1 saate geliyorum)"
                  value={pledgeMessage}
                  onChange={(e) => setPledgeMessage(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submittingPledge}
                className="w-full py-2 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700 cursor-pointer disabled:opacity-50"
              >
                {submittingPledge ? 'Gönderiliyor...' : 'Bildirimi Gönder'}
              </button>
            </form>
          )}

          {/* List of volunteers who pledged support */}
          {pledges.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Yardıma Gelen Bağışçılar ({pledges.length})</span>
                <span className="text-[10px] text-slate-500 font-normal">Bu ilana yanıt verenler</span>
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {pledges.map((p) => (
                  <div key={p.id} className="p-2.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span>{p.donorName}</span>
                        <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded font-extrabold">
                          {p.donorBloodType}
                        </span>
                      </div>
                      {p.message && <p className="text-[11px] text-slate-600 italic mt-0.5">"{p.message}"</p>}
                    </div>
                    <a
                      href={`tel:${cleanPhone(p.donorPhone)}`}
                      className="px-2.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 font-bold rounded-lg hover:bg-emerald-100 flex items-center gap-1 text-[11px]"
                    >
                      <Phone className="w-3 h-3 text-emerald-700" /> Ara
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hasta Yakını Yönetim Araçları (Bulundu / Ünite Arttır) */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500 block mb-2">İlan Sahibi misiniz?</span>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleAddFulfilledUnit}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs cursor-pointer"
              >
                +1 Ünite Temin Edildi
              </button>
              {request.status !== 'FULFILLED' && (
                <button
                  onClick={handleMarkFulfilled}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg text-xs cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Kan Bulundu (Kapat)
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
