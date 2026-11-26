export interface Job {
    id: string;
    title: string;
    company: string;
    companyInitial: string;
    companyColor: string;
    city: string;
    salary: string;
    tags: { label: string; color: string }[];
    featured?: boolean;
    recommended?: boolean;
  }
  
  export const featuredJobs: Job[] = [
    {
      id: '1',
      title: 'Product Designer',
      company: 'Google',
      companyInitial: 'G',
      companyColor: 'from-red-500 to-yellow-500',
      city: 'თბილისი',
      salary: '5000-8000 ₾',
      tags: [
        { label: 'დიზაინი', color: 'bg-white/20' },
        { label: 'Full-Time', color: 'bg-white/20' },
        { label: 'Junior', color: 'bg-white/20' },
      ],
      featured: true,
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'Microsoft',
      companyInitial: 'M',
      companyColor: 'from-blue-500 to-cyan-500',
      city: 'ბათუმი',
      salary: '4000-7000 ₾',
      tags: [
        { label: 'IT', color: 'bg-white/20' },
        { label: 'Full-Time', color: 'bg-white/20' },
        { label: 'Middle', color: 'bg-white/20' },
      ],
      featured: true,
    },
    {
      id: '3',
      title: 'Marketing Manager',
      company: 'Apple',
      companyInitial: 'A',
      companyColor: 'from-gray-700 to-gray-900',
      city: 'თბილისი',
      salary: '3500-6000 ₾',
      tags: [
        { label: 'მარკეტინგი', color: 'bg-white/20' },
        { label: 'Full-Time', color: 'bg-white/20' },
        { label: 'Senior', color: 'bg-white/20' },
      ],
      featured: true,
    },
  ];
  
  export const recommendedJobs: Job[] = [
    {
      id: '4',
      title: 'UX Designer',
      company: 'Dribbble',
      companyInitial: 'D',
      companyColor: 'from-pink-500 to-rose-500',
      city: 'ქუთაისი',
      salary: '2500-4000 ₾',
      tags: [],
      recommended: true,
    },
    {
      id: '5',
      title: 'Sr Engineer',
      company: 'Facebook',
      companyInitial: 'F',
      companyColor: 'from-blue-600 to-blue-800',
      city: 'თბილისი',
      salary: '6000-9000 ₾',
      tags: [],
      recommended: true,
    },
    {
      id: '6',
      title: 'Data Analyst',
      company: 'Amazon',
      companyInitial: 'A',
      companyColor: 'from-orange-500 to-yellow-500',
      city: 'რუსთავი',
      salary: '3000-5000 ₾',
      tags: [],
      recommended: true,
    },
    {
      id: '7',
      title: 'HR Specialist',
      company: 'Tesla',
      companyInitial: 'T',
      companyColor: 'from-red-600 to-red-800',
      city: 'თბილისი',
      salary: '2000-3500 ₾',
      tags: [],
      recommended: true,
    },
    {
      id: '8',
      title: 'Product Manager',
      company: 'Spotify',
      companyInitial: 'S',
      companyColor: 'from-green-500 to-green-700',
      city: 'ბათუმი',
      salary: '4500-7000 ₾',
      tags: [],
      recommended: true,
    },
    {
      id: '9',
      title: 'DevOps Engineer',
      company: 'Netflix',
      companyInitial: 'N',
      companyColor: 'from-red-500 to-red-700',
      city: 'თბილისი',
      salary: '5000-8000 ₾',
      tags: [],
      recommended: true,
    },
  ];