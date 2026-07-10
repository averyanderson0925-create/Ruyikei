import { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(onClose, 2200);
    return () => clearTimeout(timeout);
  }, [message, onClose]);

  if (!message) return null;

  const bgClass = type === 'error' ? 'bg-red-600' : 'bg-blue-600';

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-3xl px-5 py-4 text-sm font-medium text-white shadow-2xl shadow-slate-900/20 ${bgClass}`}>
      {message}
    </div>
  );
};

export default Toast;
