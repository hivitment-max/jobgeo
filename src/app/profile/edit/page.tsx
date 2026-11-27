'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Briefcase, Upload, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const cities = [
  'თბილისი', 'ბათუმი', 'ქუთაისი', 'რუსთავი', 'გორი',
  'ზუგდიდი', 'ფოთი', 'ხაშური', 'სამტრედია', 'სენაკი',
  'ზესტაფონი', 'თელავი', 'ახალციხე', 'ოზურგეთი', 'სხვა',
];

const experienceLevels = [
  { value: 'Junior', label: '0-2 წელი' },
  { value: 'Middle', label: '2-5 წელი' },
  { value: 'Senior', label: '5-8 წელი' },
  { value: 'Lead', label: '8+ წელი' },
];

const jobTypes = [
  { value: 'full-time', label: 'სრული განაკვეთი' },
  { value: 'part-time', label: 'ნახევარი განაკვეთი' },
  { value: 'remote', label: 'დისტანციური' },
  { value: 'freelance', label: 'ფრილანსი' },
  { value: 'contract', label: 'კონტრაქტი' },
];

interface Profile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  profession: string;
  experience: string;
  salaryExpectation: string;
  city: string;
  education: string;
  jobType: string;
  bio: string;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    profession: '',
    experience: '',
    salaryExpectation: '',
    city: '',
    education: '',
    jobType: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [cvMessage, setCvMessage] = useState(false);

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

        const telegramUser = tg.initDataUnsafe?.user;
        if (telegramUser) {
          loadOrCreateUser(telegramUser.id, telegramUser.username);
        }
      }
    }
  }, []);

  const loadOrCreateUser = async (telegramId: number, username?: string) => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('telegram_id', telegramId)
        .single();

      let currentUserId = existingUser?.id;

      if (!currentUserId) {
        const { data: newUser } = await supabase
          .from('users')
          .insert({ telegram_id: telegramId, username: username || null })
          .select('id')
          .single();
        currentUserId = newUser?.id;
      }

      setUserId(currentUserId);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUserId)
        .single();

      if (profileData) {
        setProfile({
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          phone: profileData.phone || '',
          email: profileData.email || '',
          profession: profileData.profession || '',
          experience: profileData.experience || '',
          salaryExpectation: profileData.salary_expectation || '',
          city: profileData.city || '',
          education: profileData.education || '',
          jobType: profileData.job_type || '',
          bio: profileData.bio || '',
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const calculateCompletionScore = () => {
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.phone,
      profile.email,
      profile.profession,
      profile.experience,
      profile.city,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const handleSave = async () => {
    if (!userId) {
      alert('მომხმარებელი ვერ მოიძებნა');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          first_name: profile.firstName,
          last_name: profile.lastName,
          phone: profile.phone,
          email: profile.email,
          profession: profile.profession,
          experience: profile.experience || null,
          salary_expectation: profile.salaryExpectation || null,
          city: profile.city,
          education: profile.education || null,
          job_type: profile.jobType || null,
          bio: profile.bio || null,
          completion_score: calculateCompletionScore(),
        });

      if (error) throw error;

      setSaved(true);
      setTimeout(() => router.back(), 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('შეცდომა შენახვისას');
    } finally {
      setSaving(false);
    }
  };

  const completionScore = calculateCompletionScore();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* ლოგო - Telegram-ის ღილაკებს შორის */}
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
        <div className="w-5 h-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-md flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-3 h-3 text-emerald-400" />
        </div>
        <span className="text-sm font-bold text-gray-900 whitespace-nowrap">JOBSNAP</span>
      </div>

      {/* Header */}
      <div 
        className="px-5 pt-4 pb-3 bg-white"
        style={{ 
          paddingTop: 'calc(var(--tg-content-safe-area-inset-top, 56px) + var(--tg-safe-area-inset-top, 0px) + 20px)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-gray-900" />
          </button>
          
          <h1 className="text-base font-bold text-gray-900 whitespace-nowrap">პროფილი</h1>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <span className="text-white text-xs">✓</span>
            ) : (
              <Save className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Completion Score */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs font-bold text-emerald-500">{completionScore}%</span>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-3 space-y-4">
        
        {/* პირადი ინფორმაცია */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            პირადი ინფორმაცია
          </h2>
          <div className="bg-white rounded-2xl p-3 space-y-2.5 shadow-sm">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-medium text-gray-600 mb-1 block">სახელი *</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => updateProfile({ firstName: e.target.value })}
                  placeholder="გიორგი"
                  className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-gray-600 mb-1 block">გვარი *</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => updateProfile({ lastName: e.target.value })}
                  placeholder="მელია"
                  className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">ტელეფონი *</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => updateProfile({ phone: e.target.value })}
                placeholder="+995 555 123 456"
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">Email *</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile({ email: e.target.value })}
                placeholder="giorgi@email.com"
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>
          </div>
        </section>

        {/* პროფესიული ინფო */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            პროფესიული ინფორმაცია
          </h2>
          <div className="bg-white rounded-2xl p-3 space-y-2.5 shadow-sm">
            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">პროფესია/სპეციალობა *</label>
              <input
                type="text"
                value={profile.profession}
                onChange={(e) => updateProfile({ profession: e.target.value })}
                placeholder="მაგ: მძღოლი, მზარეული, დიზაინერი..."
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-medium text-gray-600 mb-1 block">გამოცდილება *</label>
                <select
                  value={profile.experience}
                  onChange={(e) => updateProfile({ experience: e.target.value })}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
                >
                  <option value="">აირჩიე</option>
                  {experienceLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-medium text-gray-600 mb-1 block">ქალაქი *</label>
                <select
                  value={profile.city}
                  onChange={(e) => updateProfile({ city: e.target.value })}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
                >
                  <option value="">აირჩიე</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">სამუშაოს ტიპი</label>
              <select
                value={profile.jobType}
                onChange={(e) => updateProfile({ jobType: e.target.value })}
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              >
                <option value="">აირჩიე</option>
                {jobTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">ხელფასის მოლოდინი (₾)</label>
              <input
                type="text"
                value={profile.salaryExpectation}
                onChange={(e) => updateProfile({ salaryExpectation: e.target.value })}
                placeholder="მაგ: 1500-2500"
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">განათლება</label>
              <input
                type="text"
                value={profile.education}
                onChange={(e) => updateProfile({ education: e.target.value })}
                placeholder="მაგ: საშუალო, ბაკალავრი..."
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>
          </div>
        </section>

        {/* მოკლე ბიო */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            შენს შესახებ
          </h2>
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <textarea
              value={profile.bio}
              onChange={(e) => updateProfile({ bio: e.target.value })}
              placeholder="მოკლედ აღწერე საკუთარი თავი, გამოცდილება და რას ეძებ..."
              rows={3}
              maxLength={300}
              className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200 resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">
              {profile.bio.length}/300
            </p>
          </div>
        </section>

        {/* რეზიუმე (CV) - მიუწვდომელი */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            რეზიუმე (CV)
          </h2>
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <div
              onClick={() => {
                setCvMessage(true);
                setTimeout(() => setCvMessage(false), 3000);
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-not-allowed opacity-60 bg-gray-50"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center mb-2">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs font-semibold text-gray-500 mb-0.5">
                  ატვირთე რეზიუმე (PDF)
                </p>
                <p className="text-[10px] text-gray-400">
                  მაქსიმუმ 5MB
                </p>
              </div>
            </div>

            {cvMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 flex items-start gap-1.5"
              >
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-medium text-amber-900">
                    ჯერჯერობით მიუწვდომელია
                  </p>
                  <p className="text-[10px] text-amber-700">
                    CV ატვირთვის ფუნქცია მალე დაემატება
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Save Button */}
        <div className="sticky bottom-4 px-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gray-900 text-white rounded-xl py-3.5 font-semibold text-sm hover:bg-gray-800 transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ინახება...
              </>
            ) : saved ? (
              <>
                <span>✓</span>
                შენახულია!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                პროფილის შენახვა
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}