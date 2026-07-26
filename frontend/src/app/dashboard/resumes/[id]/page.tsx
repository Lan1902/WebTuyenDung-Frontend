"use client";

import { useEffect, useState } from "react";
import { resumeApi } from "@/lib/api";
import Link from "next/link";

export default function ResumeViewerPage({ params }: { params: { id: string } }) {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <>
      {/* Thêm CSS Global để ẩn Navbar của layout tổng và bỏ header/footer mặc định của trình duyệt khi in */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0 !important;
          }
          body {
            background-color: #ffffff !important;
            padding: 1.5cm !important; /* Tạo lề cho bản in PDF */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, nav, .print-hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* Thêm print:bg-white và print:py-0 để chuẩn hóa nền khi in */}
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-10 print:bg-white print:py-0">
        <div className="container-page max-w-3xl print:max-w-full print:px-0">
          
          {/* Nút điều hướng - Sẽ bị ẩn khi in nhờ class print-hidden */}
          <div className="mb-6 flex justify-between items-center print-hidden">
            <button onClick={() => window.history.back()} className="text-sm font-semibold text-emerald-600 hover:underline">
              &larr; Quay lại
            </button>
            <button onClick={() => window.print()} className="btn-primary">🖨️ In ra PDF</button>
          </div>

          {/* Xóa border, shadow, và padding dư thừa khi in */}
          <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg border border-slate-200 dark:border-gray-700 print:shadow-none print:border-none print:p-0">
            <div className="border-b border-slate-200 dark:border-gray-700 pb-6 mb-6">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight print:text-slate-900">
                {resume.fullName || "Chưa cập nhật tên"}
              </h1>
              <h2 className="text-xl font-medium text-emerald-600 mt-2">{resume.title}</h2>
              
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 print:text-slate-700">
                <span className="flex items-center gap-1">📧 {resume.email}</span>
                <span className="flex items-center gap-1">📱 {resume.phoneNumber}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-wider print:text-slate-900">Giới thiệu bản thân</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line print:text-slate-700">
                {resume.bio || "Ứng viên chưa cung cấp phần tự giới thiệu."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}