export const APP_VERSION = '1.0.0';
export const MAX_DAILY_SCANS_PER_TAG = 15;
export const TOTAL_TAGS_EXPECTED = 1000;

// Device ID generation (persistent per browser)
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = `DEV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

// Placeholder images for the logos since we cannot access local file paths directly in this environment.
// In a real deployment, these would be imports from an assets folder.
export const LOGO_COCREARTE = "https://picsum.photos/id/64/150/80"; // Using artistic placeholder
export const LOGO_COLSUBSIDIO = "https://picsum.photos/id/160/200/60"; // Using structured placeholder

// API Configuration
export const API_BASE_URL = 'https://api.cocrearte-rfid-tracker.com/v1';
export const SYNC_INTERVAL_MS = 30000; // Sync every 30 seconds