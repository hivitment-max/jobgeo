'use client';

import { Home, Heart, MessageCircle, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const tabs = [
  { icon: Home, label: 'მთავარი', path: '/vacancies' },
  { icon: Heart, label: 'რჩეული', path: '/favorites' },
  { icon: MessageCircle, label: 'შეტყობინებები', path: '/messages' },
  { icon: User, label: 'პროფილი', path: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Frosted glass ეფექტი */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50" />
      
      {/* კონტენტი */}
      <div className="relative flex items-center justify-around px-4 py-2 pb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="relative flex flex-col items-center gap-1 flex-1 py-1"
            >
              {/* Active indicator - წერტილი */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -top-1 w-1 h-1 bg-emerald-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Icon container */}
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-emerald-500/10' : 'bg-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-emerald-500' : 'text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>
              </div>
              
              {/* Label */}
              <motion.span
                animate={{
                  color: isActive ? '#10B981' : '#9CA3AF',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: isActive ? '11px' : '10px',
                }}
                transition={{ duration: 0.2 }}
                className="leading-none"
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </div>
  );
}