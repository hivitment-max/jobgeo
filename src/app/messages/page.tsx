'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Search, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

interface Message {
  id: string;
  company: string;
  companyInitial: string;
  companyColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  vacancy: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    company: 'Google',
    companyInitial: 'G',
    companyColor: 'from-red-500 to-yellow-500',
    lastMessage: 'გამარჯობა! თქვენი განაცხადი მიღებულია...',
    time: '14:30',
    unread: 2,
    vacancy: 'Product Designer',
  },
  {
    id: '2',
    company: 'Microsoft',
    companyInitial: 'M',
    companyColor: 'from-blue-500 to-cyan-500',
    lastMessage: 'გსურთ გასაუბრების დანიშვნა?',
    time: '12:15',
    unread: 1,
    vacancy: 'Frontend Developer',
  },
  {
    id: '3',
    company: 'Apple',
    companyInitial: 'A',
    companyColor: 'from-gray-700 to-gray-900',
    lastMessage: 'მადლობა ინტერესისთვის!',
    time: 'გუშინ',
    unread: 0,
    vacancy: 'Marketing Manager',
  },
  {
    id: '4',
    company: 'Spotify',
    companyInitial: 'S',
    companyColor: 'from-green-500 to-green-700',
    lastMessage: 'თქვენი რეზიუმე მივიღეთ',
    time: 'ორშაბათი',
    unread: 0,
    vacancy: 'Product Manager',
  },
];

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

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

  const totalUnread = messages.reduce((sum, m) => sum + m.unread, 0);

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
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">შეტყობინებები</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalUnread > 0 ? `${totalUnread} წაუკითხავი` : 'ყველა წაკითხულია'}
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="px-6 mt-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              შეტყობინებები არ არის
            </h2>
            <p className="text-sm text-gray-500 text-center max-w-xs">
              განაცხადის გაგზავნის შემდეგ დამსაქმებელი დაგიკავშირდება
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <motion.button
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => router.push(`/messages/${msg.id}`)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:bg-gray-50 transition-colors"
              >
                {/* Company Logo */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${msg.companyColor} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <span className="text-white font-bold text-lg">{msg.companyInitial}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {msg.company}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {msg.time}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-500 font-medium mb-1">
                    {msg.vacancy}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {msg.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {msg.unread > 0 && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {msg.unread}
                    </span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}