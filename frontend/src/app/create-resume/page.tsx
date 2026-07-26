"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resumeApi } from "@/lib/api";
import { useReactToPrint } from "react-to-print";

export default function CreateResumePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    jobTitle: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
    skills: "",
    languages: "",
    education: "",
    experience: "",
    projects: "",
    certificates: "",
    awards: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // 1. TỰ ĐỘNG LẤY LẠI CV ĐÃ LƯU KHI MỞ TRANG
  useEffect(() => {
    const loadSavedResume = async () => {
      // Đọc từ localStorage trước
      const localSaved = localStorage.getItem("user_cv_data");
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          setFormData(parsed.formData || parsed);
          if (parsed.avatarUrl) setAvatarUrl(parsed.avatarUrl);
        } catch (e) {
          console.error("Lỗi đọc cache local", e);
        }
      }

      // Đọc tiếp từ Backend API
      try {
        const res = await resumeApi.getAll();
        if (res.data && res.data.length > 0) {
          const myCv = res.data[0]; // Lấy bản CV gần nhất
          setFormData(prev => ({
            ...prev,
            title: myCv.title || prev.title,
            fullName: myCv.fullName || prev.fullName,
            email: myCv.email || prev.email,
            phoneNumber: myCv.phoneNumber || prev.phoneNumber,
            bio: myCv.bio || prev.bio,
          }));
        }
      } catch (error) {
        console.log("Chưa có CV trên máy chủ hoặc chưa đăng nhập API");
      }
    };

    loadSavedResume();
  }, []);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. LƯU CV VÀO CẢ LOCALSTORAGE LẪN DATABASE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Tự động lấy dữ liệu nhập hoặc gán giá trị mặc định chuẩn để tránh bị gửi chuỗi rỗng ""
    const realFullName = formData.fullName.trim() || "Ứng Viên";
    const realTitle = formData.title.trim() || `CV của ${realFullName}`;
    const realEmail = formData.email.trim() || "ungvien@gmail.com";

    setLoading(true);

    // Lưu dự phòng vào LocalStorage
    localStorage.setItem("user_cv_data", JSON.stringify({ formData, avatarUrl }));

    try {
      // 2. Chuẩn hóa Payload đảm bảo không trường nào bị rỗng làm hỏng Validation của .NET
      const payload = {
        title: realTitle,
        fullName: realFullName,
        email: realEmail,
        phoneNumber: formData.phoneNumber.trim() || "0901234567",
        bio: formData.bio.trim() || "Chưa cập nhật giới thiệu bản thân",
        
        jobTitle: formData.jobTitle.trim() || "Lập trình viên",
        location: formData.location.trim() || "TP. Hồ Chí Minh",
        languages: formData.languages.trim() || "Tiếng Việt",
        projects: formData.projects.trim() || "",
        certificates: formData.certificates.trim() || "",
        awards: formData.awards.trim() || "",

        // Mảng Kỹ năng
        skills: formData.skills 
          ? formData.skills.split(",").map(s => s.trim()).filter(Boolean) 
          : ["React", "Next.js"],
        experiences: [], 
        educations: []
      };

      console.log("Dữ liệu gửi lên API Backend:", payload);

      await resumeApi.create(payload);
      
      alert("Lưu CV lên hệ thống thành công! Bây giờ bạn có thể đi ứng tuyển.");
      router.push("/jobs");
      
    } catch (error: any) {
      console.error("Lỗi chi tiết khi lưu CV:", error);
      
      let errorDetails = "";
      if (error.response?.data?.errors) {
        errorDetails = JSON.stringify(error.response.data.errors, null, 2);
      } else {
        errorDetails = error.response?.data?.message || error.message || "Lỗi không xác định";
      }
      
      if (error.response?.status === 401) {
        alert("Bạn chưa đăng nhập! Vui lòng đăng nhập với vai trò Ứng viên.");
      } else if (error.response?.status === 403) {
        alert("Tài khoản không có quyền tạo CV (Có thể bạn đang dùng tài khoản Nhà Tuyển Dụng).");
      } else {
        alert(`Bị Backend từ chối (Lỗi 400). Chi tiết lỗi:\n\n${errorDetails}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <div className="min-h-screen bg-slate-100 dark:bg-gray-900 py-6">
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

        <div className="container-page mx-auto grid gap-8 lg:grid-cols-[1.1fr_1.3fr] items-start">
          <div className="space-y-4 print-hidden">
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
                Thông tin cá nhân & Chức danh
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Ảnh đại diện (Tùy chọn)</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-700 dark:file:text-slate-300 cursor-pointer" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Tên bản CV (Quản lý)</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="VD: CV Frontend Developer" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Họ và Tên</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="VD: Lan Duong" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Vị trí ứng tuyển</label>
                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="VD: Lập trình viên Frontend" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Email liên hệ</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="VD: landuong@gmail.com" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Số điện thoại</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="VD: 0901 234 567" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Địa chỉ (Thành phố)</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="VD: TP. Hồ Chí Minh" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Giới thiệu bản thân
              </h2>
              <textarea rows={3} name="bio" value={formData.bio} onChange={handleChange} placeholder="VD: Hơn 2 năm kinh nghiệm phát triển ứng dụng web hiện đại..." className="w-full input-base text-sm dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Kinh nghiệm làm việc
              </h2>
              <textarea rows={4} name="experience" value={formData.experience} onChange={handleChange} placeholder="VD: Lập trình viên Frontend tại Công ty ABC..." className="w-full input-base text-sm dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Dự án nổi bật
              </h2>
              <textarea rows={4} name="projects" value={formData.projects} onChange={handleChange} placeholder="VD: Dự án Web Tuyển Dụng Mini..." className="w-full input-base text-sm dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Học vấn
              </h2>
              <textarea rows={2} name="education" value={formData.education} onChange={handleChange} placeholder="VD: Cử nhân CNTT - Đại học HUFLIT (2023 - 2027)" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Kỹ năng chuyên môn
              </h2>
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="VD: ReactJS, Next.js, Tailwind CSS" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Ngoại ngữ
              </h2>
              <input type="text" name="languages" value={formData.languages} onChange={handleChange} placeholder="VD: Tiếng Anh (TOEIC 750)" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Chứng chỉ
              </h2>
              <input type="text" name="certificates" value={formData.certificates} onChange={handleChange} placeholder="VD: Chứng chỉ TOEIC 750" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 dark:bg-gray-800 dark:border-gray-700">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider">
                Giải thưởng & Thành tích
              </h2>
              <input type="text" name="awards" value={formData.awards} onChange={handleChange} placeholder="VD: Học bổng Khuyến khích Học tập" className="w-full input-base text-sm dark:bg-gray-700 dark:text-white" />
            </div>
          </div>

          <div className="overflow-x-auto print:overflow-visible flex justify-center">
            <div
              ref={componentRef}
              className="cv-print-container flex min-h-[297mm] w-[210mm] overflow-hidden bg-white shadow-xl text-slate-900"
            >
              <div className="flex w-[35%] flex-col gap-6 bg-slate-800 p-6 text-slate-100 print:bg-slate-800 print:text-white">
                <div className="flex justify-center pt-2">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-28 w-28 rounded-full object-cover border-4 border-slate-600 shadow-md bg-white" />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-slate-600 bg-slate-700 text-4xl font-bold uppercase text-white shadow-md">
                      {formData.fullName ? formData.fullName.charAt(0) : "CV"}
                    </div>
                  )}
                </div>

                <section>
                  <h3 className="mb-3 border-b border-slate-600 pb-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                    Liên hệ
                  </h3>
                  <ul className="space-y-3 text-xs">
                    <li className="break-all">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Email</span>
                      {formData.email || "landuong.dev@gmail.com"}
                    </li>
                    <li>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Điện thoại</span>
                      {formData.phoneNumber || "0901 234 567"}
                    </li>
                    <li>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">Địa chỉ</span>
                      {formData.location || "TP. Hồ Chí Minh"}
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3 border-b border-slate-600 pb-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                    Kỹ năng
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(formData.skills || "ReactJS, Next.js, TypeScript, Tailwind CSS").split(",").map((skill, idx) => (
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
                    {formData.languages || "Tiếng Anh (TOEIC 750), Tiếng Việt (Bản ngữ)"}
                  </p>
                </section>

                <section>
                  <h3 className="mb-3 border-b border-slate-600 pb-1 text-xs font-bold uppercase tracking-widest text-slate-300">
                    Chứng chỉ
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-200">
                    {formData.certificates || "Chứng chỉ Tiếng Anh TOEIC 750 (2024)"}
                  </p>
                </section>
              </div>

              <div className="w-[65%] p-8 pt-10 bg-white">
                <header className="mb-6">
                  <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                    {formData.fullName || "LAN DUONG"}
                  </h1>
                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    {formData.jobTitle || "Lập trình viên Frontend (React/Next.js)"}
                  </p>
                </header>

                <section className="mb-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                    <span className="h-4 w-1 bg-emerald-500"></span>
                    Giới thiệu bản thân
                  </h3>
                  <p className="text-justify text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {formData.bio || "Hơn 2 năm kinh nghiệm phát triển ứng dụng web hiện đại. Mạnh về React, Next.js, TypeScript và tối ưu hóa trải nghiệm người dùng."}
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                    <span className="h-4 w-1 bg-emerald-500"></span>
                    Kinh nghiệm làm việc
                  </h3>
                  <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {formData.experience || "Lập trình viên Frontend tại Công ty Công nghệ ABC (01/2024 - Hiện tại)\n- Phát triển giao diện web tuyển dụng sử dụng Next.js.\n- Tối ưu hiệu năng tải trang và tích hợp RESTful API."}
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                    <span className="h-4 w-1 bg-emerald-500"></span>
                    Dự án nổi bật
                  </h3>
                  <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {formData.projects || "Dự án Web Tuyển Dụng Mini (01/2025 - 03/2025)\n- Xây dựng hệ thống tuyển dụng Fullstack với Next.js và MySQL Cloud.\n- Thiết kế tính năng tạo CV trực tuyến và xuất PDF chuẩn ATS."}
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                    <span className="h-4 w-1 bg-emerald-500"></span>
                    Học vấn
                  </h3>
                  <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {formData.education || "Cử nhân Công nghệ Thông tin - Đại học Ngoại ngữ - Tin học TP.HCM (2023 - 2027)"}
                  </div>
                </section>

                <section className="mb-6">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-900">
                    <span className="h-4 w-1 bg-emerald-500"></span>
                    Giải thưởng & Thành tích
                  </h3>
                  <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {formData.awards || "Học bổng Khuyến khích Học tập Học kỳ I (2024 - 2025)"}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}