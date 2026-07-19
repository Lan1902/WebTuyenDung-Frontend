"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { applicationApi } from "@/lib/api";

// Từ điển dịch trạng thái
const statusLabels: Record<string, string> = {
  pending: "Chờ duyệt",
  reviewed: "Đã xem",
  shortlisted: "Chọn phỏng vấn",
  rejected: "Từ chối",
  accepted: "Đã nhận",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  reviewed: "bg-blue-50 text-blue-700 border-blue-200",
  shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
  accepted: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUserRole(JSON.parse(userStr).role);
    }

    applicationApi.getById(params.id)
      .then((res) => setApp(res.data))
      .catch((err) => {
        console.error("Lỗi:", err);
        alert("Không tìm thấy đơn ứng tuyển!");
        router.push("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await applicationApi.updateStatus(params.id, newStatus);
      setApp({ ...app, status: newStatus });
      alert(`Đã cập nhật trạng thái thành: ${statusLabels[newStatus.toLowerCase()]}`);
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn rút lại đơn ứng tuyển này không?")) return;
    try {
      await applicationApi.delete(params.id);
      alert("Đã rút đơn ứng tuyển thành công!");
      router.push("/dashboard");
    } catch (error) {
      alert("Lỗi khi rút đơn.");
    }
  };

  if (loading) return <div className="p-20 text-center dark:text-white">Đang tải...</div>;
  if (!app) return null;

  const isEmployer = userRole === "employer" || userRole === "admin";
  
  // Xử lý triệt để việc viết hoa/thường từ Database
  const rawStatus = (app.status || "pending").toLowerCase();
  const displayStatus = statusLabels[rawStatus] || app.status;
  const colorClass = statusColors[rawStatus] || "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-10">
      <div className="container-page max-w-3xl">
        <Link href="/dashboard" className="text-sm font-semibold text-emerald-600 hover:underline">
          &larr; Quay lại Dashboard
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-8 shadow-sm">
          <div className="flex justify-between items-start border-b border-slate-100 dark:border-gray-700 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isEmployer ? `Hồ sơ: ${app.candidateName}` : `Vị trí: ${app.jobTitle}`}
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {isEmployer ? `Ứng tuyển cho: ${app.jobTitle}` : `Công ty: ${app.companyName}`}
              </p>
              <p className="text-sm text-slate-500 mt-1">Ngày nộp: {new Date(app.appliedAt).toLocaleDateString('vi-VN')}</p>
            </div>
            
            <span className={`chip border ${colorClass}`}>{displayStatus}</span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Thư giới thiệu (Cover Letter)</h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-700 text-slate-700 dark:text-slate-200">
                {app.coverLetter || "Ứng viên không cung cấp thư giới thiệu."}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Hồ sơ đính kèm (CV)</h3>
              {/* LIÊN KẾT ĐẾN TRANG XEM CV ONLINE, KHÔNG TẢI PDF NỮA */}
              <Link href={app.resumeUrl || "#"} className="text-emerald-600 hover:underline font-medium flex items-center gap-2">
                📄 Mở xem CV trực tuyến của ứng viên
              </Link>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-gray-700 flex flex-wrap gap-4">
            {isEmployer ? (
              <>
                <p className="w-full text-sm font-bold text-slate-900 dark:text-white mb-2">Đánh giá ứng viên:</p>
                <button onClick={() => handleUpdateStatus("Reviewed")} className="btn-secondary dark:bg-gray-700 dark:text-white">Đánh dấu đã xem</button>
                <button onClick={() => handleUpdateStatus("Shortlisted")} className="btn-primary">Chọn phỏng vấn</button>
                <button onClick={() => handleUpdateStatus("Rejected")} className="btn-outline text-rose-600 border-rose-200 hover:bg-rose-50">Từ chối</button>
              </>
            ) : (
              <button onClick={handleDelete} className="btn-outline text-rose-600 border-rose-200 hover:bg-rose-50">
                Rút đơn ứng tuyển
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}