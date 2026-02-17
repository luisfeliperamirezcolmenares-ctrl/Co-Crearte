import React from 'react';
import { Mail, FileText } from 'lucide-react';
import { ScanRecord, DeviceStats } from '../types';

interface EmailReportButtonProps {
  stats: DeviceStats;
  recentScans: ScanRecord[];
}

const EmailReportButton: React.FC<EmailReportButtonProps> = ({ stats, recentScans }) => {
  
  const handleSendEmail = () => {
    const today = new Date().toLocaleDateString('es-CO');
    const time = new Date().toLocaleTimeString('es-CO');
    
    // Construct Email Body
    let body = `REPORTE DE ESCANEOS RFID - ${today}\n\n`;
    body += `Generado: ${time}\n`;
    body += `Total Escaneos Hoy: ${stats.scansToday}\n`;
    body += `Total Acumulado: ${stats.totalScans}\n\n`;
    
    body += `ÚLTIMOS 20 REGISTROS:\n`;
    body += `--------------------------------\n`;
    
    recentScans.slice(0, 20).forEach((scan, index) => {
      const scanTime = new Date(scan.timestamp).toLocaleTimeString();
      const loc = scan.location 
        ? `[GPS: ${scan.location.latitude.toFixed(5)}, ${scan.location.longitude.toFixed(5)}]` 
        : '[Sin GPS]';
      body += `${index + 1}. ID: ${scan.tagId} - Hora: ${scanTime} ${loc}\n`;
    });
    
    body += `\n--------------------------------\n`;
    body += `Fin del reporte.\n`;

    // Encode for URL
    const subject = encodeURIComponent(`Reporte RFID Colsubsidio - ${today}`);
    const encodedBody = encodeURIComponent(body);
    
    // Open Mail Client
    window.location.href = `mailto:?subject=${subject}&body=${encodedBody}`;
  };

  return (
    <button 
      onClick={handleSendEmail}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-colsubsidio-blue transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-colsubsidio-blue"
    >
      <Mail className="w-4 h-4" />
      <span>Enviar Reporte</span>
    </button>
  );
};

export default EmailReportButton;