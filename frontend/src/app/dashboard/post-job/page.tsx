"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { companyApi, jobApi } from "@/lib/api"; // Gọi trực tiếp từ api.ts

interface Company {
  id: string;
  ownerId: string;
  name: string;
}

export default function PostJobPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    description: "",
    location: "",
    salaryMin: 10000000,
    salaryMax: 20000000,
    jobType: "FullTime",
    experienceLevel: "MidLevel",
    skillsRequired: "React, Node.js, TypeScript",
  });

  useEffect(() => {
    // 1. SỬA LỖI BUG: Tìm đúng tên 'token'
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "employer" && user.role !== "admin") {
      alert("Chỉ Nhà tuyển dụng mới có quyền đăng tin!");
      router.push("/dashboard");
      return;
    }

    // 2. Tận dụng companyApi từ file api.ts
    companyApi.getAll()
      .then((res) => {
        const allCompanies = res.data as Company[];
        const myCompanies = allCompanies.filter((c: Company) => c.ownerId === user.id);
        setCompanies(myCompanies);
        // Lọc ra ĐÚNG các công ty do chính tài khoản này tạo
        if (myCompanies.length > 0) {
          setFormData((prev) => ({ ...prev, companyId: myCompanies[0].id }));
        }
      })
      .catch((err) => console.error("Lỗi lấy danh sách công ty:", err));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // 3. Sử dụng jobApi.create (Đã tự động xử lý Token ở hậu trường)
      await jobApi.create({
        title: formData.title,
        companyId: formData.companyId,
        description: formData.description,
        location: formData.location,
        salaryMin: Number(formData.salaryMin),
        salaryMax: Number(formData.salaryMax),
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        skillsRequired: formData.skillsRequired.split(",").map((s) => s.trim()), 
      });

      setMessage(" Đăng tin thành công! Đang chuyển hướng về Dashboard...");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (error: any) {
      setMessage(`Lỗi: ${error.response?.data?.message || "Không thể đăng tin. Hãy kiểm tra lại."}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <Link href="/dashboard" className="text-sm font-semibold text-emerald-600 hover:underline">
            &larr; Về Dashboard
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Tạo tin tuyển dụng mới</h1>
          <p className="mt-2 text-slate-600">Điền thông tin chi tiết để thu hút ứng viên tốt nhất.</p>
        </div>

        {message && (
          <div className={`mb-6 rounded-lg p-4 text-sm font-semibold ${message.includes("Lỗi") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-900">Tiêu đề công việc</label>
              <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" placeholder="VD: Frontend Developer (ReactJS)" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Công ty</label>
              <select name="companyId" value={formData.companyId} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500">
                {companies.length === 0 ? <option value="">Chưa có công ty nào...</option> : null}
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Địa điểm làm việc</label>
              <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" placeholder="VD: Quận 1, TP.HCM" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Mức lương tối thiểu (VND)</label>
              <input type="number" name="salaryMin" required value={formData.salaryMin} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Mức lương tối đa (VND)</label>
              <input type="number" name="salaryMax" required value={formData.salaryMax} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Hình thức</label>
              <select name="jobType" value={formData.jobType} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500">
                <option value="FullTime">Full-time</option>
                <option value="PartTime">Part-time</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Kinh nghiệm</label>
              <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500">
                <option value="Intern">Intern / Fresher</option>
                <option value="Junior">Junior</option>
                <option value="MidLevel">Mid-level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Kỹ năng yêu cầu (Cách nhau bằng dấu phẩy)</label>
            <input type="text" name="skillsRequired" required value={formData.skillsRequired} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" placeholder="VD: React, Node.js, SQL" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">Mô tả chi tiết công việc</label>
            <textarea name="description" required rows={5} value={formData.description} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-emerald-500" placeholder="Mô tả công việc, yêu cầu, quyền lợi..."></textarea>
          </div>

          <button type="submit" disabled={isLoading || companies.length === 0} className="w-full rounded-xl bg-slate-900 py-4 text-base font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Đang xử lý..." : "Đăng tin ngay"}
          </button>
        </form>
      </div>
    </div>
  );
}