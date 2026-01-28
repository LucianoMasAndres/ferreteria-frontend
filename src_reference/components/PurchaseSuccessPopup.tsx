import { useEffect } from 'react';
import { Truck } from 'lucide-react'; // Import the Truck icon

interface PurchaseSuccessPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PurchaseSuccessPopup: React.FC<PurchaseSuccessPopupProps> = ({ isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Popup visible for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[999] flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center border border-cyan-500 max-w-xs mx-auto">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4 flex items-center justify-center gap-2">
          <Truck size={28} /> ¡Compra Exitosa!
        </h2>
        <div className="relative w-full h-24 overflow-hidden mb-4">
          {/* Truck SVG */}
          <svg className="truck-animation absolute left-0 top-1/2 -translate-y-1/2" viewBox="0 0 100 50" width="100" height="50" preserveAspectRatio="xMidYMid meet">
            <g>
              {/* Truck Body */}
              <rect x="0" y="20" width="60" height="20" fill="#60A5FA" rx="5" ry="5"/>
              <rect x="60" y="15" width="20" height="25" fill="#60A5FA" rx="5" ry="5"/>
              {/* Wheels */}
              <circle cx="15" cy="40" r="8" fill="#333"/>
              <circle cx="50" cy="40" r="8" fill="#333"/>
              <circle cx="68" cy="40" r="8" fill="#333"/>
            </g>
          </svg>
          {/* Flag SVG */}
          <svg className="flag-static absolute right-0 top-1/2 -translate-y-1/2" viewBox="0 0 30 50" preserveAspectRatio="xMidYMid meet">
            <line x1="5" y1="5" x2="5" y2="45" stroke="#FFF" strokeWidth="3"/>
            <polygon points="5,5 25,15 5,25" fill="#EF4444"/>
          </svg>
        </div>
        <p className="text-gray-300 mb-6">Tu pedido está en camino.</p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-cyan-600 to-purple-700 text-white py-2 px-6 rounded-md font-semibold hover:from-cyan-500 hover:to-purple-600 transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
