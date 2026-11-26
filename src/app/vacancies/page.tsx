'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Bell, Search } from 'lucide-react';
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
          <div className="flex items-center gap-2">
            {/* ლოგოს ხატულა - 40px */}
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            
            {/* სახელი + სლოგანი - 40px სიმაღლეზე */}
            <div className="flex flex-col justify-center h-10">
              <span className="text-xl font-bold text-gray-900 leading-tight">JOBSNAP</span>
              <span className="text-xs text-gray-500 leading-tight">იპოვე სამუშაო</span>
            </div>
          </div>
          
          {/* Search + Profile */}
          <div className="flex items-center gap-3">
            {/* Search ღილაკი */}
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Profile ზარით */}
            <button className="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.firstName?.charAt(0) || 'J'}
              </span>
              {/* ზარი მარჯვენა ზედა კუთხეში */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-white text-xs font-bold">3</span>
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

      {/* Recommended Jobs */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">რეკომენდებული</h2>
          <button className="text-sm text-emerald-500 font-medium">
            ყველა →
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {recommendedJobs.map((job) => (
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