'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Telegram-ის ინიციალიზაცია (მხოლოდ ბრაუზერში, SSR-ის თავიდან ასაცილებლად)
    if (typeof window !== 'undefined') {
      try {
        const { initTelegram, isTelegramAvailable } = require('@/lib/telegram');
        
        if (isTelegramAvailable()) {
          const user = initTelegram();
          if (user) {
            localStorage.setItem('jobsnap_telegram_user', JSON.stringify(user));
          }
        }
      } catch (e) {
        // Telegram SDK ხელმისაწვდომი არ არის (მაგ: ჩვეულებრივ ბრაუზერში)
        console.log('Telegram not available:', e);
      }
    }

    // პროგრესის ანიმაცია
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        router.push('/onboarding');
      }, 300);
    }
  }, [progress, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-8">
      {/* ლოგო */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <motion.div
          className="w-28 h-28 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-2xl"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(16, 185, 129, 0.4)',
              '0 0 0 30px rgba(16, 185, 129, 0)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Briefcase className="w-14 h-14 text-white" />
        </motion.div>
      </motion.div>

      {/* სათაური */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-4xl font-bold text-white mb-2"
      >
        JOBSNAP
      </motion.h1>

      {/* ქვესათაური */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-white/60 text-sm mb-12"
      >
        იპოვე შენი იდეალური სამუშაო
      </motion.p>

      {/* პროგრესის ზოლი */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: 240 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="w-60 h-1.5 bg-white/10 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </motion.div>

      {/* პროცენტული */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-white/40 text-xs mt-4"
      >
        {progress}%
      </motion.p>
    </div>
  );
}