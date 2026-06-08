'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { jobApi } from '@/lib/api';
import { JobPosting, User } from '@/types';

type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';

type CandidateApplication = {
  id: string;
  jobTitle: string;
  company: string;
  status: ApplicationStatus;
  appliedAt: string;
};

type EmployerApplication = {
  id: string;
  candidateName: string;
  jobTitle: string;
  status: ApplicationStatus;
  appliedAt: string;
};

const candidateApplications: CandidateApplication[] = [
  {
    id: 'app-1',
    jobTitle: 'Frontend Developer React/Next.js',
    company: 'GoTuyenDung Studio',
    status: 'shortlisted',
    appliedAt: '2026-06-01',
  },
  {
    id: 'app-2',
    jobTitle: 'UI/UX Designer',
    company: 'Nova Design',
    status: 'pending',
    appliedAt: '2026-06-03',
  },
  {
    id: 'app-3',
    jobTitle: 'Product Marketing Specialist',
    company: 'GrowthHub',
    status: 'reviewed',
    appliedAt: '2026-05-28',
  },
];

const employerApplications: EmployerApplication[] = [
  {
    id: 'cv-1',
    candidateName: 'Nguyễn Minh Anh',
    jobTitle: 'Frontend Developer React/Next.js',
    status: 'reviewed',
    appliedAt: '2026-06-02',
  },
  {
    id: 'cv-2',
    candidateName: 'Trần Gia Huy',
    jobTitle: 'UI/UX Designer',
    status: 'shortlisted',
    appliedAt: '2026-06-03',
  },
  {
    id: 'cv-3',
    candidateName: 'Lê Thu Hà',
    jobTitle: 'HR Executive',
    status: 'pending',
    appliedAt: '2026-06-03',
  },
];

const statusLabels: Record<ApplicationStatus, string> = {
  pending: 'Chờ duyệt',
  reviewed: 'Đã xem',
  shortlisted: 'Đã chọn',
  rejected: 'Từ chối',
  accepted: 'Đã nhận',
};

const statusStyles: Record<ApplicationStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  reviewed: 'bg-slate-100 text-slate-700 border-slate-200',
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  accepted: 'bg-blue-50 text-blue-700 border-blue-200',
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [jobsCount, setJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const storedUser = userStr ? (JSON.parse(userStr) as User) : null;
    setUser(storedUser);
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await jobApi.getAll();
      const jobs: JobPosting[] = Array.isArray(response.data) ? response.data : [];
      setJobsCount(jobs.length);
    } catch (error) {
      console.error('Failed to load stats:', error);
      setJobsCount(12);
    } finally {
      setLoading(false);
    }
  };

  const isCandidate = user?.role === 'candidate';
  const applications = isCandidate ? candidateApplications : employerApplications;

  const stats = useMemo(() => {
    const pending = applications.filter((item) => item.status === 'pending').length;
    const shortlisted = applications.filter((item) => item.status === 'shortlisted').length;
    const reviewed = applications.filter((item) => item.status === 'reviewed').length;
    const accepted = applications.filter((item) => item.status === 'accepted').length;

    return {
      total: applications.length,
      pending,
      shortlisted,
      reviewed,
      accepted,
    };
  }, [applications]);

  if (loading) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-600">Đang tải dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="chip">{isCandidate ? 'Dashboard ứng viên' : 'Dashboard nhà tuyển dụng'}</span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
                Xin chào, {user?.fullName || 'bạn'}!
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                {isCandidate
                  ? 'Theo dõi trạng thái hồ sơ, kiểm tra công việc đã ứng tuyển và quay lại tìm việc bất cứ lúc nào.'
                  : 'Theo dõi số lượng việc đăng, CV mới, pipeline ứng tuyển và các hoạt động tuyển dụng đang diễn ra.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Việc làm', value: jobsCount },
                { label: 'Tổng mục', value: stats.total },
                { label: 'Đang chờ', value: stats.pending },
                { label: 'Đã chọn', value: stats.shortlisted },
              ].map((item) => (
                <div key={item.label} className="card-surface px-4 py-3 text-center">
                  <div className="text-xl font-black text-slate-950">{item.value}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Tổng ứng viên/hồ sơ',
              value: isCandidate ? '03' : '24',
              desc: isCandidate ? 'Hồ sơ đã theo dõi' : 'CV mới trong tuần',
              tone: 'bg-slate-900 text-white',
            },
            {
              title: 'Trạng thái chờ',
              value: stats.pending,
              desc: isCandidate ? 'Đang chờ phản hồi' : 'Cần xử lý',
              tone: 'bg-amber-50 text-amber-700 border border-amber-200',
            },
            {
              title: 'Đã xem',
              value: stats.reviewed,
              desc: isCandidate ? 'Nhà tuyển dụng đã mở' : 'CV đã review',
              tone: 'bg-blue-50 text-blue-700 border border-blue-200',
            },
            {
              title: 'Đã chọn',
              value: stats.shortlisted || stats.accepted,
              desc: isCandidate ? 'Đã shortlist' : 'Ứng viên sáng giá',
              tone: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
            },
          ].map((item) => (
            <div key={item.title} className={`card-surface p-5 ${item.tone}`}>
              <p className="text-sm font-semibold opacity-80">{item.title}</p>
              <div className="mt-3 text-4xl font-black">{item.value}</div>
              <p className="mt-2 text-sm opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card-surface p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">
                  {isCandidate ? 'Trạng thái ứng tuyển' : 'CV ứng tuyển gần đây'}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {isCandidate
                    ? 'Các hồ sơ của bạn đang được xử lý theo từng trạng thái.'
                    : 'Danh sách ứng viên mới giúp bạn ưu tiên xử lý nhanh hơn.'}
                </p>
              </div>
              <Link href={isCandidate ? '/jobs' : '/jobs'} className="btn-secondary">
                {isCandidate ? 'Tìm việc thêm' : 'Xem việc đăng'}
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {applications.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`chip border ${statusStyles[item.status]}`}>{statusLabels[item.status]}</span>
                        <span className="chip">{formatDate(item.appliedAt)}</span>
                      </div>

                      {isCandidate ? (
                        <>
                          <h3 className="mt-4 text-lg font-bold text-slate-950">{(item as CandidateApplication).jobTitle}</h3>
                          <p className="mt-1 text-sm text-slate-600">{(item as CandidateApplication).company}</p>
                        </>
                      ) : (
                        <>
                          <h3 className="mt-4 text-lg font-bold text-slate-950">
                            {(item as EmployerApplication).candidateName}
                          </h3>
                          <p className="mt-1 text-sm text-slate-600">
                            {(item as EmployerApplication).jobTitle}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button type="button" className="btn-secondary">
                        Xem chi tiết
                      </button>
                      <button type="button" className="btn-primary">
                        {isCandidate ? 'Nhắc nhở' : 'Phản hồi'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-surface p-6">
              <h2 className="text-2xl font-bold text-slate-950">
                {isCandidate ? 'Công cụ ứng viên' : 'Công cụ nhà tuyển dụng'}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {isCandidate
                  ? 'Tiếp tục hoàn thiện hồ sơ và theo dõi công việc phù hợp.'
                  : 'Quản lý tin tuyển dụng và phản hồi nhanh các hồ sơ tiềm năng.'}
              </p>

              <div className="mt-5 space-y-3">
                {isCandidate ? (
                  <>
                    <Link href="/jobs" className="btn-primary w-full">
                      Tìm việc mới
                    </Link>
                    <Link href="/profile" className="btn-secondary w-full">
                      Cập nhật hồ sơ
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/jobs" className="btn-primary w-full">
                      Xem việc đã đăng
                    </Link>
                    <Link href="/companies" className="btn-secondary w-full">
                      Xem trang công ty
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="card-surface p-6">
              <h3 className="text-lg font-bold text-slate-950">Tóm tắt nhanh</h3>
              <div className="mt-4 space-y-4">
                {[
                  {
                    label: 'Hoạt động hôm nay',
                    value: isCandidate ? '02 phản hồi mới' : '06 CV mới',
                  },
                  {
                    label: 'Tỷ lệ chuyển đổi',
                    value: isCandidate ? '68%' : '54%',
                  },
                  {
                    label: 'Mục tiêu tuần này',
                    value: isCandidate ? 'Ứng tuyển 5 vị trí' : 'Sàng lọc 20 CV',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                    <span className="text-sm text-slate-600">{item.label}</span>
                    <span className="text-sm font-bold text-slate-950">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-6">
              <h3 className="text-lg font-bold text-slate-950">Lối tắt</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {isCandidate ? (
                  <>
                    <span className="chip">Tìm việc remote</span>
                    <span className="chip">Việc lương cao</span>
                    <span className="chip">Công việc mới</span>
                    <span className="chip">Lưu tin tuyển dụng</span>
                  </>
                ) : (
                  <>
                    <span className="chip">Lọc CV</span>
                    <span className="chip">Tin đang mở</span>
                    <span className="chip">Lịch phỏng vấn</span>
                    <span className="chip">Báo cáo tuyển dụng</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
