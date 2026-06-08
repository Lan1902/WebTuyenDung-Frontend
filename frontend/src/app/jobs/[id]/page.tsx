'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { applicationApi, jobApi } from '@/lib/api';
import { JobPosting } from '@/types';

const fallbackJob: JobPosting = {
  id: '1',
  title: 'Frontend Developer React/Next.js',
  description:
    'Xây dựng giao diện tuyển dụng hiện đại, tối ưu trải nghiệm người dùng, tốc độ tải trang và khả năng mở rộng component.',
  companyId: 'GoTuyenDung Studio',
  salaryMin: 20000000,
  salaryMax: 35000000,
  location: 'Ho Chi Minh City',
  jobType: 'Full-time',
  experienceLevel: 'Mid-level',
  skillsRequired: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  applicationsCount: 18,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const relatedJobs = [
  {
    id: '2',
    title: 'UI Engineer',
    company: 'GrowthHub',
    location: 'Hà Nội',
    salary: '18 - 30 triệu',
  },
  {
    id: '3',
    title: 'Product Designer',
    company: 'Nova Design',
    location: 'Remote',
    salary: '16 - 28 triệu',
  },
  {
    id: '4',
    title: 'Fullstack Developer',
    company: 'TalentBridge',
    location: 'Đà Nẵng',
    salary: '22 - 40 triệu',
  },
];

function formatSalary(min: number, max: number) {
  const format = (value: number) =>
    new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(value / 1000000);
  return `${format(min)} - ${format(max)} triệu`;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [job, setJob] = useState<JobPosting>(fallbackJob);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jobId) return;
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const response = await jobApi.getById(jobId);
      setJob(response.data ?? fallbackJob);
    } catch (err) {
      console.error('Failed to load job:', err);
      setError('Không thể tải dữ liệu từ máy chủ. Đang hiển thị dữ liệu mẫu.');
      setJob(fallbackJob);
    } finally {
      setLoading(false);
    }
  };

  const jobMeta = useMemo(
    () => [
      { label: 'Loại công việc', value: job.jobType },
      { label: 'Kinh nghiệm', value: job.experienceLevel },
      { label: 'Địa điểm', value: job.location },
      { label: 'Mức lương', value: formatSalary(job.salaryMin, job.salaryMax) },
    ],
    [job]
  );

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationApi.create({
        job_id: job.id,
        resume_url: '',
        cover_letter: '',
      });
      window.alert('Ứng tuyển thành công!');
    } catch (err) {
      console.error('Apply failed:', err);
      window.alert('Ứng tuyển thất bại. Vui lòng thử lại sau.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-600">Đang tải thông tin công việc...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            ← Quay lại danh sách việc làm
          </button>

          {error ? (
            <div className="card-surface mt-6 border-amber-200 bg-amber-50 p-4 text-amber-900">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <article className="card-surface p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                <span className="chip">{job.jobType}</span>
                <span className="chip">{job.experienceLevel}</span>
                <span className="chip text-emerald-700">{job.isActive ? 'Đang tuyển' : 'Tạm dừng'}</span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{job.title}</h1>
              <p className="mt-3 text-base font-semibold text-emerald-600">{job.companyId}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Mã công việc #{job.id} · {job.applicationsCount} ứng viên đã nộp hồ sơ
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {jobMeta.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-sm font-bold text-slate-950">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-950">Mô tả công việc</h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">{job.description}</p>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold text-slate-950">Kỹ năng yêu cầu</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-2">
                <div>
                  <h3 className="font-bold text-slate-950">Quyền lợi nổi bật</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>• Môi trường sản phẩm hiện đại, trao quyền rõ ràng</li>
                    <li>• Review performance định kỳ và lộ trình phát triển</li>
                    <li>• Làm việc linh hoạt, ưu tiên hiệu quả</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-slate-950">Yêu cầu thêm</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>• Có tư duy sản phẩm và phối hợp tốt với team</li>
                    <li>• Chủ động giải quyết vấn đề, tối ưu trải nghiệm người dùng</li>
                    <li>• Ưu tiên ứng viên có kinh nghiệm xây dựng sản phẩm tuyển dụng</li>
                  </ul>
                </div>
              </div>
            </article>

            <aside className="space-y-6">
              <div className="card-surface p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Ứng tuyển nhanh</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950">{formatSalary(job.salaryMin, job.salaryMax)}</h2>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                    Nổi bật
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={applying}
                  className="btn-accent mt-6 w-full"
                >
                  {applying ? 'Đang gửi hồ sơ...' : 'Ứng tuyển ngay'}
                </button>

                <button type="button" className="btn-secondary mt-3 w-full">
                  Lưu việc làm
                </button>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Thông tin quan trọng</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between gap-4">
                      <span>Hạn nộp hồ sơ</span>
                      <span className="font-semibold text-slate-950">30/06/2026</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Hình thức</span>
                      <span className="font-semibold text-slate-950">{job.jobType}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Địa điểm</span>
                      <span className="font-semibold text-slate-950">{job.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-surface p-6">
                <p className="text-sm font-semibold text-slate-500">Thông tin công ty</p>
                <div className="mt-3 flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white">
                    🏢
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-950">{job.companyId}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      Doanh nghiệp công nghệ tập trung vào trải nghiệm tuyển dụng, sản phẩm số và tăng trưởng bền vững.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between gap-4">
                    <span>Ngành</span>
                    <span className="font-semibold text-slate-950">Technology</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Quy mô</span>
                    <span className="font-semibold text-slate-950">100-500 nhân sự</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Website</span>
                    <span className="font-semibold text-slate-950">gotuyendung.vn</span>
                  </div>
                </div>

                <Link href="/companies" className="btn-secondary mt-6 w-full">
                  Xem trang công ty
                </Link>
              </div>

              <div className="card-surface p-6">
                <h3 className="text-lg font-bold text-slate-950">Việc làm liên quan</h3>
                <div className="mt-4 space-y-4">
                  {relatedJobs.map((related) => (
                    <Link
                      key={related.id}
                      href={`/jobs/${related.id}`}
                      className="block rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <div className="text-sm font-bold text-slate-950">{related.title}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        {related.company} · {related.location}
                      </div>
                      <div className="mt-2 text-sm font-semibold text-emerald-600">{related.salary}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}