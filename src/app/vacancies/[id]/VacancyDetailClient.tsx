'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark, MapPin, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { featuredJobs, recommendedJobs, Job } from '@/data/mock-jobs';

const tabs = [
  { id: 'description', label: 'აღწერა' },
  { id: 'requirements', label: 'მოთხოვნები' },
  { id: 'about', label: 'კომპანია' },
  { id: 'reviews', label: 'შეფასებები' },
];

export default function VacancyDetailClient() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('description');
  const [job, setJob] = useState<Job | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // ვაკანსიის მოძიება mock data-დან
    const allJobs = [...featuredJobs, ...recommendedJobs];
    const found = allJobs.find((j) => j.id === params.id);
    if (found) setJob(found);

    // Telegram ინიციალიზაცია
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
        tg.setHeaderColor('#10B981');
        tg.setBackgroundColor('#F9FAFB');
      }
    }
  }, [params.id]);

  const handleApply = () => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        try { tg.HapticFeedback.impactOccurred('medium'); } catch (e) {}
      }
    }
    alert('განაცხადი გაიგზავნა! ✅');
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">ვაკანსია ვერ მოიძებნა</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header - Back + Bookmark */}
      <div 
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ 
          paddingTop: 'calc(var(--tg-content-safe-area-inset-top, 56px) + var(--tg-safe-area-inset-top, 0px) + 16px)'
        }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-900" />
        </button>
        <button
          onClick={() => {
            setIsBookmarked(!isBookmarked);
            if (typeof window !== 'undefined') {
              const tg = window.Telegram?.WebApp;
              if (tg?.HapticFeedback) {
                try { tg.HapticFeedback.selectionChanged(); } catch (e) {}
              }
            }
          }}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isBookmarked ? 'text-emerald-500 fill-emerald-500' : 'text-gray-700'
            }`}
          />
        </button>
      </div>

      {/* Gradient Header Card */}
      <div className="relative mx-4 mt-20 rounded-[32px] bg-gradient-to-br from-emerald-500 to-cyan-500 p-6 pb-8 overflow-hidden shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="white" />
                <path d="M 10 10 L 20 10 L 15 20 Z" fill="white" opacity="0.5" />
                <rect x="40" y="40" width="10" height="10" fill="white" opacity="0.3" rx="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        {/* Company Logo */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${job.companyColor} flex items-center justify-center shadow-2xl mb-4 border-4 border-white/30`}
          >
            <span className="text-white font-black text-3xl">{job.companyInitial}</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-1">
            {job.title}
          </h1>
          <p className="text-white/80 text-sm mb-5">
            {job.company}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {job.tags.map((tag, i) => (
              <span
                key={i}
                className={`${tag.color} backdrop-blur-sm text-white text-xs px-4 py-1.5 rounded-full font-medium`}
              >
                {tag.label}
              </span>
            ))}
          </div>

          {/* Location & Salary */}
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/80" />
              <span className="text-white text-sm font-medium">
                {job.city}
              </span>
            </div>
            <div className="text-white text-sm font-bold">
              {job.salary}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            >
              <span
                className={`${
                  activeTab === tab.id
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-4">
        {activeTab === 'description' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-sm leading-relaxed"
          >
            {job.description || 'აღწერა ხელმისაწვდომი არ არის.'}
          </motion.div>
        )}

        {activeTab === 'requirements' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {job.requirements?.map((req, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0" />
                <p className="text-gray-600 text-sm leading-relaxed">
                  {req}
                </p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-sm leading-relaxed"
          >
            {job.about || 'კომპანიის შესახებ ინფორმაცია ხელმისაწვდომი არ არის.'}
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {[
              { name: 'გიორგი მ.', rating: 5, text: 'შესანიშნავი კომპანია, კარგი გუნდი და პროფესიონალური გარემო.' },
              { name: 'ნინო კ.', rating: 4, text: 'კარგი სამუშაო პირობები, მაგრამ ხელფასი შეიძლება უკეთესი იყოს.' },
            ].map((review, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{review.name}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`w-3 h-3 ${
                          j < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Apply Button - Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-8 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <button
          onClick={handleApply}
          className="w-full bg-gray-900 text-white rounded-2xl py-4 font-semibold text-base hover:bg-gray-800 transition-colors active:scale-95 shadow-xl"
        >
          განაცხადი
        </button>
      </div>
    </div>
  );
}