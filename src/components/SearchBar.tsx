import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="ძიება..."
        className="w-full bg-gray-100 rounded-2xl py-4 pl-12 pr-4 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
      />
    </div>
  );
}