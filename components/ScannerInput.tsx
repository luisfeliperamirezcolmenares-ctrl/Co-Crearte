import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Scan, MapPin, Loader2, Zap } from 'lucide-react';
import { ScanStatus } from '../types';

interface ScannerInputProps {
  onScan: (code: string) => Promise<void>;
  status: ScanStatus;
}

const ScannerInput: React.FC<ScannerInputProps> = ({ onScan, status }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [manualMode, setManualMode] = useState(false);

  // Keep focus on the input for HID readers (Keyboard Emulation)
  const maintainFocus = useCallback(() => {
    if (!manualMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [manualMode]);

  useEffect(() => {
    const interval = setInterval(maintainFocus, 2000);
    window.addEventListener('click', maintainFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('click', maintainFocus);
    };
  }, [maintainFocus]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim().length > 0) {
      await onScan(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const statusColor = {
    [ScanStatus.IDLE]: 'border-gray-300 bg-white',
    [ScanStatus.SCANNING]: 'border-blue-500 bg-blue-50',
    [ScanStatus.SUCCESS]: 'border-green-500 bg-green-50',
    [ScanStatus.ERROR]: 'border-red-500 bg-red-50',
  };

  const iconColor = {
    [ScanStatus.IDLE]: 'text-gray-400',
    [ScanStatus.SCANNING]: 'text-blue-500',
    [ScanStatus.SUCCESS]: 'text-green-500',
    [ScanStatus.ERROR]: 'text-red-500',
  };

  return (
    <div className="w-full mb-6">
      <div className={`
        relative rounded-2xl border-2 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center
        ${statusColor[status]} shadow-lg min-h-[200px]
      `}>
        
        {/* Visual Indicator */}
        <div className={`
          w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md mb-4
          ${status === ScanStatus.SCANNING ? 'animate-pulse-fast ring-4 ring-blue-200' : ''}
        `}>
          {status === ScanStatus.SCANNING || status === ScanStatus.IDLE ? (
             <Scan className={`w-10 h-10 ${iconColor[status]}`} />
          ) : status === ScanStatus.SUCCESS ? (
             <Zap className="w-10 h-10 text-green-500 fill-current" />
          ) : (
             <Scan className="w-10 h-10 text-red-500" />
          )}
        </div>

        {/* Text Status */}
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {status === ScanStatus.IDLE && 'Listo para Escanear'}
          {status === ScanStatus.SCANNING && 'Procesando...'}
          {status === ScanStatus.SUCCESS && '¡Lectura Exitosa!'}
          {status === ScanStatus.ERROR && 'Error en Lectura'}
        </h2>
        
        <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
          {manualMode 
            ? 'Ingrese el código de la manilla manualmente.' 
            : 'Acerque el lector RFID a la manilla (125 kHz).'}
        </p>

        {/* Location Badge */}
        <div className="absolute top-4 right-4">
           <div className="flex items-center gap-1 px-2 py-1 bg-white/80 backdrop-blur rounded-full shadow-sm text-xs font-medium text-blue-600">
             <MapPin className="w-3 h-3" />
             <span>GPS Activo</span>
           </div>
        </div>

        {/* Input Field (Hidden or Visible depending on mode) */}
        <div className="w-full max-w-sm relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => !manualMode && setTimeout(() => inputRef.current?.focus(), 10)}
            placeholder={manualMode ? "Escriba código..." : "Esperando lector..."}
            className={`
              w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cocrearte-purple transition-all
              ${manualMode ? 'bg-white border-gray-300 opacity-100 text-lg text-center font-mono tracking-widest' : 'opacity-0 absolute inset-0 h-full cursor-default'}
            `}
            autoComplete="off"
            autoFocus
          />
          {!manualMode && (
             <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold animate-pulse">
                    Escuchando HID...
                </span>
             </div>
          )}
        </div>

        {/* Toggle Manual Mode */}
        <button 
            onClick={() => {
                setManualMode(!manualMode);
                if(!manualMode) setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="mt-4 text-xs font-medium text-gray-500 underline hover:text-colsubsidio-blue transition-colors"
        >
            {manualMode ? 'Volver a Escaneo Automático' : 'Ingresar código manualmente'}
        </button>
      </div>
    </div>
  );
};

export default ScannerInput;