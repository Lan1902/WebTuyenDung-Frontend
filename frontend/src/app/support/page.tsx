import Link from 'next/link';
import { useLang } from '@/lib/lang';

export default function SupportPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          {t('nav.support')}
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.contactUs')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('common.supportText')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">{t('common.customerSupport')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">📞 1900-1234</p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">✉️ support@gotuyendung.vn</p>
              <p className="text-gray-600 dark:text-gray-300">⏰ 8:00 - 18:00 (Thứ 2 - Thứ 6)</p>
            </div>
            
            <div className="border dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">{t('common.salesInquiry')}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">📞 1900-5678</p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">✉️ sales@gotuyendung.vn</p>
              <p className="text-gray-600 dark:text-gray-300">⏰ 8:00 - 17:30 (Thứ 2 - Thứ 6)</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.frequentlyAskedQuestions')}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Làm sao để ứng tuyển công việc?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Bạn chỉ cần đăng nhập, tìm kiếm việc làm ưu thích và nhấn "Ứng tuyển".</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Làm sao để đăng tin tuyển dụng?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Doanh nghiệp cần đăng ký tài khoản nhà tuyển dụng và điền đầy đủ thông tin công ty.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Tôi quên mật khẩu phải làm sao?</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Vui lòng liên hệ với bộ phận hỗ trợ qua hotline hoặc email để được hướng dẫn đặt lại mật khẩu.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}