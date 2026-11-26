'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Search } from 'lucide-react';
import FeaturedJobCard from '@/components/FeaturedJobCard';
import RecommendedJobCard from '@/components/RecommendedJobCard';
import BottomNav from '@/components/BottomNav';
import { featuredJobs, recommendedJobs } from '@/data/mock-jobs';

export default function VacanciesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
    }
  }, []);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div 
        className="px-6 pt-6 pb-4 bg-white"
        style={{ 
          paddingTop: 'calc(var(--tg-content-safe-area-inset-top, 56px) + var(--tg-safe-area-inset-top, 0px) + 16px)'
        }}
      >
        {/* ზედა ხაზი: ლოგო + სახელი/სლოგანი + Search + Profile */}
        <div className="flex items-center justify-between">
          {/* ლოგო + ტექსტი - პროფილის წრის სიმაღლეზე (40px) */}
          <div className="flex items-center gap-2.5">
            {/* ლოგოს ხატულა - 40px, მუქი gradient */}
            <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
              <Zap className="w-5 h-5 text-emerald-400" fill="currentColor" />
            </div>
            
            {/* სახელი + სლოგანი - 40px სიმაღლეზე */}
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
          
          {/* Search + Profile */}
          <div className="flex items-center gap-3">
            {/* Search ღილაკი */}
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Profile ზარით */}
            <button className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {user?.firstName?.charAt(0) || 'J'}
              </span>
              {/* ზარი მარჯვენა ზედა კუთხეში */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-[10px] font-bold">3</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="px-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">რჩეული ვაკანსიები</h2>
          <button className="text-sm text-emerald-500 font-medium">
            ყველა →
          </button>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {featuredJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => router.push(`/vacancies/${job.id}`)}
              className="text-left"
            >
              <FeaturedJobCard job={job} />
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Jobs - 3 ბანერი ერთ ხაზზე */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">რეკომენდებული</h2>
          <button className="text-sm text-emerald-500 font-medium">
            ყველა →
          </button>
        </div>

        {/* 3-იანი Grid */}
        <div className="grid grid-cols-3 gap-3">
          {recommendedJobs.slice(0, 6).map((job) => (
            <button
              key={job.id}
              onClick={() => router.push(`/vacancies/${job.id}`)}
              className="text-left"
            >
              <RecommendedJobCard job={job} />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}