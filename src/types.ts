export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-';

export type UrgencyLevel = 'CRITICAL' | 'URGENT' | 'NORMAL'; // CRITICAL: Acil (Hayati), URGENT: 24 Saat İçinde, NORMAL: Planlı

export interface BloodRequest {
  id?: string;
  patientName: string;
  bloodType: BloodGroup;
  componentType?: 'Tam Kan' | 'Trombosit (Aferez)' | 'Eritrosit' | 'Plazma';
  unitsNeeded: number;
  unitsFulfilled?: number;
  hospital: string;
  city: string;
  district: string;
  urgency: UrgencyLevel;
  contactPerson: string;
  phone: string;
  additionalPhone?: string;
  notes?: string;
  status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED';
  createdAt: number; // timestamp
  updatedAt?: number;
  responseCount?: number;
}

export interface DonorProfile {
  id?: string;
  fullName: string;
  bloodType: BloodGroup;
  city: string;
  district: string;
  phone: string;
  canDonateApheresis: boolean; // Trombosit/Aferez verebilir mi
  isAvailable: boolean;
  lastDonationDate?: string;
  notes?: string;
  createdAt: number;
}

export interface DonationPledge {
  id?: string;
  requestId: string;
  donorName: string;
  donorPhone: string;
  donorBloodType: BloodGroup;
  message?: string;
  createdAt: number;
}

// Blood compatibility matrix in Turkish context
// recipient -> allowed donors
export const BLOOD_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
  '0-': ['0-'],
  '0+': ['0-', '0+'],
  'B-': ['0-', 'B-'],
  'B+': ['0-', '0+', 'B-', 'B+'],
  'A-': ['0-', 'A-'],
  'A+': ['0-', '0+', 'A-', 'A+'],
  'AB-': ['0-', 'B-', 'A-', 'AB-'],
  'AB+': ['0-', '0+', 'B-', 'B+', 'A-', 'A+', 'AB-', 'AB+']
};

export const CITIES_TR = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın',
  'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı',
  'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep',
  'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir', 'Kars',
  'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya',
  'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa',
  'Uşak', 'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
  'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];
