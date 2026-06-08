import Link from 'next/link';

const categories = [
  { name: 'Kỹ sư phần mềm', jobs: 128, icon: '💻' },
  { name: 'Marketing', jobs: 86, icon: '📣' },
  { name: 'Thiết kế', jobs: 54, icon: '🎨' },
  { name: 'Kế toán - Tài chính', jobs: 42, icon: '📊' },
  { name: 'Nhân sự', jobs: 31, icon: '👥' },
  { name: 'Bán hàng', jobs: 75, icon: '🛒' },
];

const featuredJobs = [
  {
    id: '1',
    title: 'Frontend Developer React/Next.js',
    company: 'GoTuyenDung Studio',
    location: 'Ho Chi Minh City',
    type: 'Full-time',
    salary: '20 - 35 triệu',
    tags: ['React', 'Next.js', 'TypeScript'],
  },
  {
    id: '2',
    title: 'Product Marketing Specialist',
    company: 'GrowthHub',
    location: 'Hà Nội',
    type: 'Hybrid',
    salary: '18 - 28 triệu',
    tags: ['SEO', 'Content', 'Analytics'],
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'Nova Design',
    location: 'Đà Nẵng',
    type: 'Remote',
    salary: '15 - 25 triệu',
    tags: ['Figma', 'Design System', 'Prototyping'],
  },
  {
    id: '4',
    title: 'HR Executive',
    company: 'TalentBridge',
    location: 'Ho Chi Minh City',
    type: 'Full-time',
    salary: '14 - 22 triệu',
    tags: ['Recruitment', 'Interview', 'Onboarding'],
  },
];

const highlights = [
  { label: 'Việc làm hoạt động', value: '1,200+' },
  { label: 'Nhà tuyển dụng', value: '480+' },
  { label: 'Ứng viên phù hợp', value: '12K+' },
  { label: 'Tỉ lệ phản hồi', value: '94%' },
];

export default function Home() {
  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
          <div>
            <span className="chip mb-5">Nền tảng tuyển dụng hiện đại</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Tìm việc nhanh hơn. Tuyển người tốt hơn.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              GoTuyenDung mang đến trải nghiệm tìm việc sạch sẽ, trực quan và tối ưu cho cả ứng viên lẫn nhà tuyển dụng.
              Lọc thông minh, thẻ việc làm nổi bật và quy trình ứng tuyển gọn gàng trong một giao diện duy nhất.
            </p>

            <div className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:grid-cols-[1fr_auto_auto]">
              <input className="input-base border-0 bg-white" placeholder="Tìm công việc, kỹ năng, công ty..." />
              <input className="input-base border-0 bg-white" placeholder="Địa điểm" />
              <Link href="/jobs" className="btn-accent whitespace-nowrap">
                Tìm việc ngay
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/jobs" className="btn-primary">
                Khám phá việc làm
              </Link>
              <Link href="/dashboard" className="btn-secondary">
                Vào Dashboard
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {highlights.map((item) => (
                <div key={item.label} className="card-surface p-4">
                  <div className="text-2xl font-black text-slate-950">{item.value}</div>
                  <div className="mt-1 text-sm text-slate-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface card-hover overflow-hidden border-slate-200">
            <div className="border-b border-slate-200 bg-slate-900 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Smart Search</p>
              <h2 className="mt-2 text-2xl font-bold">Bộ lọc trực quan</h2>
              <p className="mt-2 text-sm text-slate-300">
                Dễ dàng chọn ngành, địa điểm, cấp độ và kiểu làm việc chỉ trong vài thao tác.
              </p>
            </div>
            <div className="space-y-4 p-6">
              {[
                { label: 'Ngành nghề', value: 'Công nghệ thông tin' },
                { label: 'Địa điểm', value: 'Ho Chi Minh City' },
                { label: 'Kinh nghiệm', value: 'Mid-level' },
                { label: 'Hình thức', value: 'Hybrid' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                  <div className="mt-1 font-semibold text-slate-950">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Danh mục ngành nghề</h2>
            <p className="section-subtitle">
              Lựa chọn nhanh theo nhóm nghề phổ biến để rút ngắn hành trình tìm việc.
            </p>
          </div>
          <Link href="/jobs" className="text-sm font-semibold text-slate-900 hover:text-emerald-600">
            Xem tất cả
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.name}
              className="card-surface card-hover flex items-center gap-4 p-5 text-left"
              type="button"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white shadow-sm">
                {category.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-semibold text-slate-950">{category.name}</span>
                <span className="mt-1 block text-sm text-slate-600">{category.jobs} việc làm</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">Việc làm nổi bật</h2>
            <p className="section-subtitle">
              Các vị trí đang tuyển nhanh, hiển thị dạng card rõ ràng với thông tin quan trọng nhất.
            </p>
          </div>
          <Link href="/jobs" className="text-sm font-semibold text-slate-900 hover:text-emerald-600">
            Tất cả việc làm
          </Link>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {featuredJobs.map((job) => (
            <article key={job.id} className="card-surface card-hover p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-emerald-600">{job.company}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">{job.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
                    <span className="chip">{job.location}</span>
                    <span className="chip">{job.type}</span>
                    <span className="chip">{job.salary}</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                  Hot
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
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
      </section>

      <section className="border-y border-slate-200 bg-white py-16">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Ứng viên',
              desc: 'Tạo hồ sơ, lưu việc làm và ứng tuyển chỉ bằng vài cú nhấp.',
              action: 'Đăng ký ứng viên',
              href: '/register',
            },
            {
              title: 'Nhà tuyển dụng',
              desc: 'Đăng tin, quản lý CV và theo dõi pipeline tuyển dụng tập trung.',
              action: 'Mở Dashboard',
              href: '/dashboard',
            },
            {
              title: 'Doanh nghiệp',
              desc: 'Xây dựng thương hiệu tuyển dụng với trang công ty rõ ràng, trực quan.',
              action: 'Khám phá công ty',
              href: '/companies',
            },
          ].map((item) => (
            <div key={item.title} className="card-surface p-6">
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.desc}</p>
              <Link href={item.href} className="btn-accent mt-5">
                {item.action}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
