'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { jobApi, applicationApi } from '@/lib/api';
import { JobPosting, User } from '@/types';

// Cập nhật lại enum khớp chuẩn với Backend C# (Viết hoa chữ cái đầu)
type ApplicationStatus = 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Accepted';

const statusLabels: Record<string, string> = {
  Pending: 'Chờ duyệt',
  Reviewed: 'Đã xem',
  Shortlisted: 'Đã chọn',
  Rejected: 'Từ chối',
  Accepted: 'Đã nhận',
};

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Reviewed: 'bg-slate-100 text-slate-700 border-slate-200',
  Shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Accepted: 'bg-blue-50 text-blue-700 border-blue-200',
};

function formatDate(dateString: string) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString));
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [jobsCount, setJobsCount] = useState(0);
  const [jobsList, setJobsList] = useState<JobPosting[]>([]);
  
  // State mới chứa dữ liệu THẬT
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Logic Bảo Vệ Route: Chưa đăng nhập thì cấm vào
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/login');
      return;
    }

    const storedUser = JSON.parse(userStr) as User;
    setUser(storedUser);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      // Gọi API lấy số lượng việc làm VÀ danh sách hồ sơ ứng tuyển
      const [jobsRes, appsRes] = await Promise.all([
        jobApi.getAll(),
        applicationApi.getAll().catch(() => ({ data: [] })) // Bắt lỗi để không sập UI nếu API rỗng
      ]);

      const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
      const apps = Array.isArray(appsRes.data) ? appsRes.data : [];

      setJobsList(jobs);
      setJobsCount(jobs.length);
      setApplications(apps);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const isCandidate = user?.role === 'candidate';

  // Tính toán số liệu thống kê tự động từ dữ liệu thật
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(a => a.status === 'Pending').length,
      shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      reviewed: applications.filter(a => a.status === 'Reviewed').length,
      accepted: applications.filter(a => a.status === 'Accepted').length,
    };
  }, [applications]);

  if (loading) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-600 font-semibold animate-pulse">Đang tải dữ liệu thực tế...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
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
              title: 'Tổng hồ sơ/CV',
              value: stats.total < 10 ? `0${stats.total}` : stats.total,
              desc: isCandidate ? 'Đơn đã nộp' : 'CV nhận được',
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
              value: stats.shortlisted + stats.accepted,
              desc: isCandidate ? 'Đã shortlist/nhận' : 'Ứng viên sáng giá',
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
              <Link href="/jobs" className="btn-secondary">
                {isCandidate ? 'Tìm việc thêm' : 'Xem việc đăng'}
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {/* KIỂM TRA TRẠNG THÁI TRỐNG DỮ LIỆU */}
              {applications.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="text-slate-500 font-medium">
                    {isCandidate 
                      ? "Bạn chưa ứng tuyển công việc nào." 
                      : "Chưa có ứng viên nào nộp hồ sơ vào tin của bạn."}
                  </p>
                </div>
              ) : (
                applications.map((item) => {
                  // Nội suy Tên công việc từ Backend trả về
                  const jobMatch = jobsList.find(j => j.id === item.jobId);
                  const jobTitle = jobMatch ? jobMatch.title.split(' (')[0] : 'Công việc đã ẩn';

                  return (
                    <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:bg-gray-800 dark:border-gray-700 transition-colors">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`chip border ${statusStyles[item.status] || 'bg-slate-200'}`}>
                              {statusLabels[item.status] || item.status}
                            </span>
                            <span className="chip">{formatDate(item.appliedAt)}</span>
                          </div>

                          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                             {isCandidate 
                                ? (item.jobTitle || 'Công việc ẩn') 
                                : `Ứng viên: ${item.candidateName || 'Chưa cập nhật'}`}
                          </h3>
                          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                             {isCandidate 
                                ? (item.companyName || 'Công ty ẩn danh') 
                                : `Vị trí: ${item.jobTitle || 'Không xác định'}`}
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          {/* Nút dùng chung cho cả 2 vai trò dẫn vào trang chi tiết */}
                          <Link href={`/dashboard/applications/${item.id}`} className="btn-secondary dark:bg-gray-700 dark:text-white">
                            {isCandidate ? 'Xem chi tiết' : 'Phản hồi'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CỘT CÔNG CỤ BÊN PHẢI */}
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
                    <Link href="/jobs" className="btn-primary w-full">Tìm việc mới</Link>
                    <Link href="/create-resume" className="btn-outline w-full">
                Cập nhật hồ sơ
              </Link> 
                  </>
                ) : (
                  <>
                    <Link href="/dashboard/post-job" className="btn-primary w-full shadow-md">
                      Đăng tin tuyển dụng mới
                    </Link>
                    <Link href="/dashboard/create-company" className="btn-accent w-full shadow-md">
                      Tạo hồ sơ công ty mới
                    </Link>
                    <Link href="/dashboard/my-jobs" className="btn-secondary w-full">
                    Xem việc đã đăng
                    </Link>
                    <Link href="/dashboard/my-companies" className="btn-secondary w-full">
                      Công ty của tôi
                    </Link>
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