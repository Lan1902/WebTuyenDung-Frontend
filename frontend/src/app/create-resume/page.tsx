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
    title: "CV Frontend Developer",
    fullName: "Lan Duong",
    jobTitle: "Lập trình viên Frontend (React/Next.js)",
    email: "landuong.dev@gmail.com",
    phoneNumber: "0901 234 567",
    location: "TP. Hồ Chí Minh",
    bio: "Hơn 2 năm kinh nghiệm phát triển ứng dụng web hiện đại. Mạnh về React, Next.js, TypeScript và tối ưu hóa trải nghiệm người dùng.",
    skills: "ReactJS, Next.js, TypeScript, Tailwind CSS, RESTful API, Git",
    education: "Cử nhân Công nghệ Thông tin - Đại học Ngoại ngữ - Tin học TP.HCM (2022 - 2026)",
    experience: "Lập trình viên Frontend tại Công ty Công nghệ ABC (01/2024 - Hiện tại)\n- Phát triển giao diện web tuyển dụng sử dụng Next.js App Router.\n- Tối ưu hiệu năng tải trang và tích hợp RESTful API.",
  });

  const componentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Cấu hình xuất PDF chuẩn (đã sửa v3)
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `CV_${formData.fullName.replace(/\s+/g, "_") || "Hoso"}`,
    onBeforePrint: async () => {
      setIsExporting(true);
    },
    onAfterPrint: () => {
      setIsExporting(false);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resumeApi.create({
        title: formData.title,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        experiences: [],
        educations: [],
        skills: []
      });
      alert("Lưu CV thành công!");
      router.push("/dashboard");
    } catch (error: any) {
      alert("Lỗi: " + (error.response?.data?.message || "Không thể tạo CV."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* CSS RESET DÙNG RIÊNG KHI IN PDF (Xóa hoàn toàn ngày giờ, header/footer trình duyệt) */}
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
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 py-6">
        
        {/* THANH ĐIỀU HƯỚNG BÊN TRÊN */}
        <div className="container-page mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800 print-hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300"
            >
              Quay lại
            </button>
            <span className="text-slate-300">|</span>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Trình tạo CV Online</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              disabled={isExporting}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {isExporting ? "Đang chuẩn bị PDF..." : "In ra PDF"}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-700"
            >
              {loading ? "Đang lưu..." : "Lưu CV"}
            </button>
          </div>
        </div>

        {/* THÂN TRANG: FORM BÊN TRÁI - PREVIEW BÊN PHẢI */}
        <div className="container-page mx-auto grid gap-8 lg:grid-cols-[1.1fr_1.3fr] items-start">
          
          {/* ================= CỘT TRÁI: FORM ================= */}
          <div className="space-y-4 print-hidden">
            
            {/* CARD 1: THÔNG TIN CÁ NHÂN */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                Thông tin cá nhân & Chức danh
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Tên bản CV (Quản lý)</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Họ và Tên</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Vị trí ứng tuyển</label>
                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Email liên hệ</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Số điện thoại</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Địa chỉ (Thành phố)</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
            </div>

            {/* CARD 2: GIỚI THIỆU BẢN THÂN */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Giới thiệu bản thân
              </h2>
              <p className="text-xs text-slate-500 mb-3">Tóm tắt điểm mạnh và định hướng phát triển sự nghiệp</p>
              <textarea rows={3} name="bio" value={formData.bio} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" placeholder="Viết giới thiệu bản thân..."></textarea>
            </div>

            {/* CARD 3: KINH NGHIỆM LÀM VIỆC */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Kinh nghiệm làm việc
              </h2>
              <p className="text-xs text-slate-500 mb-3">Thông tin chi tiết về các vị trí và dự án đã đảm nhận</p>
              <textarea rows={4} name="experience" value={formData.experience} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            {/* CARD 4: HỌC VẤN */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Học vấn
              </h2>
              <p className="text-xs text-slate-500 mb-3">Trình độ học vấn, bằng cấp và chứng chỉ chuyên môn</p>
              <textarea rows={2} name="education" value={formData.education} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            {/* CARD 5: KỸ NĂNG */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Kỹ năng chuyên môn
              </h2>
              <p className="text-xs text-slate-500 mb-3">Liệt kê danh sách các kỹ năng (phân cách bằng dấu phẩy)</p>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
            </div>

          </div>

          {/* ================= CỘT PHẢI: XEM TRƯỚC CV A4 ================= */}
          <div className="overflow-x-auto print:overflow-visible flex justify-center">
            
            <div
              ref={componentRef}
              className="cv-print-container flex min-h-[297mm] w-[210mm] overflow-hidden bg-white shadow-xl text-slate-900"
            >
              {/* CỘT TRÁI CỦA CV (SIDEBAR NỀN TỐI ELEGANT) */}
              <div className="flex w-[35%] flex-col gap-6 bg-slate-800 p-6 text-slate-100 print:bg-slate-800 print:text-white">
                
                {/* Vòng tròn Avatar */}
                <div className="flex justify-center pt-2">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-slate-600 bg-slate-700 text-4xl font-bold uppercase text-white shadow-md">
                    {formData.fullName ? formData.fullName.charAt(0) : "CV"}
                  </div>
                </div>

                {/* Liên hệ */}
                <section>
                  <h3 className="mb-3 border-b border-slate-600 pb-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                    Liên hệ
                  </h3>
                  <ul className="space-y-3 text-xs">
                    <li className="break-all">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Email</span>
                      {formData.email || "Chưa nhập email"}
                    </li>
                    <li>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Điện thoại</span>
                      {formData.phoneNumber || "Chưa nhập SĐT"}
                    </li>
                    <li>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Địa chỉ</span>
                      {formData.location || "Chưa nhập địa chỉ"}
                    </li>
                  </ul>
                </section>

                {/* Kỹ năng */}
                <section>
                  <h3 className="mb-3 border-b border-slate-600 pb-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                    Kỹ năng
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.skills.split(",").map((skill, idx) => (
                      <span key={idx} className="rounded bg-slate-700 px-2 py-1 text-[11px] font-medium text-emerald-400">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* CỘT PHẢI CỦA CV (NỘI DUNG CHÍNH) */}
              <div className="w-[65%] p-8 pt-10 bg-white">
                
                {/* Tên & Chức danh */}
                <header className="mb-6">
                  <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                    {formData.fullName || "HỌ VÀ TÊN"}
                  </h1>
                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    {formData.jobTitle || "Vị trí ứng tuyển"}
                  </p>
                </header>

                {/* Giới thiệu */}
                {formData.bio && (
                  <section className="mb-6">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                      <span className="h-4 w-1 bg-emerald-500"></span>
                      Giới thiệu bản thân
                    </h3>
                    <p className="text-justify text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                      {formData.bio}
                    </p>
                  </section>
                )}

                {/* Kinh nghiệm làm việc */}
                {formData.experience && (
                  <section className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                      <span className="h-4 w-1 bg-emerald-500"></span>
                      Kinh nghiệm làm việc
                    </h3>
                    <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                      {formData.experience}
                    </div>
                  </section>
                )}

                {/* Học vấn */}
                {formData.education && (
                  <section className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                      <span className="h-4 w-1 bg-emerald-500"></span>
                      Học vấn
                    </h3>
                    <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                      {formData.education}
                    </div>
                  </section>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}