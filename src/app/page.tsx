import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          🚀 JobGeo
        </h1>
        <p className="text-xl text-white/70 mb-8">
          სამუშაოს მაძიებელი ბოტი საქართველოში
        </p>
        <Link
          href="/test-supabase"
          className="inline-block bg-white text-purple-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/90 transition-all"
        >
          🧪 ტესტური გვერდი (ვაკანსიები)
        </Link>
      </div>
    </div>
  );
}