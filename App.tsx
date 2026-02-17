import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ScannerInput from './components/ScannerInput';
import ScanStats from './components/ScanStats';
import RecentScans from './components/RecentScans';
import Login from './components/Login';
import EmailReportButton from './components/EmailReportButton';
import { saveScan, getStats, getLocalScans } from './services/scanService';
import { startSyncService, stopSyncService } from './services/syncService';
import { ScanStatus, ScanRecord, DeviceStats } from './types';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<ScanStatus>(ScanStatus.IDLE);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [stats, setStats] = useState<DeviceStats>({ totalScans: 0, scansToday: 0, lastSync: '' });
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Initialize data and Sync Service
  useEffect(() => {
    if (user) {
      refreshData();
      
      // Start Background Sync
      // In a real app, we would pass the actual auth token here
      startSyncService('mock-auth-token');

      // Request location immediately to trigger permission prompt
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => setPermissionError(null),
          (err) => {
             console.error("Geo error", err);
             if (err.code === 1) setPermissionError("Se requiere permiso de ubicación para operar.");
          }
        );
      }

      // Listen for sync events to update UI
      const handleSyncUpdate = () => refreshData();
      window.addEventListener('scan-data-synced', handleSyncUpdate);

      return () => {
        stopSyncService();
        window.removeEventListener('scan-data-synced', handleSyncUpdate);
      };
    }
  }, [user]);

  const refreshData = () => {
    setScans(getLocalScans().slice(0, 50)); // Only show last 50
    setStats(getStats());
  };

  const handleScan = useCallback(async (code: string) => {
    setStatus(ScanStatus.SCANNING);
    
    // Simulate slight delay for UX (database handshake simulation)
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      await saveScan(code);
      setStatus(ScanStatus.SUCCESS);
      
      // Play success beep
      try {
        const audio = new AudioContext();
        const osc = audio.createOscillator();
        const gain = audio.createGain();
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.frequency.value = 1200;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(audio.currentTime + 0.1);
      } catch (e) {
        // Audio context might be blocked, ignore
      }

      refreshData();
      
      // Reset status after a moment
      setTimeout(() => {
        setStatus(ScanStatus.IDLE);
      }, 1500);

    } catch (error) {
      console.error(error);
      setStatus(ScanStatus.ERROR);
      setTimeout(() => setStatus(ScanStatus.IDLE), 2000);
    }
  }, []);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-cocrearte-purple animate-spin" />
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <Login />;
  }

  // Authenticated App
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:px-6">
        
        {permissionError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {permissionError}
                  <button onClick={() => window.location.reload()} className="ml-2 font-bold underline">Reintentar</button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Header with Action Buttons */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-sm text-gray-500">Bienvenido, {user.displayName.split(' ')[0]}</p>
          </div>
          <EmailReportButton stats={stats} recentScans={scans} />
        </div>

        <div className="space-y-6">
          {/* Main Scanner Area */}
          <section>
             <ScannerInput onScan={handleScan} status={status} />
          </section>

          {/* Statistics Dashboard */}
          <section>
            <ScanStats stats={stats} />
          </section>

          {/* History List */}
          <section>
            <RecentScans scans={scans} />
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xs text-gray-400">
                CoCrearte RFID System v1.1 &bull; Colsubsidio &bull; Usuario: {user.email}
            </p>
        </div>
      </footer>
    </div>
  );
}

export default App;