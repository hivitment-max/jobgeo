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
  { value: 'Junior', label: 'Junior (0-2 წელი)' },
  { value: 'Middle', label: 'Middle (2-5 წელი)' },
  { value: 'Senior', label: 'Senior (5-8 წელი)' },
  { value: 'Lead', label: 'Lead/Manager (8+ წელი)' },
];

const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'მშობლიური'];

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
  bio: string;
  skills: string[];
  languages: { name: string; level: string }[];
  portfolioUrl: string;
  linkedinUrl: string;
  githubUrl: string;
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
    bio: '',
    skills: [],
    languages: [],
    portfolioUrl: '',
    linkedinUrl: '',
    githubUrl: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [languageName, setLanguageName] = useState('');
  const [languageLevel, setLanguageLevel] = useState('B1');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [cvMessage, setCvMessage] = useState(false);
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
          bio: profileData.bio || '',
          skills: profileData.skills || [],
          languages: profileData.languages || [],
          portfolioUrl: profileData.portfolio_url || '',
          linkedinUrl: profileData.linkedin_url || '',
          githubUrl: profileData.github_url || '',
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      updateProfile({ skills: [...profile.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    updateProfile({ skills: profile.skills.filter((s) => s !== skill) });
  };

  const addLanguage = () => {
    if (languageName.trim()) {
      updateProfile({
        languages: [...profile.languages, { name: languageName.trim(), level: languageLevel }],
      });
      setLanguageName('');
    }
  };

  const removeLanguage = (index: number) => {
    updateProfile({
      languages: profile.languages.filter((_, i) => i !== index),
    });
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
      profile.skills.length > 0,
      profile.languages.length > 0,
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
          bio: profile.bio || null,
          skills: profile.skills,
          languages: profile.languages,
          portfolio_url: profile.portfolioUrl || null,
          linkedin_url: profile.linkedinUrl || null,
          github_url: profile.githubUrl || null,
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

      {/* Header - კომპაქტური */}
      <div 
        className="px-6 pt-4 pb-3 bg-white"
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
          
          <h1 className="text-base font-bold text-gray-900">პროფილის რედაქტირება</h1>
          
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

        {/* Completion Score - კომპაქტური */}
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

      {/* Form - კომპაქტური */}
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
                placeholder="Frontend Developer"
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-medium text-gray-600 mb-1 block">გამოცდილება</label>
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
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">ხელფასის მოლოდინი (₾)</label>
              <input
                type="text"
                value={profile.salaryExpectation}
                onChange={(e) => updateProfile({ salaryExpectation: e.target.value })}
                placeholder="მაგ: 3000-5000"
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">განათლება</label>
              <input
                type="text"
                value={profile.education}
                onChange={(e) => updateProfile({ education: e.target.value })}
                placeholder="ბაკალავრი კომპიუტერულ მეცნიერებაში"
                className="w-full bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>
          </div>
        </section>

        {/* უნარები */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            უნარები (Skills)
          </h2>
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="მაგ: React, TypeScript..."
                className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
              <button
                onClick={addSkill}
                className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors"
              >
                +
              </button>
            </div>

            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="w-3.5 h-3.5 rounded-full bg-emerald-200 flex items-center justify-center hover:bg-emerald-300 text-[10px]"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            )}

            {profile.skills.length === 0 && (
              <p className="text-[10px] text-gray-400 text-center py-1.5">
                დაამატე უნარები Enter-ით ან + ღილაკით
              </p>
            )}
          </div>
        </section>

        {/* ენები */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            ენები
          </h2>
          <div className="bg-white rounded-2xl p-3 shadow-sm">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={languageName}
                onChange={(e) => setLanguageName(e.target.value)}
                placeholder="ენა (მაგ: ინგლისური)"
                className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
              <select
                value={languageLevel}
                onChange={(e) => setLanguageLevel(e.target.value)}
                className="bg-gray-50 rounded-lg px-2 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              >
                {languageLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <button
                onClick={addLanguage}
                className="px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors"
              >
                +
              </button>
            </div>

            {profile.languages.length > 0 && (
              <div className="space-y-1.5">
                {profile.languages.map((lang, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">{lang.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                        {lang.level}
                      </span>
                    </div>
                    <button
                      onClick={() => removeLanguage(i)}
                      className="text-gray-400 hover:text-red-500 text-sm"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
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

        {/* დამატებითი */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
            დამატებითი (ოფციონალური)
          </h2>
          <div className="bg-white rounded-2xl p-3 space-y-2.5 shadow-sm">
            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">მოკლე ბიო</label>
              <textarea
                value={profile.bio}
                onChange={(e) => updateProfile({ bio: e.target.value })}
                placeholder="რამდენიმე წინადადება შენს შესახებ..."
                rows={2}
                maxLength={200}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200 resize-none"
              />
              <p className="text-[10px] text-gray-400 mt-0.5 text-right">
                {profile.bio.length}/200
              </p>
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">Portfolio URL</label>
              <input
                type="url"
                value={profile.portfolioUrl}
                onChange={(e) => updateProfile({ portfolioUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">LinkedIn</label>
              <input
                type="url"
                value={profile.linkedinUrl}
                onChange={(e) => updateProfile({ linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-medium text-gray-600 mb-1 block">GitHub</label>
              <input
                type="url"
                value={profile.githubUrl}
                onChange={(e) => updateProfile({ githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-gray-200"
              />
            </div>
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