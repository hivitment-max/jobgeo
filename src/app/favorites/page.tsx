'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Heart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { featuredJobs, recommendedJobs, Job } from '@/data/mock-jobs';
import RecommendedJobCard from '@/components/RecommendedJobCard';

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<Job[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        if (tg.isVersionAtLeast && tg.isVersionAtLeast('8.0')) {
          const platform = tg.platform?.toLowerCase() || '';
          if (['android', 'ios'].includes(platform)) {
            try { tg.requestFullscreen(); } catch (e) {}
          }
        }
        tg.setHeaderColor('#ffffff');
        tg.setBackgroundColor('#ffffff');

        const savedUser = localStorage.getItem('jobsnap_telegram_user');
        if (savedUser) setUser(JSON.parse(savedUser));
      }

      // Mock favorites - demo-სთვის
      const allJobs = [...featuredJobs, ...recommendedJobs];
      setFavorites(allJobs.slice(0, 4));
    }
  }, []);

  const handleRemove = (id: string) => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        try { tg.HapticFeedback.impactOccurred('light'); } catch (e) {}
      }
    }
    setFavorites(favorites.filter((j) => j.id !== id));
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div 
        className="px-6 pt-6 pb-4 bg-white"
        style={{ 
          paddingTop: 'calc(var(--tg-content-safe-area-inset-top, 56px) + var(--tg-safe-area-inset-top, 0px) + 16px)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Zap className="w-5 h-5 text-emerald-400" fill="currentColor" />
            </div>
            <div className="flex flex-col justify-center h-10">
              <div className="flex items-baseline leading-none">
                <span className="text-xl font-black text-gray-900 tracking-tight">JOB</span>
                <span className="text-xl font-light italic text-emerald-500 tracking-tight">SNAP</span>
              </div>
              <span className="text-[10px] text-gray-500 leading-tight mt-0.5 tracking-wide">
                იპოვე სამუშაო
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {user?.firstName?.charAt(0) || 'J'}
              </span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">რჩეული ვაკანსიები</h1>
          <p className="text-sm text-gray-500 mt-1">
            {favorites.length} შენახული ვაკანსია
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              ჯერ არაფერი გაქვს შენახული
            </h2>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              დააჭირე ❤️ ღილაკს ვაკანსიაზე რომ შეინახო
            </p>
            <button
              onClick={() => router.push('/vacancies')}
              className="mt-6 bg-gray-900 text-white rounded-2xl px-6 py-3 font-semibold text-sm"
            >
              ვაკანსიების ნახვა
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence>
              {favorites.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative"
                >
                  <button
                    onClick={() => router.push(`/vacancies/${job.id}`)}
                    className="block w-full"
                  >
                    <RecommendedJobCard job={job} />
                  </button>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(job.id);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}