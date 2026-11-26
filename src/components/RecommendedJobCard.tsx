import { Job } from '@/data/mock-jobs';

interface Props {
  job: Job;
}

export default function RecommendedJobCard({ job }: Props) {
  return (
    <div className="flex-shrink-0 w-[140px] rounded-3xl bg-gray-50 p-4 flex flex-col items-center text-center">
      {/* Company logo */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${job.companyColor} flex items-center justify-center shadow-md mb-3`}>
        <span className="text-white font-bold text-xl">{job.companyInitial}</span>
      </div>

      {/* Title */}
      <h3 className="text-gray-900 font-bold text-sm leading-tight mb-1">
        {job.title}
      </h3>

      {/* Company */}
      <p className="text-gray-500 text-xs mb-2">{job.company}</p>

      {/* Salary */}
      <p className="text-gray-900 font-semibold text-sm">
        {job.salary}
      </p>
    </div>
  );
}