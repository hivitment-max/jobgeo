'use client';

import { Home, Heart, MessageCircle, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around px-4 py-2 pb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.path;
          
          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="flex flex-col items-center gap-1 flex-1"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-emerald-500' : 'text-gray-400'
                }`}
                fill={isActive ? 'currentColor' : 'none'}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-emerald-500' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}