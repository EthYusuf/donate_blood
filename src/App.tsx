import React, { useState, useEffect } from 'react';
import { BloodRequest, DonorProfile, BloodGroup, CITIES_TR, BLOOD_COMPATIBILITY } from './types';
import { 
  subscribeBloodRequests, 
  subscribeDonors 
} from './services/bloodService';
import { seedInitialDataIfEmpty } from './seedData';
import { BloodRequestCard } from './components/BloodRequestCard';
import { CreateRequestModal } from './components/CreateRequestModal';
import { RegisterDonorModal } from './components/RegisterDonorModal';
import { RequestDetailModal } from './components/RequestDetailModal';
import { DonorsTab } from './components/DonorsTab';
import { BloodCompatibilityGuide } from './components/BloodCompatibilityGuide';
import { 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Activity, 
  Phone, 
  AlertCircle, 
  Layers, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'REQUESTS' | 'DONORS' | 'COMPATIBILITY'>('REQUESTS');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  // Filters for requests
  const [filterBloodGroup, setFilterBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [filterCity, setFilterCity] = useState<string>('ALL');
  const [filterUrgency, setFilterUrgency] = useState<'ALL' | 'CRITICAL' | 'URGENT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const bloodGroups: BloodGroup[] = ['0-', '0+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  useEffect(() => {
    // Subscribe to realtime firestore updates
    const unsubRequests = subscribeBloodRequests((data) => {
      setRequests(data);
      setLoading(false);
      // If db is brand new and empty, seed helpful initial data
      if (data.length === 0) {
        seedInitialDataIfEmpty(0, 0);
      }
    });

    const unsubDonors = subscribeDonors((donorData) => {
      setDonors(donorData);
      if (donorData.length === 0) {
        seedInitialDataIfEmpty(requests.length, 0);
      }
    });

    return () => {
      unsubRequests();
      unsubDonors();
    };
  }, []);

  // Filter blood requests
  const filteredRequests = requests.filter((r) => {
    if (showOnlyActive && r.status === 'FULFILLED') return false;
    if (filterBloodGroup !== 'ALL' && r.bloodType !== filterBloodGroup) return false;
    if (filterCity !== 'ALL' && r.city !== filterCity) return false;
    if (filterUrgency !== 'ALL' && r.urgency !== filterUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPatient = r.patientName.toLowerCase().includes(q);
      const matchHospital = r.hospital.toLowerCase().includes(q);
      const matchCity = r.city.toLowerCase().includes(q);
      const matchDistrict = r.district?.toLowerCase().includes(q) || false;
      const matchNotes = r.notes?.toLowerCase().includes(q) || false;
      if (!matchPatient && !matchHospital && !matchCity && !matchDistrict && !matchNotes) {
        return false;
      }
    }
    return true;
  });

  const criticalCount = requests.filter(r => r.urgency === 'CRITICAL' && r.status === 'ACTIVE').length;
  const activeCount = requests.filter(r => r.status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start text-slate-800 antialiased selection:bg-red-500 selection:text-white">
      
      {/* Container wrapper configured with max-w-2xl for native-like mobile/tablet aesthetic */}
      <div className="w-full max-w-2xl bg-white min-h-screen shadow-xl border-x border-slate-200/80 flex flex-col relative pb-20 sm:pb-8">

        {/* Top App Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-xl tracking-tight text-slate-900">KanBağı</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-1.5 py-0.2 rounded-md">
                  Acil Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Hayat kurtaran bağışçı ağı</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">İlan Ver</span>
              <span className="sm:hidden">İlan</span>
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="px-4 pt-3 pb-1 border-b border-slate-100 bg-white">
          <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab('REQUESTS')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'REQUESTS'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Acil İlanlar</span>
              {activeCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {activeCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('DONORS')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'DONORS'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Bağışçılar</span>
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {donors.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('COMPATIBILITY')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'COMPATIBILITY'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Uyumluluk</span>
            </button>
          </div>
        </div>

        {/* Main Content Area based on Tab */}
        <main className="flex-1 p-4 space-y-4">
          
          {activeTab === 'REQUESTS' && (
            <>
              {/* Critical Alert Bar */}
              {criticalCount > 0 && (
                <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    <span className="text-xs font-bold">
                      {criticalCount} hastamız için şu anda çok acil kan aranıyor!
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setFilterUrgency('CRITICAL');
                    }}
                    className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-extrabold cursor-pointer transition-colors shrink-0"
                  >
                    Gör
                  </button>
                </div>
              )}

              {/* Search & Filter Bar */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Hasta adı, hastane veya şehir ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                {/* Blood Group Filter Horizontal Scroll */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setFilterBloodGroup('ALL')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      filterBloodGroup === 'ALL'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tüm Gruplar
                  </button>
                  {bloodGroups.map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setFilterBloodGroup(bg)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                        filterBloodGroup === bg
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>

                {/* City & Urgency row */}
                <div className="flex items-center gap-2 pt-1">
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">Tüm Türkiye (81 İl)</option>
                    {CITIES_TR.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>

                  <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value as any)}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">Tüm Aciliyetler</option>
                    <option value="CRITICAL">🚨 Çok Acil (Hayati)</option>
                    <option value="URGENT">⚠️ 24 Saat İçinde</option>
                  </select>
                </div>
              </div>

              {/* Feed Header */}
              <div className="flex items-center justify-between px-1 text-xs text-slate-500">
                <span>{filteredRequests.length} acil kan ilanı bulundu</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyActive}
                    onChange={(e) => setShowOnlyActive(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Sadece Aktifler</span>
                </label>
              </div>

              {/* Blood Requests List */}
              {loading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">İlanlar veritabanından alınıyor...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Aranan kriterde ilan bulunamadı</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Filtreleri temizleyebilir veya hemen yeni bir acil kan ilanı oluşturabilirsiniz.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow hover:bg-red-700 transition cursor-pointer"
                  >
                    Acil Kan İlanı Ver
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredRequests.map((req) => (
                    <BloodRequestCard
                      key={req.id}
                      request={req}
                      filterBloodType={filterBloodGroup}
                      onSelect={() => setSelectedRequest(req)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'DONORS' && (
            <DonorsTab
              donors={donors}
              onOpenRegisterModal={() => setShowRegisterModal(true)}
            />
          )}

          {activeTab === 'COMPATIBILITY' && (
            <BloodCompatibilityGuide />
          )}

        </main>

        {/* Floating Quick Action Button for Mobile */}
        <div className="fixed bottom-4 right-4 sm:hidden z-30">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Acil İlan Ver"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Footer info note */}
        <footer className="mt-auto px-4 py-4 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
          <p className="font-semibold text-slate-500">KanBağı • 1 Ünite Kan, 3 Can Kurtarır</p>
          <p className="text-[11px] mt-1 text-slate-400">
            Platform acil kan bağışçıları ile hasta yakınlarını doğrudan iletişimde buluşturur. Ticari amaç gütmez.
          </p>
        </footer>

      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRequestModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => setShowCreateModal(false)}
        />
      )}

      {showRegisterModal && (
        <RegisterDonorModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => setShowRegisterModal(false)}
        />
      )}

      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

    </div>
  );
}
