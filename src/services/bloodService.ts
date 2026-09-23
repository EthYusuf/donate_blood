import { 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import { BloodRequest, DonorProfile, DonationPledge } from '../types';

const REQUESTS_COLL = 'blood_requests';
const DONORS_COLL = 'donors';

export const subscribeBloodRequests = (callback: (requests: BloodRequest[]) => void) => {
  const q = query(collection(db, REQUESTS_COLL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const list: BloodRequest[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        patientName: data.patientName || '',
        bloodType: data.bloodType || 'A+',
        componentType: data.componentType || 'Tam Kan',
        unitsNeeded: Number(data.unitsNeeded) || 1,
        unitsFulfilled: Number(data.unitsFulfilled) || 0,
        hospital: data.hospital || '',
        city: data.city || '',
        district: data.district || '',
        urgency: data.urgency || 'URGENT',
        contactPerson: data.contactPerson || '',
        phone: data.phone || '',
        additionalPhone: data.additionalPhone || '',
        notes: data.notes || '',
        status: data.status || 'ACTIVE',
        createdAt: data.createdAt ? (typeof data.createdAt === 'number' ? data.createdAt : data.createdAt.toMillis?.() || Date.now()) : Date.now(),
        updatedAt: data.updatedAt,
        responseCount: data.responseCount || 0
      });
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to blood requests:', err);
  });
};

export const createBloodRequest = async (requestData: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>) => {
  const payload = {
    ...requestData,
    unitsNeeded: Number(requestData.unitsNeeded),
    unitsFulfilled: 0,
    status: 'ACTIVE',
    createdAt: Date.now(),
    responseCount: 0
  };
  const docRef = await addDoc(collection(db, REQUESTS_COLL), payload);
  return docRef.id;
};

export const updateRequestStatus = async (requestId: string, status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED') => {
  const ref = doc(db, REQUESTS_COLL, requestId);
  await updateDoc(ref, {
    status,
    updatedAt: Date.now()
  });
};

export const incrementFulfilledUnits = async (requestId: string, currentUnits: number, totalNeeded: number) => {
  const ref = doc(db, REQUESTS_COLL, requestId);
  const nextUnits = currentUnits + 1;
  const isNowFulfilled = nextUnits >= totalNeeded;
  await updateDoc(ref, {
    unitsFulfilled: nextUnits,
    status: isNowFulfilled ? 'FULFILLED' : 'ACTIVE',
    updatedAt: Date.now()
  });
};

export const subscribeDonors = (callback: (donors: DonorProfile[]) => void) => {
  const q = query(collection(db, DONORS_COLL), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const list: DonorProfile[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        fullName: data.fullName || '',
        bloodType: data.bloodType || 'A+',
        city: data.city || '',
        district: data.district || '',
        phone: data.phone || '',
        canDonateApheresis: !!data.canDonateApheresis,
        isAvailable: data.isAvailable !== false,
        lastDonationDate: data.lastDonationDate || '',
        notes: data.notes || '',
        createdAt: data.createdAt || Date.now()
      });
    });
    callback(list);
  }, (err) => {
    console.error('Error subscribing to donors:', err);
  });
};

export const registerDonor = async (donorData: Omit<DonorProfile, 'id' | 'createdAt'>) => {
  const payload = {
    ...donorData,
    createdAt: Date.now()
  };
  const docRef = await addDoc(collection(db, DONORS_COLL), payload);
  return docRef.id;
};

export const addDonationPledge = async (pledge: Omit<DonationPledge, 'id' | 'createdAt'>) => {
  const ref = collection(db, `${REQUESTS_COLL}/${pledge.requestId}/responses`);
  await addDoc(ref, {
    ...pledge,
    createdAt: Date.now()
  });
  // Increment responseCount on request
  const reqRef = doc(db, REQUESTS_COLL, pledge.requestId);
  // Optional lightweight update
};

export const subscribePledges = (requestId: string, callback: (pledges: DonationPledge[]) => void) => {
  const q = query(collection(db, `${REQUESTS_COLL}/${requestId}/responses`), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const list: DonationPledge[] = [];
    snap.forEach((d) => {
      const data = d.data();
      list.push({
        id: d.id,
        requestId,
        donorName: data.donorName || '',
        donorPhone: data.donorPhone || '',
        donorBloodType: data.donorBloodType || '0+',
        message: data.message || '',
        createdAt: data.createdAt || Date.now()
      });
    });
    callback(list);
  });
};
