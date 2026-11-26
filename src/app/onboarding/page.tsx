'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Zap, Shield } from 'lucide-react';

const slides = [
  {
    image: '/onboarding/onboarding-1.png',
    icon: Briefcase,
    title: 'იპოვე შენი',
    highlight: 'იდეალური',
    titleEnd: 'სამუშაო',
    description: 'AI შეარჩევს ვაკანსიებს შენი უნარების და გამოცდილების მიხედვით',
  },
  {
    image: '/onboarding/onboarding-2.png',
    icon: Zap,
    title: 'განაცხადი',
    highlight: '1 წამში',
    titleEnd: '',
    description: 'აღარ დაგჭირდება რეზიუმეს ხელახლა ატვირთვა — ერთი შეხებით',
  },
  {
    image: '/onboarding/onboarding-3.png',
    icon: Shield,
    title: '',
    highlight: 'გამჭვირვალე',
    titleEnd: 'და საიმედო',
    description: 'ყველა დამსაქმებელი ვერიფიცირებულია და შეფასებული სხვა კანდიდატებისგან',
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const slide = slides[current];
  const isLast = current === slides.length - 1;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    
    tg.ready();
    tg.expand();
    
    if (tg.isVersionAtLeast && tg.isVersionAtLeast('8.0')) {
      const platform = tg.platform?.toLowerCase() || '';
      if (['android', 'ios'].includes(platform)) {
        try {
          tg.requestFullscreen();
        } catch (e) {
          console.log('requestFullscreen failed:', e);
        }
      }
    }
    
    tg.setHeaderColor('#ffffff');
    tg.setBackgroundColor('#ffffff');
    
    const user = tg.initDataUnsafe?.user;
    if (user) {
      localStorage.setItem('jobsnap_telegram_user', JSON.stringify({
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        languageCode: user.language_code || 'ka',
      }));
    }
  }, []);

  const handleNext = () => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        try { tg.HapticFeedback.impactOccurred('light'); } catch (e) {}
      }
    }

    if (isLast) {
      localStorage.setItem('jobsnap_onboarding_completed', 'true');
      router.push('/profile');
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col relative overflow-hidden">
      {/* ლოგოს ბანერი - იდეალურად ცენტრში */}
      <div 
        className="fixed z-40 flex items-center gap-1.5 rounded-full"
        style={{ 
          top: 'calc(var(--tg-safe-area-inset-top, 0px) + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '36px',
          padding: '0 14px',
          backgroundColor: '#E8E8E8'
        }}
      >
        <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-md flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">JOBSNAP</span>
      </div>

      {/* ფოტო - გადიდებული */}
      <div 
        className="flex-shrink-0 flex items-center justify-center py-2"
        style={{ 
          marginTop: 'calc(var(--tg-content-safe-area-inset-top, 56px) + var(--tg-safe-area-inset-top, 0px) + 16px)',
          height: '260px'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <img
              src={slide.image}
              alt={`Onboarding ${current + 1}`}
              className="object-contain"
              style={{ maxHeight: '260px', width: 'auto' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Frosted Glass ბანერი - დარჩენილი ადგილი */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 bg-white/95 backdrop-blur-2xl border-t border-gray-200/50">
        {/* პროგრესის წერტილები */}
        <div className="flex gap-2 mb-3">
          {slides.map((_, i) => (
            <motion.div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
              animate={{ width: i === current ? 32 : 6 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* სათაური */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-center text-gray-900 mb-2 leading-tight"
          >
            {slide.title && <span>{slide.title} </span>}
            {slide.highlight && (
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                {slide.highlight}
              </span>
            )}
            {slide.titleEnd && <span> {slide.titleEnd}</span>}
          </motion.h1>
        </AnimatePresence>

        {/* აღწერა */}
        <AnimatePresence mode="wait">
          <motion.p
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-base text-center text-gray-600 mb-5 max-w-sm leading-relaxed px-4"
          >
            {slide.description}
          </motion.p>
        </AnimatePresence>

        {/* ღილაკი - დაცული ქვედა padding-ით */}
        <div className="w-full max-w-sm px-4 pb-10">
          <button
            onClick={handleNext}
            className="w-full bg-gray-900 text-white rounded-2xl py-4 font-semibold text-base hover:bg-gray-800 transition-colors active:scale-95"
          >
            {isLast ? 'დაწყება' : 'შემდეგი'}
          </button>
        </div>
      </div>
    </div>
  );
}