import React from 'react';
import { Wifi, BatteryMedium, LogOut, User as UserIcon } from 'lucide-react';
import { getDeviceId } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left: Branding */}
          <div className="flex items-center space-x-2 sm:space-x-4">
             {/* Co Crearte Logo Placeholder */}
             <div className="flex flex-col justify-center h-8 w-20 sm:h-10 sm:w-24 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cocrearte-purple to-cocrearte-cyan opacity-20 rounded-md"></div>
                <span className="text-[10px] sm:text-xs font-bold text-center text-cocrearte-purple z-10 leading-tight">
                  CO<br/>CREARTE
                </span>
             </div>

             <div className="h-6 sm:h-8 w-px bg-gray-300 mx-1 sm:mx-2"></div>

             {/* Colsubsidio Logo Placeholder */}
             <div className="flex items-center h-8 sm:h-10">
                <div className="flex items-center gap-1">
                   <div className="w-5 h-5 sm:w-6 sm:h-6 bg-colsubsidio-yellow rounded-tl-lg rounded-br-lg"></div>
                   <span className="font-bold text-colsubsidio-blue tracking-tight text-sm sm:text-base">Colsubsidio</span>
                </div>
             </div>
          </div>

          {/* Right: Device Info & User */}
          <div className="flex items-center space-x-4">
            
            {/* System Status Icons */}
            <div className="hidden md:flex items-center space-x-2 text-gray-400">
               <Wifi className="w-4 h-4" />
               <BatteryMedium className="w-4 h-4" />
            </div>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-700">{user.displayName}</span>
                  <span className="text-[10px] text-gray-500">{user.email}</span>
                </div>
                
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 relative">
                   {user.photoURL ? (
                     <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">
                       <UserIcon className="w-5 h-5" />
                     </div>
                   )}
                </div>

                {/* Logout */}
                <button 
                  onClick={logout}
                  className="p-1.5 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;