'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  // ĐÃ XÓA BỎ HOÀN TOÀN LOGIC CỦA DARK MODE (isDarkMode, toggleDarkMode, useEffect)

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 dark:bg-gray-900/90 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="flex items-center gap-3">
            <span className="font-bold text-xl text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white whitespace-nowrap transition-colors">
              GoTuyenDung
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">
                Tìm việc
              </Link>
              <Link href="/companies" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">
                Công ty
              </Link>
              <Link href="/create-resume" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">
                Tạo CV online
              </Link>
              {/* ĐÃ XÓA MỤC "HỖ TRỢ" Ở ĐÂY */}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3">
                    {/* ĐÃ BIẾN TÊN NGƯỜI DÙNG THÀNH LINK DẪN ĐẾN DASHBOARD */}
                    <Link 
                      href="/dashboard" 
                      className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 transition-colors cursor-pointer"
                      title="Vào trang quản lý (Dashboard)"
                    >
                      {user?.fullName}
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-outline hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-outline hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600">
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="btn-primary">
                    Đăng ký
                  </Link>
                </>
              )}
              
              {/* ĐÃ XÓA NÚT ĐỔI MÀU GIAO DIỆN Ở ĐÂY */}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/jobs" className="block py-2 pl-3 pr-4 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              Tìm việc
            </Link>
            <Link href="/companies" className="block py-2 pl-3 pr-4 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              Công ty
            </Link>
            <Link href="/create-resume" className="block py-2 pl-3 pr-4 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              Tạo CV online
            </Link>
            {/* ĐÃ XÓA MỤC "HỖ TRỢ" TRÊN MENU MOBILE */}
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-2 pl-3 pr-4 rounded">
                  {/* ĐÃ BIẾN TÊN NGƯỜI DÙNG THÀNH LINK TRÊN MOBILE */}
                  <Link href="/dashboard" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    {user?.fullName}
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left btn-outline py-2 pl-3 pr-4 rounded dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-full text-center btn-outline py-2 pl-3 pr-4 rounded dark:hover:bg-gray-700 dark:text-white dark:border-gray-600">
                  Đăng nhập
                </Link>
                <Link href="/register" className="w-full text-center btn-primary py-2 pl-3 pr-4 rounded">
                  Đăng ký
                </Link>
              </>
            )}
            
          </div>
        </div>
      )}
    </nav>
  );
}