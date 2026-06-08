'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { jobApi } from '@/lib/api';
import { JobPosting } from '@/types';

type SortOption = 'newest' | 'salary-high' | 'salary-low';

const defaultFilters = {
  search: '',
  location: 'all',
  jobType: 'all',
  experienceLevel: 'all',
  sort: 'newest' as SortOption,
};

const fallbackJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Frontend Developer React/Next.js',
    description: 'Xây dựng giao diện tuyển dụng hiện đại, tối ưu trải nghiệm người dùng và hiệu năng.',
    company_id: 'company-1',
    salary_min: 20000000,
    salary_max: 35000000,
    location: 'Ho Chi Minh City',
    job_type: 'Full-time',
    experience_level: 'Mid-level',
    skills_required: ['React', 'Next.js', 'TypeScript'],
    applications_count: 18,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Product Marketing Specialist',
    description: 'Phối hợp team sản phẩm, xây dựng chiến dịch tăng trưởng và nội dung chuyển đổi.',
    company_id: 'company-2',
    salary_min: 18000000,
    salary_max: 28000000,
    location: 'Hà Nội',
    job_type: 'Hybrid',
    experience_level: 'Mid-level',
    skills_required: ['SEO', 'Content', 'Analytics'],
    applications_count: 12,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    description: 'Thiết kế hệ thống giao diện, prototype và trải nghiệm người dùng cho sản phẩm số.',
    company_id: 'company-3',
    salary_min: 15000000,
    salary_max: 25000000,
    location: 'Đà Nẵng',
    job_type: 'Remote',
    experience_level: 'Mid-level',
    skills_required: ['Figma', 'Design System', 'Prototyping'],
    applications_count: 9,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'HR Executive',
    description: 'Tuyển dụng, phỏng vấn, onboarding và đồng hành cùng trải nghiệm nhân sự.',
    company_id: 'company-4',
    salary_min: 14000000,
    salary_max: 22000000,
    location: 'Ho Chi Minh City',
    job_type: 'Full-time',
    experience_level: 'Entry-level',
    skills_required: ['Recruitment', 'Interview', 'Onboarding'],
    applications_count: 22,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function formatSalary(min: number, max: number) {
  const format = (value: number) =>
    new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value / 1000000);
  return `${format(min)} - ${format(max)} triệu`;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobApi.getAll();
      setJobs(Array.isArray(response.data) && response.data.length > 0 ? response.data : fallbackJobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError('Không thể tải danh sách việc làm từ máy chủ. Đang hiển thị dữ liệu mẫu.');
      setJobs(fallbackJobs);
    } finally {
      setLoading(false);
    }
  };

  const options = useMemo(() => {
    const locations = Array.from(new Set(jobs.map((job) => job.location))).filter(Boolean);
    const jobTypes = Array.from(new Set(jobs.map((job) => job.job_type))).filter(Boolean);
    const experienceLevels = Array.from(new Set(jobs.map((job) => job.experience_level))).filter(Boolean);

    return { locations, jobTypes, experienceLevels };
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const result = jobs.filter((job) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        job.title.toLowerCase().includes(normalizedSearch) ||
        job.location.toLowerCase().includes(normalizedSearch) ||
        job.company_id.toLowerCase().includes(normalizedSearch) ||
        job.skills_required.some((skill) => skill.toLowerCase().includes(normalizedSearch));

      const matchesLocation = filters.location === 'all' || job.location === filters.location;
      const matchesJobType = filters.jobType === 'all' || job.job_type === filters.jobType;
      const matchesExperience =
        filters.experienceLevel === 'all' || job.experience_level === filters.experienceLevel;

      return matchesSearch && matchesLocation && matchesJobType && matchesExperience;
    });

    return result.sort((a, b) => {
      if (filters.sort === 'salary-high') return b.salary_max - a.salary_max;
      if (filters.sort === 'salary-low') return a.salary_min - b.salary_min;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [filters, jobs]);

  const activeFiltersCount = [
    filters.location !== 'all',
    filters.jobType !== 'all',
    filters.experienceLevel !== 'all',
    filters.search.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-14">
          <div className="max-w-3xl">
            <span className="chip">Khám phá việc làm</span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Tìm việc theo cách nhanh hơn và trực quan hơn
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Bộ lọc thông minh, card việc làm rõ ràng và trải nghiệm tìm kiếm tối ưu cho ứng viên hiện đại.
            </p>
          </div>

          <div className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm lg:grid-cols-[1.5fr_1fr_auto]">
            <input
              type="search"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="input-base border-0 bg-white"
              placeholder="Tìm công việc, kỹ năng, công ty..."
            />
            <select
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
              className="input-base border-0 bg-white"
            >
              <option value="all">Tất cả địa điểm</option>
              {options.locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <button type="button" className="btn-accent">
              Tìm việc
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-700">Lọc nhanh:</span>
            <select
              value={filters.jobType}
              onChange={(e) => setFilters((prev) => ({ ...prev, jobType: e.target.value }))}
              className="input-base w-auto min-w-[180px] bg-white"
            >
              <option value="all">Tất cả hình thức</option>
              {options.jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters((prev) => ({ ...prev, experienceLevel: e.target.value }))}
              className="input-base w-auto min-w-[180px] bg-white"
            >
              <option value="all">Tất cả cấp độ</option>
              {options.experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as SortOption }))}
              className="input-base w-auto min-w-[180px] bg-white"
            >
              <option value="newest">Mới nhất</option>
              <option value="salary-high">Lương cao nhất</option>
              <option value="salary-low">Lương thấp nhất</option>
            </select>

            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={() => setFilters(defaultFilters)}
                className="text-sm font-semibold text-slate-900 hover:text-emerald-600"
              >
                Xoá bộ lọc ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Kết quả tìm kiếm</h2>
            <p className="section-subtitle">
              Hiển thị {filteredJobs.length} việc làm phù hợp từ {jobs.length} vị trí đang mở.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Việc làm', value: jobs.length },
              { label: 'Phù hợp', value: filteredJobs.length },
              { label: 'Địa điểm', value: options.locations.length },
              { label: 'Ngành', value: options.jobTypes.length },
            ].map((item) => (
              <div key={item.label} className="card-surface px-4 py-3 text-center">
                <div className="text-lg font-black text-slate-950">{item.value}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card-surface mt-8 p-10 text-center">
            <p className="text-slate-600">Đang tải danh sách việc làm...</p>
          </div>
        ) : error ? (
          <div className="card-surface mt-8 border-amber-200 bg-amber-50 p-4 text-amber-900">
            {error}
          </div>
        ) : null}

        {!loading && filteredJobs.length === 0 ? (
          <div className="card-surface mt-8 p-12 text-center">
            <h3 className="text-xl font-bold text-slate-950">Không tìm thấy việc làm phù hợp</h3>
            <p className="mt-2 text-slate-600">Thử thay đổi từ khoá tìm kiếm hoặc bộ lọc hiện tại.</p>
            <button type="button" onClick={() => setFilters(defaultFilters)} className="btn-primary mt-6">
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {filteredJobs.map((job) => (
              <article key={job.id} className="card-surface card-hover p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="chip">{job.job_type}</span>
                      <span className="chip">{job.experience_level}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-slate-950">{job.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">Công ty: {job.company_id}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="chip">{job.location}</span>
                      <span className="chip text-emerald-700">{formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
                    {job.applications_count} CV
                  </div>
                </div>

                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">{job.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {job.skills_required.slice(0, 4).map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/jobs/${job.id}`} className="btn-primary">
                    Xem chi tiết
                  </Link>
                  <button type="button" className="btn-secondary">
                    Ứng tuyển nhanh
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
