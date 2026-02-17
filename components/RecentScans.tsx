import React, { useState } from 'react';
import { ScanRecord } from '../types';
import { Clock, CheckCircle, MapPin, Search } from 'lucide-react';

interface RecentScansProps {
  scans: ScanRecord[];
}

const RecentScans: React.FC<RecentScansProps> = ({ scans }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter scans based on search term
  const filteredScans = scans.filter(scan => 
    scan.tagId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (scans.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
        <p className="text-gray-400">No hay lecturas recientes.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header with Title and Search */}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50">
        <div className="flex items-center gap-3">
            <h3 className="font-bold text-gray-800">Lecturas Recientes</h3>
            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {filteredScans.length}
            </span>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cocrearte-purple focus:border-cocrearte-purple sm:text-sm transition duration-150 ease-in-out"
                placeholder="Buscar ID de manilla..."
            />
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto no-scrollbar">
        {filteredScans.length > 0 ? (
            filteredScans.map((scan) => (
              <div key={scan.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cocrearte-purple/10 flex items-center justify-center text-cocrearte-purple font-bold text-lg flex-shrink-0">
                     #
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-bold text-gray-900 truncate">{scan.tagId}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                      {scan.location && (
                          <span className="flex items-center gap-1 text-green-600 truncate">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{scan.location.latitude.toFixed(4)}, {scan.location.longitude.toFixed(4)}</span>
                          </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center pl-2">
                    {scan.synced ? (
                         <div title="Sincronizado" className="bg-green-100 p-1 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                         </div>
                    ) : (
                         <div title="Pendiente de sincronización" className="bg-gray-100 p-1 rounded-full">
                            <Clock className="w-4 h-4 text-gray-400" />
                         </div>
                    )}
                </div>
              </div>
            ))
        ) : (
            <div className="p-8 text-center">
                <p className="text-gray-500 text-sm">No se encontraron resultados para "{searchTerm}"</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default RecentScans;