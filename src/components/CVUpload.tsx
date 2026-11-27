'use client';

import { useState } from 'react';
import { FileText, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CVUpload() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <div className="w-full">
      {/* Upload Zone - Disabled */}
      <motion.div
        onClick={handleClick}
        className="relative w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-not-allowed bg-gray-50 opacity-60"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center mb-3">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          
          <p className="text-sm font-semibold text-gray-500 mb-1">
            ატვირთე რეზიუმე (PDF)
          </p>
          <p className="text-xs text-gray-400">
            მაქსიმუმ 5MB • მხოლოდ PDF
          </p>
        </div>

        {/* Lock Icon */}
        <div className="absolute top-3 right-3">
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
      </motion.div>

      {/* Coming Soon Tooltip */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mt-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl p-4 flex items-start gap-3"
        >
          <Sparkles className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white mb-1">
              მალე იქნება ხელმისაწვდომი! 🚀
            </p>
            <p className="text-xs text-white/90">
              CV ატვირთვის ფუნქციონალზე ვმუშაობთ. მალე შეძლებთ რეზიუმეს ატვირთვას!
            </p>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          💡 CV ატვირთვის ფუნქციონალი მალე დაემატება. ჯერ შეავსეთ პროფილი - ეს უკვე ეხმარება დამსაქმებელს!
        </p>
      </div>
    </div>
  );
}