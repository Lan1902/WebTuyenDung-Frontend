import { useLang } from '@/lib/lang';

export default function LegalPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          {t('nav.legal')}
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.termsOfService')}
          </h2>
          <div className="prose dark:prose-dark">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Bằng việc sử dụng dịch vụ của GoTuyenDung, bạn đồng ý tuân thuộc các điều khoản sau:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Bạn sẽ cung cấp thông tin đăng ký chính xác và hoàn chỉnh.</li>
              <li>Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu của mình.</li>
              <li>GoTuyenDung có quyền xóa tài khoản vi phạm quy định.</li>
              <li>Dữ liệu cá nhân của bạn sẽ được bảo mật tuyệt đối.</li>
              <li>Bạn không được sao chép hay sử dụng sai mục đích dữ liệu trên hệ thống.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.privacyPolicy')}
          </h2>
          <div className="prose dark:prose-dark">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Thông tin cá nhân chỉ được sử dụng cho mục đích tuyển dụng.</li>
              <li>Chúng tôi không bán hay chia sẻ dữ liệu cá nhân cho bên thứ ba.</li>
              <li>Dữ liệu được mã hóa và lưu trữ an toàn.</li>
              <li>Bạn có quyền yêu cầu xóa dữ liệu cá nhân bất kỳ lúc nào.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.usageRules')}
          </h2>
          <div className="prose dark:prose-dark">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Quy định sử dụng nội dung trên hệ thống:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Không đăng tải nội dung vi phạm pháp luật.</li>
              <li>Không sử dụng hình ảnh sao chép quyền tác giả.</li>
              <li>Không gửi email spam hay quảng cáo không mong muốn.</li>
              <li>Tôn trọng quyền lợi của người dùng khác.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}