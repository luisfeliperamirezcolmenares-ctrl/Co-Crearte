export interface GeoLocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface ScanRecord {
  id: string;
  tagId: string;
  timestamp: string; // ISO string
  location: GeoLocationData | null;
  deviceId: string;
  synced: boolean;
}

export interface DeviceStats {
  totalScans: number;
  scansToday: number;
  lastSync: string;
}

export enum ScanStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}