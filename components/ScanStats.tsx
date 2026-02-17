import React from 'react';
import { DeviceStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ScanStatsProps {
  stats: DeviceStats;
}

const ScanStats: React.FC<ScanStatsProps> = ({ stats }) => {
  // Mock hourly data distribution for visualization
  const data = [
    { name: '8am', scans: Math.floor(stats.scansToday * 0.1) },
    { name: '10am', scans: Math.floor(stats.scansToday * 0.2) },
    { name: '12pm', scans: Math.floor(stats.scansToday * 0.4) },
    { name: '2pm', scans: Math.floor(stats.scansToday * 0.2) },
    { name: '4pm', scans: Math.floor(stats.scansToday * 0.1) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Card 1: Daily Progress */}
      <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-cocrearte-cyan relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hoy</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.scansToday}</h3>
            <p className="text-xs text-gray-400 mt-1">Escaneos realizados</p>
          </div>
          <div className="p-3 bg-cyan-50 rounded-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cocrearte-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
             </svg>
          </div>
        </div>
        <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-cocrearte-cyan to-cocrearte-purple h-1.5 rounded-full" 
            style={{ width: `${Math.min((stats.scansToday / 1500) * 100, 100)}%` }} // Assuming 1000 tags * 1.5 avg
          ></div>
        </div>
      </div>

      {/* Card 2: Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5 border-l-4 border-colsubsidio-yellow">
        <div className="flex justify-between items-center mb-2">
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Actividad</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalScans}</h3>
            </div>
             <div className="p-3 bg-yellow-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-colsubsidio-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
            </div>
        </div>
        <div className="h-24 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" hide />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="scans" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0033A0' : '#FFCD00'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ScanStats;