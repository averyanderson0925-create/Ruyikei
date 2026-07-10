import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ open, title, onClose, children }) => (
  <AnimatePresence>
    {open ? (
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-3xl rounded-[32px] bg-white p-6 shadow-2xl shadow-slate-900/15"
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
            <button type="button" className="text-slate-500 transition hover:text-slate-900" onClick={onClose}>
              Close
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

export default Modal;
