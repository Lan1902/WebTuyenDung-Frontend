"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jobApi } from "@/lib/api";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    description: "",
    location: "",
    salaryMin: 0,
    salaryMax: 0,
    jobType: "FullTime",
    experienceLevel: "MidLevel",
    skillsRequired: "",
  });

  useEffect(() => {
    // Tải thông tin công việc hiện tại để lấp vào Form bài viết
    jobApi.getById(params.id)
      .then((res) => {
        const job = res.data;
        setFormData({
          title: job.title,
          companyId: job.companyId,
          description: job.description,
          location: job.location,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired.join(", ") : job.skillsRequired,
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Không thể tải thông tin công việc!");
        router.push("/dashboard/my-jobs");
      })
      .finally(() => setFetching(false));
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await jobApi.update(params.id, {
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

      setMessage("🎉 Cập nhật tin tuyển dụng thành công! Đang chuyển hướng...");
      setTimeout(() => router.push("/dashboard/my-jobs"), 2000);
    } catch (error: any) {
      setMessage(`Lỗi: ${error.response?.data?.message || "Không thể cập nhật tin tuyển dụng."}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) return <div className="p-20 text-center dark:text-white">Đang tải dữ liệu tin bài...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-8 shadow-sm">
        <div className="mb-8">
          <Link href="/dashboard/my-jobs" className="text-sm font-semibold text-emerald-600 hover:underline">
            &larr; Về danh sách
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Chỉnh sửa tin tuyển dụng</h1>
        </div>

        {message && (
          <div className={`mb-6 rounded-lg p-4 text-sm font-semibold ${message.includes("Lỗi") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">Tiêu đề công việc</label>
              <input type="text" name="title" required value={formData.title} onChange={handleInputChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">Địa điểm làm việc</label>
              <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">Hình thức</label>
              <select name="jobType" value={formData.jobType} onChange={handleInputChange} className="w-full input-base dark:bg-gray-700 dark:text-white">
                <option value="FullTime">Full-time</option>
                <option value="PartTime">Part-time</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">Mức lương tối thiểu (VND)</label>
              <input type="number" name="salaryMin" required value={formData.salaryMin} onChange={handleInputChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">Mức lương tối đa (VND)</label>
              <input type="number" name="salaryMax" required value={formData.salaryMax} onChange={handleInputChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">Kỹ năng yêu cầu (Cách nhau bằng dấu phẩy)</label>
            <input type="text" name="skillsRequired" required value={formData.skillsRequired} onChange={handleInputChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900 dark:text-white">Mô tả chi tiết công việc</label>
            <textarea name="description" required rows={5} value={formData.description} onChange={handleInputChange} className="w-full input-base dark:bg-gray-700 dark:text-white"></textarea>
          </div>

          <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-slate-900 py-4 text-base font-bold text-white transition hover:bg-slate-800 disabled:opacity-50">
            {isLoading ? "Đang lưu..." : "Cập nhật thay đổi"}
          </button>
        </form>
      </div>
    </div>
  );
}