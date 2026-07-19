import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-slate-50 dark:bg-gray-900 transition-colors duration-200 min-h-screen">
      {/* --- HERO HEADER --- */}
      <section className="border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
          <div>
            <span className="chip mb-5">Nền tảng tuyển dụng hiện đại</span>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
              Tìm việc nhanh hơn.<br />Tuyển người tốt hơn.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
              GoTuyenDung mang đến trải nghiệm tìm việc sạch sẽ, trực quan và tối ưu cho cả ứng viên lẫn nhà tuyển dụng.
            </p>

            {/* FORM TÌM KIẾM ĐÃ ĐƯỢC KẾT NỐI HOẠT ĐỘNG */}
            <form 
              action="/jobs" 
              method="GET" 
              className="mt-8 grid gap-3 rounded-3xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 p-3 shadow-sm sm:grid-cols-[1fr_auto_auto]"
            >
              <input 
                name="search" 
                className="input-base border-0 bg-white dark:bg-gray-700 dark:text-white" 
                placeholder="Tìm công việc, kỹ năng, công ty..." 
              />
              <input 
                name="location" 
                className="input-base border-0 bg-white dark:bg-gray-700 dark:text-white" 
                placeholder="Địa điểm" 
              />
              <button type="submit" className="btn-accent whitespace-nowrap">
                Tìm việc ngay
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/jobs" className="btn-primary">
                Khám phá việc làm
              </Link>
              <Link href="/dashboard" className="btn-secondary dark:bg-gray-700 dark:text-white border-slate-200 dark:border-gray-600">
                Vào Dashboard
              </Link>
            </div>
          </div>

          {/* SMART SEARCH */}
          <div className="card-surface overflow-hidden border-slate-200 dark:border-gray-700 dark:bg-gray-800">
            <div className="border-b border-slate-200 dark:border-gray-700 bg-slate-900 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Smart Search</p>
              <h2 className="mt-2 text-2xl font-bold">Bộ lọc trực quan</h2>
              <p className="mt-2 text-sm text-slate-300">
                Dễ dàng chọn ngành, địa điểm, cấp độ và kiểu làm việc chỉ trong vài thao tác.
              </p>
            </div>
            
            {/* Sử dụng thẻ form để bắt dữ liệu nhập vào và đẩy sang trang /jobs */}
            <form action="/jobs" method="GET" className="space-y-4 p-6">
              
              {/* Khối Nhập Ngành Nghề */}
              <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 p-4 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Ngành nghề (Từ khóa)</label>
                <input 
                  name="search" 
                  type="text" 
                  placeholder="VD: Công nghệ thông tin..." 
                  className="mt-1 w-full border-0 bg-transparent p-0 font-semibold text-slate-950 dark:text-white focus:ring-0 placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              {/* Khối Nhập Địa Điểm */}
              <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 p-4 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Địa điểm</label>
                <input 
                  name="location" 
                  type="text" 
                  placeholder="VD: Ho Chi Minh City..." 
                  className="mt-1 w-full border-0 bg-transparent p-0 font-semibold text-slate-950 dark:text-white focus:ring-0 placeholder:font-normal placeholder:text-slate-400"
                />
              </div>

              {/* Khối Chọn Kinh Nghiệm */}
              <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 p-4 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Kinh nghiệm</label>
                <select 
                  name="experienceLevel" 
                  className="mt-1 w-full border-0 bg-transparent p-0 font-semibold text-slate-950 dark:text-white focus:ring-0 cursor-pointer"
                >
                  <option value="" className="text-slate-900">Tất cả cấp độ</option>
                  <option value="EntryLevel" className="text-slate-900">Thực tập / Fresher</option>
                  <option value="LowLevel" className="text-slate-900">Junior (Low-level)</option>
                  <option value="MidLevel" className="text-slate-900">Nhân viên (Mid-level)</option>
                  <option value="SeniorLevel" className="text-slate-900">Chuyên viên (Senior)</option>
                </select>
              </div>

              {/* Khối Chọn Hình Thức */}
              <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-700 p-4 transition-colors focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Hình thức</label>
                <select 
                  name="jobType" 
                  className="mt-1 w-full border-0 bg-transparent p-0 font-semibold text-slate-950 dark:text-white focus:ring-0 cursor-pointer"
                >
                  <option value="" className="text-slate-900">Tất cả hình thức</option>
                  <option value="FullTime" className="text-slate-900">Full-time</option>
                  <option value="PartTime" className="text-slate-900">Part-time</option>
                  <option value="Remote" className="text-slate-900">Remote</option>
                </select>
              </div>

              {/* Nút Submit */}
              <button type="submit" className="btn-primary w-full py-4 mt-2 font-bold flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Áp dụng bộ lọc
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- PHẦN LIÊN KẾT: ỨNG VIÊN - NHÀ TUYỂN DỤNG - DOANH NGHIỆP --- */}
      <section className="border-y border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-16">
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
            <div key={item.title} className="card-surface p-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.desc}</p>
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