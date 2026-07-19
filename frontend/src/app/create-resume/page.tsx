"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resumeApi } from "@/lib/api";

export default function CreateResumePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", fullName: "", email: "", phoneNumber: "", bio: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Dữ liệu mẫu truyền đi (bạn có thể phát triển thêm mảng Kỹ năng, Học vấn sau)
      await resumeApi.create({
        ...formData,
        experiences: [], educations: [], skills: []
      });
      alert(" Tạo CV thành công! Giờ bạn có thể dùng nó để ứng tuyển.");
      router.push("/dashboard");
    } catch (error: any) {
      alert("Lỗi: " + (error.response?.data?.message || "Không thể tạo CV."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-10">
      <div className="container-page max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Tạo CV Online</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">Điền thông tin cơ bản để hệ thống tạo hồ sơ chuyên nghiệp cho bạn.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">Tên bản CV (Ví dụ: CV Frontend Dev)</label>
            <input required type="text" name="title" onChange={handleChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-white">Họ và Tên thật</label>
              <input required type="text" name="fullName" onChange={handleChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-white">Số điện thoại</label>
              <input required type="tel" name="phoneNumber" onChange={handleChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">Email liên hệ</label>
            <input required type="email" name="email" onChange={handleChange} className="w-full input-base dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-white">Giới thiệu bản thân (Bio)</label>
            <textarea required rows={4} name="bio" onChange={handleChange} className="w-full input-base dark:bg-gray-700 dark:text-white" placeholder="Viết một đoạn ngắn giới thiệu về kỹ năng và mục tiêu của bạn..."></textarea>
          </div>
          
          <button type="submit" disabled={loading} className="w-full btn-primary py-3">
            {loading ? "Đang lưu trữ..." : "Lưu hồ sơ CV"}
          </button>
        </form>
      </div>
    </div>
  );
}