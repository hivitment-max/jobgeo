'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Briefcase, Zap, Shield } from 'lucide-react';

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
  const Icon = slide.icon;
  const isLast = current === slides.length - 1;

  // Telegram-ის ინიციალიზაცია (მხოლოდ client-ზე)
  useEffect(() => {
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
        console.log('Telegram not available:', e);
      }
    }
  }, []);

  const handleNext = () => {
    // Haptic feedback (მხოლოდ Telegram-ში)
    if (typeof window !== 'undefined') {
      try {
        const { hapticFeedback } = require('@/lib/telegram');
        hapticFeedback('light');
      } catch (e) {
        // Haptic ხელმისაწვდომი არ არის
      }
    }

    if (isLast) {
      localStorage.setItem('jobsnap_onboarding_completed', 'true');
      router.push('/profile');
    } else {
      setCurrent(current + 1);
    }
  };

  const handleSkip = () => {
    // Haptic feedback
    if (typeof window !== 'undefined') {
      try {
        const { hapticFeedback } = require('@/lib/telegram');
        hapticFeedback('light');
      } catch (e) {
        // Haptic ხელმისაწვდომი არ არის
      }
    }

    localStorage.setItem('jobsnap_onboarding_completed', 'true');
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden">
      {/* ზედა ნაწილი - ლოგო + Skip */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 pt-6 safe-area-top">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">JOBSNAP</span>
        </div>
        <button
          onClick={handleSkip}
          className="text-gray-500 font-medium hover:text-gray-900 transition-colors"
        >
          გამოტოვება
        </button>
      </div>

      {/* ფოტო - ზედა 60% */}
      <div className="relative flex-1 min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={slide.image}
              alt={`Onboarding ${current + 1}`}
              className="w-full h-full object-contain object-top"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Frosted Glass ბანერი - ქვედა 40% */}
      <div className="relative h-[40vh]">
        {/* Frosted glass ეფექტი */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl border-t border-gray-200/50" />

        {/* კონტენტი */}
        <div className="relative h-full flex flex-col items-center justify-center px-8 pt-6 safe-area-bottom">
          {/* პროგრესის წერტილები */}
          <div className="flex gap-2 mb-6">
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
              className="text-3xl font-bold text-center text-gray-900 mb-3"
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
              className="text-base text-center text-gray-500 mb-8 max-w-xs leading-relaxed"
            >
              {slide.description}
            </motion.p>
          </AnimatePresence>

          {/* ღილაკები */}
          <div className="flex items-center gap-3 w-full max-w-sm">
            <button
              onClick={handleNext}
              className="flex-1 bg-gray-900 text-white rounded-2xl py-4 font-semibold text-base hover:bg-gray-800 transition-colors active:scale-95"
            >
              {isLast ? 'დაწყება' : 'შემდეგი'}
            </button>
            <button
              onClick={handleNext}
              className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors active:scale-95"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}