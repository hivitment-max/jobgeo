import { Suspense } from 'react';
import VacancyDetailClient from './VacancyDetailClient';

export default function VacancyDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VacancyDetailClient />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 animate-pulse mb-4" />
      <div className="w-40 h-4 bg-gray-200 rounded-full animate-pulse mb-2" />
      <div className="w-24 h-3 bg-gray-200 rounded-full animate-pulse" />
    </div>
  );
}