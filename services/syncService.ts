import { getUnsyncedScans, markScansAsSynced } from './scanService';
import { syncScansToRemote } from './apiService';
import { SYNC_INTERVAL_MS } from '../constants';

let syncInterval: number | null = null;
let isSyncing = false;

export const startSyncService = (authToken?: string) => {
  if (syncInterval) return; // Already running

  console.log('[Sync Service] Started');

  const runSync = async () => {
    if (isSyncing) return;
    
    // Check for internet connection first
    if (!navigator.onLine) {
      console.log('[Sync Service] Offline, skipping sync.');
      return;
    }

    const pendingScans = getUnsyncedScans();
    if (pendingScans.length === 0) {
      return;
    }

    try {
      isSyncing = true;
      const response = await syncScansToRemote(pendingScans, authToken);
      
      if (response.success && response.syncedIds.length > 0) {
        markScansAsSynced(response.syncedIds);
        // Trigger a custom event so the UI can update if it wants to listen
        window.dispatchEvent(new CustomEvent('scan-data-synced'));
      }
    } catch (error) {
      console.error('[Sync Service] Sync failed:', error);
      // We do nothing here; the records remain unsynced and will be picked up next interval
    } finally {
      isSyncing = false;
    }
  };

  // Run immediately on start
  runSync();

  // Set interval
  syncInterval = window.setInterval(runSync, SYNC_INTERVAL_MS);
};

export const stopSyncService = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('[Sync Service] Stopped');
  }
};