"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { applicationApi, resumeApi } from "@/lib/api"; // Thêm resumeApi vào đây

export default function ApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== "candidate") {
      alert("Chỉ tài khoản Ứng viên mới có thể nộp hồ sơ!");
      return;
    }

    setLoading(true);
    try {
      // 1. KIỂM TRA HỒ SƠ ỨNG VIÊN ĐÃ TẠO TRONG HỆ THỐNG
      const resumeRes = await resumeApi.getAll();
      const resumes = resumeRes.data as any[];

      if (resumes.length === 0) {
        alert("Bạn chưa có CV nào trong hệ thống! Vui lòng tạo CV trước khi ứng tuyển.");
        window.location.href = "/create-resume";
        return;
      }

      // 2. Lấy CV mới nhất của ứng viên tạo link nội bộ
      const myResume = resumes[resumes.length - 1];
      const cvInternalLink = `/dashboard/resumes/${myResume.id}`;

      // 3. Gửi đơn ứng tuyển kèm link CV thật
      await applicationApi.create({
        jobId: jobId,
        resumeUrl: cvInternalLink, // Thay link cứng thành link trỏ vào hệ thống
        coverLetter: "Tôi rất mong muốn được làm việc tại công ty."
      });
      
      alert(" Ứng tuyển thành công bằng CV trực tuyến!");
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.response?.data?.message || "Hệ thống đang bận. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      type="button" 
      onClick={handleApply}
      disabled={loading}
      className="btn-secondary dark:bg-gray-700 dark:text-white dark:border-gray-600 disabled:opacity-50"
    >
      {loading ? "Đang xử lý..." : "Ứng tuyển nhanh"}
    </button>
  );
}