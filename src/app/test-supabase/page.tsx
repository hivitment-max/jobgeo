'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabasePage() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVacancies() {
      try {
        const { data, error } = await supabase
          .from('vacancies')
          .select('*')
          .eq('status', 'active');

        if (error) throw error;
        setVacancies(data || []);
      } catch (err: any) {
        setError(err.message);
      }
    }

    fetchVacancies();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">🧪 Supabase კავშირის ტესტი</h1>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-400">❌ შეცდომა: {error}</p>
        </div>
      )}

      {vacancies.length === 0 && !error && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-400">⏳ იტვირთება...</p>
        </div>
      )}

      <div className="space-y-4">
        {vacancies.map((vacancy) => (
          <div key={vacancy.id} className="bg-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-2">{vacancy.title}</h2>
            <p className="text-white/70 mb-2">{vacancy.description}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-green-400">💰 {vacancy.salary_min}-{vacancy.salary_max}₾</span>
              <span className="text-blue-400">📍 {vacancy.city}</span>
              <span className="text-purple-400">🏢 {vacancy.job_type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}