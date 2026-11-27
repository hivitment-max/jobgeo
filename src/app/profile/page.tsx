'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, 
  User, 
  Bell, 
  Globe, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Briefcase,
  MapPin,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

const menuItems = [
  { icon: User, label: 'პროფილის რედაქტირება', path: '/profile/edit', color: 'text-emerald-500' },
  { icon: Bell, label: 'შეტყობინებები', path: '/settings/notifications', color: 'text-blue-500' },
  { icon: Globe, label: 'ენა', path: '/settings/language', color: 'text-purple-500' },
  { icon: Shield, label: 'კონფიდენციალურობა', path: '/settings/privacy', color: 'text-orange-500' },
  { icon: HelpCircle, label: 'დახმარება', path: '/help', color: 'text-cyan-500' },
];

export default function ProfilePage() {
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
        tg.setBackgroundColor('#F9FAFB');

        const savedUser = localStorage.getItem('jobsnap_telegram_user');
        if (savedUser) setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        try { tg.HapticFeedback.impactOccurred('heavy'); } catch (e) {}
      }
      localStorage.removeItem('jobsnap_telegram_user');
      localStorage.removeItem('jobsnap_onboarding_completed');
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-6 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-2xl">
                {user?.firstName?.charAt(0) || 'J'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user?.firstName || 'სტუმარი'} {user?.lastName || ''}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                @{user?.username || 'jobsnap_user'}
              </p>
            </div>
            <button
              onClick={() => router.push('/profile/edit')}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-500 mt-1">განაცხადი</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-xs text-gray-500 mt-1">რჩეული</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-xs text-gray-500 mt-1">შეტყობინება</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          სწრაფი წვდომა
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push('/favorites')}
            className="bg-white rounded-2xl p-4 flex flex-col items-start shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center mb-2">
              <Briefcase className="w-5 h-5 text-pink-500" />
            </div>
            <span className="text-sm font-semibold text-gray-900">ჩემი განაცხადები</span>
            <span className="text-xs text-gray-500 mt-0.5">12 აქტიური</span>
          </button>
          <button
            onClick={() => router.push('/favorites')}
            className="bg-white rounded-2xl p-4 flex flex-col items-start shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm font-semibold text-gray-900">ლოკაცია</span>
            <span className="text-xs text-gray-500 mt-0.5">{user?.city || 'თბილისი'}</span>
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          პარამეტრები
        </h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => router.push(item.path)}
                className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="flex-1 text-left text-sm font-medium text-gray-900">
                  {item.label}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-500 rounded-2xl py-4 font-semibold text-base flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          გასვლა
        </button>
      </div>

      {/* App Version */}
      <div className="text-center mt-6 mb-4">
        <p className="text-xs text-gray-400">JOBSNAP v1.0.0</p>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}