import { Bookmark } from 'lucide-react';
import { Job } from '@/data/mock-jobs';

interface Props {
  job: Job;
}

export default function FeaturedJobCard({ job }: Props) {
  return (
    <div className="relative flex-shrink-0 w-[280px] h-[180px] rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-5 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white" />
        <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white" />
      </div>

      {/* Bookmark */}
      <button className="absolute top-4 right-4 z-10">
        <Bookmark className="w-5 h-5 text-white/80" />
      </button>

      {/* Company logo */}
      <div className="relative z-10 flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.companyColor} flex items-center justify-center shadow-lg`}>
          <span className="text-white font-bold text-lg">{job.companyInitial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight truncate">
            {job.title}
          </h3>
          <p className="text-white/80 text-sm">{job.company}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="relative z-10 flex gap-2 mb-4">
        {job.tags.map((tag, i) => (
          <span
            key={i}
            className={`${tag.color} backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full`}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Location & Salary */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-white text-sm font-medium">
          📍 {job.city}
        </span>
        <span className="text-white text-sm font-bold">
          {job.salary}
        </span>
      </div>
    </div>
  );
}