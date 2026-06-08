'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useLang } from '@/lib/lang';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { lang, t, setLang } = useLang();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    // Apply dark mode preference
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const toggleLanguage = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 dark:bg-gray-900/90 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"></path>
              </svg>
            </div>
            <span className="font-bold text-xl text-primary whitespace-nowrap">
              GoTuyenDung
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              <Link href="/jobs" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">
                {t('nav.findJobs')}
              </Link>
              <Link href="/companies" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">
                {t('nav.companies')}
              </Link>
              <Link href="/create-resume" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">
                {t('nav.createResume')}
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">
                {t('nav.support')}
              </Link>
              <Link href="/legal" className="text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white">
                {t('nav.legal')}
              </Link>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatarUrl || '/default-avatar.png'} 
                      alt="Avatar" 
                      className="h-8 w-8 rounded-full border border-gray-200"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{user.role === 'candidate' ? t('auth.candidate') : user.role === 'employer' ? t('auth.employer') : t('auth.admin')}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-outline hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="btn-outline hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
              
              {/* Language and Theme Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleLanguage}
                  className="p-2 rounded hover:bg-gray-100 transition-colors text-sm dark:hover:bg-gray-700 dark:text-white"
                  title={lang === 'vi' ? 'English' : 'Tiếng Việt'}
                >
                  {lang === 'vi' ? 'EN' : 'VI'}
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded hover:bg-gray-100 transition-colors dark:hover:bg-gray-700 dark:text-white"
                  title={isDarkMode ? t('common.lightMode') : t('common.darkMode')}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isDarkMode ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.354 3.354l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    )}
                  </svg>
                </button>
              </div>
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
            {/* Navigation Links */}
            <Link href="/jobs" className="block py-2 pl-3 pr-4 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              {t('nav.findJobs')}
            </Link>
            <Link href="/companies" className="block py-2 pl-3 pr-4 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              {t('nav.companies')}
            </Link>
            <Link href="/create-resume" className="block py-2 pl-3 pr-4 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              {t('nav.createResume')}
            </Link>
            <Link href="/support" className="block py-2 pl-3 pr-4 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              {t('nav.support')}
            </Link>
            <Link href="/legal" className="block py-2 pl-3 pr-4 rounded text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
              {t('nav.legal')}
            </Link>
            
            {/* User Section */}
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 py-2 pl-3 pr-4 rounded">
                  <img 
                    src={user.avatarUrl || '/default-avatar.png'} 
                    alt="Avatar" 
                    className="h-8 w-8 rounded-full border border-gray-200"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{user.fullName}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.role === 'candidate' ? t('auth.candidate') : user.role === 'employer' ? t('auth.employer') : t('auth.admin')}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left btn-outline py-2 pl-3 pr-4 rounded dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-full text-center btn-outline py-2 pl-3 pr-4 rounded dark:hover:bg-gray-700 dark:text-white dark:border-gray-600">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="w-full text-center btn-primary py-2 pl-3 pr-4 rounded">
                  {t('nav.register')}
                </Link>
              </>
            )}
            
            {/* Language and Theme Toggle */}
            <div className="flex items-center justify-between py-2 pl-3 pr-4">
              <div>
                <button
                  onClick={toggleLanguage}
                  className="p-2 rounded hover:bg-gray-100 transition-colors text-sm dark:hover:bg-gray-700 dark:text-white"
                  title={lang === 'vi' ? 'English' : 'Tiếng Việt'}
                >
                  {lang === 'vi' ? 'EN' : 'VI'}
                </button>
              </div>
              <div>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded hover:bg-gray-100 transition-colors dark:hover:bg-gray-700 dark:text-white"
                  title={isDarkMode ? t('common.lightMode') : t('common.darkMode')}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isDarkMode ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.354 3.354l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}