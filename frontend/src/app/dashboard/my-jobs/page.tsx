"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jobApi } from "@/lib/api";

export default function MyJobsPage() {
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    jobApi.getAll()
      .then((res) => {
        const allJobs = res.data as any[];
        const filtered = allJobs.filter((j: any) => j.authorId === user.id);
        setMyJobs(filtered);
      })
      .catch((err) => console.error("Lỗi lấy danh sách việc làm:", err))
      .finally(() => setLoading(false));
  };

  // Tính năng Xóa bài tuyển dụng (Soft delete từ Backend)
  const handleDeleteJob = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này không?")) return;
    try {
      await jobApi.delete(id);
      alert("🎉 Đã xóa tin tuyển dụng thành công!");
      loadJobs(); // Tải lại danh sách bài viết
    } catch (error) {
      alert("Lỗi khi xóa tin tuyển dụng.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-10">
      <div className="container-page max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-sm font-semibold text-emerald-600 hover:underline">
              &larr; Về Dashboard
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">Việc làm đã đăng</h1>
          </div>
          <Link href="/dashboard/post-job" className="btn-primary">
            + Đăng tin mới
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-slate-500">Đang tải dữ liệu...</p>
          ) : myJobs.length === 0 ? (
            <p className="p-8 text-center text-slate-500">Bạn chưa đăng tin tuyển dụng nào.</p>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-gray-700 text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Tiêu đề công việc</th>
                  <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Hình thức</th>
                  <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Lượt nộp</th>
                  <th className="px-6 py-4 font-bold text-slate-900 dark:text-white">Trạng thái</th>
                  <th className="px-6 py-4 font-bold text-slate-900 dark:text-white text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {myJobs.map((job) => (
                  <tr key={job.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{job.title}</td>
                    <td className="px-6 py-4">{job.jobType}</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">{job.applicationsCount} CV</td>
                    <td className="px-6 py-4">
                      <span className={`chip ${job.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {job.isActive ? 'Đang mở' : 'Đã đóng'}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <Link href={`/dashboard/edit-job/${job.id}`} className="btn-secondary py-1.5 px-3 text-xs dark:bg-gray-600">
                        Sửa
                      </Link>
                      <button onClick={() => handleDeleteJob(job.id)} className="btn-outline border-rose-200 text-rose-600 hover:bg-rose-50 py-1.5 px-3 text-xs">
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}