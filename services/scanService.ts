import { ScanRecord, GeoLocationData, DeviceStats } from '../types';
import { getDeviceId } from '../constants';

const STORAGE_KEY = 'rfid_scans';

export const saveScan = async (tagId: string): Promise<ScanRecord> => {
  const deviceId = getDeviceId();
  
  // 1. Get Location
  let location: GeoLocationData | null = null;
  try {
    location = await getCurrentLocation();
  } catch (e) {
    console.warn("Location not available", e);
  }

  // 2. Create Record
  const newScan: ScanRecord = {
    id: crypto.randomUUID(),
    tagId,
    timestamp: new Date().toISOString(),
    location,
    deviceId,
    synced: false // Pending sync to central server
  };

  // 3. Save to Local Storage (Simulating DB)
  const existing = getLocalScans();
  const updated = [newScan, ...existing].slice(0, 1000); // Keep last 1000 locally
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return newScan;
};

export const getLocalScans = (): ScanRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getUnsyncedScans = (): ScanRecord[] => {
  const scans = getLocalScans();
  return scans.filter(scan => !scan.synced);
};

export const markScansAsSynced = (ids: string[]): void => {
  if (ids.length === 0) return;
  
  const scans = getLocalScans();
  const updatedScans = scans.map(scan => {
    if (ids.includes(scan.id)) {
      return { ...scan, synced: true };
    }
    return scan;
  });
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScans));
};

export const getStats = (): DeviceStats => {
  const scans = getLocalScans();
  const todayStart = new Date();
  todayStart.setHours(0,0,0,0);

  const todayScans = scans.filter(s => new Date(s.timestamp) >= todayStart);

  return {
    totalScans: scans.length,
    scansToday: todayScans.length,
    lastSync: new Date().toISOString() // In a real app, this would be the last successful sync time
  };
};

const getCurrentLocation = (): Promise<GeoLocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};