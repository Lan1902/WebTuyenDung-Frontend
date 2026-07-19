import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">GoTuyenDung</h3>
            <p className="mb-2">
              123 Đường Nguyễn Huệ, Quận 1, Thành phố Hồ Chí Minh
            </p>
            <p className="mb-2">
              Điện thoại: 0909 123 456
            </p>
            <p>
              Email: info@gotuyendung.vn
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">Doanh nghiệp hợp tác</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-slate-200 transition-colors">
                  Công ty Cổ phần ABC
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-200 transition-colors">
                  Công ty TNHH XYZ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-200 transition-colors">
                  Tập đoàn DEF
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-200 transition-colors">
                  Doanh nghiệp GHI
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-slate-200 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-slate-200 transition-colors">
                  Việc làm
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-slate-200 transition-colors">
                  Công ty
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} GoTuyenDung. All rights reserved.
        </div>
      </div>
    </footer>
  );
}