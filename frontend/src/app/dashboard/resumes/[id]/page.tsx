"use client";

import { useEffect, useState } from "react";
import { resumeApi } from "@/lib/api";
import Link from "next/link";

export default function ResumeViewerPage({ params }: { params: { id: string } }) {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // CHUẨN: Trang này phải gọi resumeApi để lấy CV
    resumeApi.getById(params.id)
      .then((res) => setResume(res.data))
      .catch((err) => {
        console.error(err);
        alert("Không thể tải thông tin CV này.");
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <div className="p-20 text-center dark:text-white">Đang tải hồ sơ CV...</div>;
  if (!resume) return <div className="p-20 text-center text-rose-500">Hồ sơ không tồn tại hoặc đã bị xóa.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-10">
      <div className="container-page max-w-3xl">
        <div className="mb-6 flex justify-between items-center">
          <button onClick={() => window.history.back()} className="text-sm font-semibold text-emerald-600 hover:underline">
            &larr; Quay lại
          </button>
          <button onClick={() => window.print()} className="btn-primary">🖨️ In ra PDF</button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg border border-slate-200 dark:border-gray-700">
          <div className="border-b border-slate-200 dark:border-gray-700 pb-6 mb-6">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {resume.fullName || "Chưa cập nhật tên"}
            </h1>
            <h2 className="text-xl font-medium text-emerald-600 mt-2">{resume.title}</h2>
            
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">📧 {resume.email}</span>
              <span className="flex items-center gap-1">📱 {resume.phoneNumber}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Giới thiệu bản thân</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {resume.bio || "Ứng viên chưa cung cấp phần tự giới thiệu."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}