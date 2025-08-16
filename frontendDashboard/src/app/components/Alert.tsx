'use client';
import { useEffect } from 'react';

type AlertProps = {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
};

export default function Alert({ message, type = 'success', onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // auto close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-6 py-3 rounded-xl shadow-lg text-white font-medium ${
          type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
      >
        {message}
      </div>
    </div>
  );
}
