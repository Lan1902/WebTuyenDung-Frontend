"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { companyApi } from "@/lib/api";

export default function CreateCompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    industry: "Công nghệ thông tin",
    size: "10-50 employees",
    location: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Gọi API tạo công ty. Token đã được api.ts tự động gắn vào Header.
      await companyApi.create(formData);
      
      setMessage("🎉 Tạo hồ sơ doanh nghiệp thành công! Đang chuyển hướng...");
      // Tạo xong thì đưa họ sang trang Đăng tin
      setTimeout(() => router.push("/dashboard/post-job"), 2000);
    } catch (error: any) {
      setMessage(`Lỗi: ${error.response?.data?.message || "Không thể tạo công ty. Vui lòng thử lại."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-semibold text-emerald-600 hover:underline">
            &larr; Về Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Tạo hồ sơ Doanh nghiệp</h1>
          <p className="mt-2 text-slate-600">Bạn cần thiết lập thông tin công ty trước khi có thể đăng tin tuyển dụng.</p>
        </div>

        {message && (
          <div className={`mb-6 rounded-lg p-4 text-sm font-semibold ${message.includes("Lỗi") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Tên công ty *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" placeholder="VD: Công ty TNHH Giải pháp Phần mềm..." />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Ngành nghề</label>
              <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500">
                <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                <option value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</option>
                <option value="Thương mại điện tử">Thương mại điện tử</option>
                <option value="Giáo dục">Giáo dục</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Quy mô nhân sự</label>
              <select name="size" value={formData.size} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500">
                <option value="1-10 employees">1-10 nhân viên</option>
                <option value="10-50 employees">10-50 nhân viên</option>
                <option value="50-200 employees">50-200 nhân viên</option>
                <option value="200+ employees">200+ nhân viên</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Trụ sở chính *</label>
              <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" placeholder="VD: TP. Hồ Chí Minh" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Website</label>
              <input type="text" name="website" value={formData.website} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" placeholder="https://..." />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Giới thiệu về công ty</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" placeholder="Môi trường làm việc, tầm nhìn, sứ mệnh..."></textarea>
          </div>

          <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-emerald-600 py-4 text-base font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
            {isLoading ? "Đang xử lý..." : "Khởi tạo Doanh nghiệp"}
          </button>
        </form>
      </div>
    </div>
  );
}