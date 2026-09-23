import { BloodRequest, DonorProfile } from './types';
import { createBloodRequest, registerDonor } from './services/bloodService';

// Profesyonel gerçekçi başlangıç kayıtları
export const SEED_BLOOD_REQUESTS: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>[] = [
  {
    patientName: 'Ali Kemal Yıldız',
    bloodType: 'A+',
    componentType: 'Trombosit (Aferez)',
    unitsNeeded: 3,
    hospital: 'Ankara Şehir Hastanesi, Hematoloji Kliniği',
    city: 'Ankara',
    district: 'Çankaya',
    urgency: 'CRITICAL',
    contactPerson: 'Zeynep Yıldız (Hasta Yakını)',
    phone: '0532 555 42 19',
    additionalPhone: '0543 210 98 76',
    notes: 'Hematoloji kliniğinde tedavi gören hastamız için acil aferez trombosit bağışçısına ihtiyaç vardır. Trombosit cihazına bağlanabilecek son 48 saatte aspirin veya kan sulandırıcı kullanmamış bağışçılar rica olunur.'
  },
  {
    patientName: 'Elif Sena Kaya',
    bloodType: '0-',
    componentType: 'Tam Kan',
    unitsNeeded: 4,
    hospital: 'İstanbul Başakşehir Çam ve Sakura Şehir Hastanesi',
    city: 'İstanbul',
    district: 'Başakşehir',
    urgency: 'CRITICAL',
    contactPerson: 'Mehmet Kaya (Babası)',
    phone: '0555 123 45 67',
    notes: 'Acil cerrahi operasyon için 0 Rh Negatif kan grubu gereklidir. Doğrudan hastane kan merkezine müracaat edebilir veya verilen numaradan arayabilirsiniz.'
  },
  {
    patientName: 'Mustafa Demir',
    bloodType: 'B+',
    componentType: 'Tam Kan',
    unitsNeeded: 2,
    hospital: 'İzmir Ege Üniversitesi Tıp Fakültesi Hastanesi',
    city: 'İzmir',
    district: 'Bornova',
    urgency: 'URGENT',
    contactPerson: 'Burak Demir (Kardeşi)',
    phone: '0542 987 65 43',
    notes: 'Yoğun bakım ünitesinde tedavisi süren hastamız için 2 ünite B Rh(+) kana acil ihtiyaç duyulmaktadır.'
  },
  {
    patientName: 'Fatma Şahin',
    bloodType: 'AB-',
    componentType: 'Plazma',
    unitsNeeded: 2,
    hospital: 'Antalya Akdeniz Üniversitesi Hastanesi',
    city: 'Antalya',
    district: 'Konyaaltı',
    urgency: 'URGENT',
    contactPerson: 'Ahmet Şahin',
    phone: '0505 333 22 11',
    notes: 'Nadir bulunan AB Rh Negatif grubu aranmaktadır. Uygun olan gönüllülerin telefon veya WhatsApp üzerinden ulaşması rica olunur.'
  },
  {
    patientName: 'Kemal Aksoy',
    bloodType: '0+',
    componentType: 'Tam Kan',
    unitsNeeded: 2,
    hospital: 'Bursa Uludağ Üniversitesi Sağlık Uygulama Merkezi',
    city: 'Bursa',
    district: 'Nilüfer',
    urgency: 'NORMAL',
    contactPerson: 'Ceren Aksoy',
    phone: '0533 777 88 99',
    notes: 'Planlanan ortopedi operasyonu için tedbiren 0+ kana ihtiyaç bulunmaktadır.'
  }
];

export const SEED_DONORS: Omit<DonorProfile, 'id' | 'createdAt'>[] = [
  {
    fullName: 'Emre Çetin',
    bloodType: '0-',
    city: 'İstanbul',
    district: 'Kadıköy',
    phone: '0535 111 22 33',
    canDonateApheresis: true,
    isAvailable: true,
    lastDonationDate: '2026-06-10',
    notes: 'Acil durumlarda 7/24 ulaşabilirsiniz. Anadolu yakasındaki hastanelere hızlıca gelebilirim.'
  },
  {
    fullName: 'Selin Yılmaz',
    bloodType: 'A+',
    city: 'Ankara',
    district: 'Yenimahalle',
    phone: '0544 222 33 44',
    canDonateApheresis: false,
    isAvailable: true,
    lastDonationDate: '2026-05-15',
    notes: 'Mesai saatleri sonrası veya hafta sonu her an kan verebilirim.'
  },
  {
    fullName: 'Caner Özkan',
    bloodType: 'AB+',
    city: 'İzmir',
    district: 'Karşıyaka',
    phone: '0552 444 55 66',
    canDonateApheresis: true,
    isAvailable: true,
    notes: 'Genel alıcıyım, trombosit veya plazma bağışı için hazırım.'
  },
  {
    fullName: 'Merve Tan',
    bloodType: 'B-',
    city: 'Bursa',
    district: 'Osmangazi',
    phone: '0530 888 99 00',
    canDonateApheresis: false,
    isAvailable: true,
    notes: 'B- nadir olduğu için acil durumlarda çağrıldığımda gelebilirim.'
  }
];

export const seedInitialDataIfEmpty = async (existingCount: number, existingDonorsCount: number) => {
  if (existingCount === 0) {
    for (const req of SEED_BLOOD_REQUESTS) {
      await createBloodRequest(req);
    }
  }
  if (existingDonorsCount === 0) {
    for (const d of SEED_DONORS) {
      await registerDonor(d);
    }
  }
};
