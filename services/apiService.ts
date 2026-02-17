import { ScanRecord } from '../types';
import { API_BASE_URL } from '../constants';

interface SyncResponse {
  success: boolean;
  syncedIds: string[];
  message?: string;
}

/**
 * Uploads a batch of scan records to the remote server.
 * This is a MOCK implementation simulating network behavior.
 */
export const syncScansToRemote = async (scans: ScanRecord[], authToken?: string): Promise<SyncResponse> => {
  // In a real implementation:
  /*
  const response = await fetch(`${API_BASE_URL}/scans/batch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ scans })
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
  */

  // Mock Implementation simulating latency and random network errors
  return new Promise((resolve, reject) => {
    console.log(`[Background Sync] Attempting to sync ${scans.length} records...`);

    setTimeout(() => {
      // Simulate 5% chance of network error
      if (Math.random() < 0.05) {
        console.error('[Background Sync] Network Error Simulation');
        reject(new Error("Simulated Network Error"));
        return;
      }

      // Simulate successful upload
      const syncedIds = scans.map(s => s.id);
      console.log(`[Background Sync] Successfully synced ${syncedIds.length} records.`);
      
      resolve({
        success: true,
        syncedIds,
        message: 'Batch uploaded successfully'
      });
    }, 1500); // 1.5s latency
  });
};