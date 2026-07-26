"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { resumeApi } from "@/lib/api";
import { useReactToPrint } from "react-to-print";

export default function CreateResumePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Dữ liệu Form
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
  });

  // Tham chiếu dùng để in PDF
  const componentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Hàm xử lý xuất PDF
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `CV_${formData.fullName.replace(/\s+/g, "_") || "Chua_Co_Ten"}`,
    onBeforeGetContent: () => {
      setIsExporting(true);
      return Promise.resolve();
    },
    onAfterPrint: () => setIsExporting(false),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resumeApi.create({
        ...formData,
        experiences: [], 
        educations: [], 
        skills: []
      });
      alert("Tạo CV thành công! Giờ bạn có thể dùng nó để ứng tuyển.");
      router.push("/dashboard");
    } catch (error: any) {
      alert("Lỗi: " + (error.response?.data?.message || "Không thể tạo CV."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-10">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.2fr] items-start">
        
        {/* ================= PHẦN 1: FORM NHẬP LIỆU ================= */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700 print:hidden">
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
            
            <div className="pt-4 flex gap-4">
              <button type="submit" disabled={loading} className="w-full btn-primary py-3">
                {loading ? "Đang lưu..." : "Lưu hồ sơ vào Database"}
              </button>
              
              <button type="button" onClick={handlePrint} disabled={isExporting} className="w-full btn-secondary py-3 bg-emerald-600 text-white hover:bg-emerald-700">
                {isExporting ? "Đang xử lý..." : "Tải PDF ngay"}
              </button>
            </div>
          </form>
        </div>

        {/* ================= PHẦN 2: PREVIEW ELEGANT CV ================= */}
        {/* Vùng này có thanh cuộn ngang để không bị vỡ layout trên màn nhỏ */}
        <div className="overflow-x-auto print:overflow-visible">
          
          {/* VÙNG ĐƯỢC IN (Căn đúng khổ A4) */}
          <div ref={componentRef} className="mx-auto flex min-h-[297mm] w-[210mm] overflow-hidden bg-white shadow-2xl print:m-0 print:shadow-none">
            
            {/* CỘT TRÁI (SIDEBAR) */}
            <div className="flex w-[35%] flex-col gap-8 bg-slate-800 p-8 text-slate-100 print:bg-slate-800 print:text-white print:break-inside-avoid">
              
              <div className="flex justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-slate-600 bg-slate-700 text-5xl font-bold text-white shadow-lg uppercase">
                  {formData.fullName ? formData.fullName.charAt(0) : "U"}
                </div>
              </div>

              <section>
                <h2 className="mb-4 border-b border-slate-600 pb-2 text-sm font-bold uppercase tracking-widest text-slate-300">
                  Liên hệ
                </h2>
                <ul className="space-y-4 text-sm">
                  <li className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Email</span> 
                    <span className="break-all font-medium">{formData.email || "Chưa cập nhật"}</span>
                  </li>
                  <li className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Điện thoại</span> 
                    <span className="font-medium">{formData.phoneNumber || "Chưa cập nhật"}</span>
                  </li>
                </ul>
              </section>

              {/* KHỐI KỸ NĂNG MẪU (Bổ sung sau) */}
              <section>
                <h2 className="mb-4 border-b border-slate-600 pb-2 text-sm font-bold uppercase tracking-widest text-slate-300">
                  Kỹ năng
                </h2>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Giao tiếp hiệu quả
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Làm việc nhóm
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Quản lý thời gian
                  </li>
                </ul>
              </section>
            </div>

            {/* CỘT PHẢI (MAIN CONTENT) */}
            <div className="w-[65%] p-8 pt-12 text-slate-900 bg-white">
              <header className="mb-8">
                <h1 className="text-3xl font-black uppercase tracking-tight">
                  {formData.fullName || "Tên của bạn"}
                </h1>
                <p className="mt-2 text-xl font-semibold text-emerald-600">
                  {formData.title || "Vị trí ứng tuyển"}
                </p>
              </header>

              <section className="mb-8">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-slate-900">
                  <span className="h-5 w-1.5 bg-emerald-500"></span>
                  Tóm tắt mục tiêu
                </h2>
                <p className="text-justify text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {formData.bio || "Giới thiệu ngắn gọn về bản thân, định hướng phát triển nghề nghiệp..."}
                </p>
              </section>

              {/* KHỐI KINH NGHIỆM MẪU (Bổ sung sau) */}
              <section className="mb-8">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold uppercase tracking-widest text-slate-900">
                  <span className="h-5 w-1.5 bg-emerald-500"></span>
                  Kinh nghiệm làm việc
                </h2>
                <div className="relative">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-bold text-slate-800">Tên vị trí công việc</h3>
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                      Năm bắt đầu – Hiện tại
                    </span>
                  </div>
                  <p className="mt-1 font-semibold text-emerald-600">Tên công ty / Tổ chức</p>
                  <ul className="mt-2 list-inside list-disc space-y-1.5 text-justify text-sm leading-relaxed text-slate-700 marker:text-slate-400">
                    <li>Mô tả chi tiết công việc bạn đã đảm nhận.</li>
                    <li>Liệt kê các thành tích đạt được trong quá trình làm việc.</li>
                  </ul>
                </div>
              </section>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}