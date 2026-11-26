import { Job } from '@/data/mock-jobs';

interface Props {
  job: Job;
}

export default function RecommendedJobCard({ job }: Props) {
  return (
    <div className={`w-full rounded-2xl ${job.bgColor || 'bg-gray-50'} p-3 flex flex-col items-center text-center transition-transform active:scale-95`}>
      {/* Company logo - პატარა */}
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${job.companyColor} flex items-center justify-center shadow-sm mb-2`}>
        <span className="text-white font-bold text-sm">{job.companyInitial}</span>
      </div>

      {/* Title - პატარა */}
      <h3 className="text-gray-900 font-semibold text-xs leading-tight mb-0.5 line-clamp-1">
        {job.title}
      </h3>

      {/* Company */}
      <p className="text-gray-600 text-[10px] mb-1 line-clamp-1">{job.company}</p>

      {/* Salary */}
      <p className="text-gray-900 font-bold text-xs">
        {job.salary}
      </p>
    </div>
  );
}