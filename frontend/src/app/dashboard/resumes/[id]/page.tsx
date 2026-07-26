"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { resumeApi } from "@/lib/api";
import { useReactToPrint } from "react-to-print";

export default function ViewResumePage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // In PDF chuẩn A4
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `CV_${resume?.fullName?.replace(/\s+/g, "_") || "Ung_Vien"}`,
    onBeforePrint: async () => {
      setIsExporting(true);
    },
    onAfterPrint: () => {
      setIsExporting(false);
    },
  });

  useEffect(() => {
    if (!resumeId) return;
    const fetchResume = async () => {
      try {
        const res = await resumeApi.getById(resumeId);
        setResume(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin CV:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        Đang tải thông tin CV...
      </div>
    );
  }

  // Dữ liệu hiển thị (Lấy từ API hoặc dùng mặc định)
  const cvData = {
    fullName: resume?.fullName || "Lan Duong",
    jobTitle: resume?.jobTitle || "Lập trình viên Frontend (React/Next.js)",
    email: resume?.email || "landuong.dev@gmail.com",
    phoneNumber: resume?.phoneNumber || "0901 234 567",
    location: resume?.location || "TP. Hồ Chí Minh",
    bio: resume?.bio || "Hơn 2 năm kinh nghiệm phát triển ứng dụng web hiện đại. Mạnh về React, Next.js, TypeScript.",
    skills: resume?.skills ? (Array.isArray(resume.skills) ? resume.skills.join(", ") : resume.skills) : "ReactJS, Next.js, TypeScript, Tailwind CSS",
    languages: resume?.languages || "Tiếng Anh (TOEIC 750), Tiếng Việt (Bản ngữ)",
    education: resume?.education || "Cử nhân Công nghệ Thông tin - Đại học HUFLIT (2023 - 2027)",
    experience: resume?.experience || "Lập trình viên Frontend tại Công ty Công nghệ ABC (01/2024 - Hiện tại)",
    projects: resume?.projects || "Dự án Web Tuyển Dụng Mini (01/2025 - 03/2025)",
    awards: resume?.awards || "Học bổng Khuyến khích Học tập Học kỳ I (2024 - 2025)"
  };

  return (
    <>
      {/* CSS RESET DÙNG KHI IN PDF (Xóa hoàn toàn ngày giờ, header/footer trình duyệt) */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, nav, .print-hidden, .no-print {
            display: none !important;
          }
          .cv-print-container {
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 py-8">
        
        {/* THANH THAO TÁC CỦA NHÀ TUYỂN DỤNG */}
        <div className="container-page mx-auto mb-6 max-w-4xl flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800 print-hidden">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300"
          >
            ← Quay lại
          </button>
          <button
            type="button"
            onClick={handlePrint}
            disabled={isExporting}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isExporting ? "Đang chuẩn bị PDF..." : "In ra PDF"}
          </button>
        </div>

        {/* KHUNG HIỂN THỊ CV A4 ĐẸP CHUẨN KHI XEM VÀ IN */}
        <div className="flex justify-center">
          <div
            ref={componentRef}
            className="cv-print-container flex min-h-[297mm] w-[210mm] overflow-hidden bg-white shadow-xl text-slate-900"
          >
            {/* CỘT TRÁI CV */}
            <div className="flex w-[35%] flex-col gap-6 bg-slate-800 p-6 text-slate-100 print:bg-slate-800 print:text-white">
              <div className="flex justify-center pt-2">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-slate-600 bg-slate-700 text-4xl font-bold uppercase text-white shadow-md">
                  {cvData.fullName.charAt(0)}
                </div>
              </div>

              <section>
                <h3 className="mb-3 border-b border-slate-600 pb-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                  Liên hệ
                </h3>
                <ul className="space-y-3 text-xs">
                  <li className="break-all">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Email</span>
                    {cvData.email}
                  </li>
                  <li>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Điện thoại</span>
                    {cvData.phoneNumber}
                  </li>
                  <li>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Địa chỉ</span>
                    {cvData.location}
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-3 border-b border-slate-600 pb-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                  Kỹ năng
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {cvData.skills.split(",").map((skill: string, idx: number) => (
                    <span key={idx} className="rounded bg-slate-700 px-2 py-1 text-[11px] font-medium text-emerald-400">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="mb-3 border-b border-slate-600 pb-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                  Ngoại ngữ
                </h3>
                <p className="text-xs leading-relaxed text-slate-200">
                  {cvData.languages}
                </p>
              </section>
            </div>

            {/* CỘT PHẢI CV */}
            <div className="w-[65%] p-8 pt-10 bg-white">
              <header className="mb-6">
                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                  {cvData.fullName}
                </h1>
                <p className="mt-1 text-lg font-bold text-emerald-600">
                  {cvData.jobTitle}
                </p>
              </header>

              <section className="mb-6">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                  <span className="h-4 w-1 bg-emerald-500"></span>
                  Giới thiệu bản thân
                </h3>
                <p className="text-justify text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {cvData.bio}
                </p>
              </section>

              <section className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                  <span className="h-4 w-1 bg-emerald-500"></span>
                  Kinh nghiệm làm việc
                </h3>
                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {cvData.experience}
                </div>
              </section>

              <section className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                  <span className="h-4 w-1 bg-emerald-500"></span>
                  Dự án nổi bật
                </h3>
                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {cvData.projects}
                </div>
              </section>

              <section className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                  <span className="h-4 w-1 bg-emerald-500"></span>
                  Học vấn
                </h3>
                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {cvData.education}
                </div>
              </section>

              <section className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                  <span className="h-4 w-1 bg-emerald-500"></span>
                  Giải thưởng & Thành tích
                </h3>
                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {cvData.awards}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}