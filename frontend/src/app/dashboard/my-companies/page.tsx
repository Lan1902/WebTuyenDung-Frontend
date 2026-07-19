"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { companyApi } from "@/lib/api";

interface Company {
  id: string;
  ownerId: string;
  name: string;
  industry: string;
  size: string;
  location: string;
}

export default function MyCompaniesPage() {
  const [myCompanies, setMyCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra đăng nhập
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);

    // 2. Gọi API và lọc công ty
    companyApi.getAll()
      .then((res) => {
        const allCompanies = res.data as Company[];
        // Lọc ra các công ty thuộc sở hữu của người dùng hiện tại
        const filtered = allCompanies.filter((c) => c.ownerId === user.id);
        setMyCompanies(filtered);
      })
      .catch((err) => console.error("Lỗi lấy danh sách công ty:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container-page max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-sm font-semibold text-emerald-600 hover:underline">
              &larr; Về Dashboard
            </Link>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">Doanh nghiệp của tôi</h1>
            <p className="mt-2 text-slate-600">Quản lý các hồ sơ công ty mà bạn đang sở hữu.</p>
          </div>
          <Link href="/dashboard/create-company" className="btn-primary">
            + Tạo công ty mới
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-slate-500 font-medium animate-pulse">Đang tải dữ liệu...</p>
          ) : myCompanies.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 mb-4">Bạn chưa tạo hồ sơ doanh nghiệp nào.</p>
              <Link href="/dashboard/create-company" className="btn-accent">
                Tạo doanh nghiệp đầu tiên
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-900">Tên công ty</th>
                  <th className="px-6 py-4 font-bold text-slate-900">Ngành nghề</th>
                  <th className="px-6 py-4 font-bold text-slate-900">Quy mô</th>
                  <th className="px-6 py-4 font-bold text-slate-900">Trụ sở</th>
                </tr>
              </thead>
              <tbody>
                {myCompanies.map((company) => (
                  <tr key={company.id} className="border-b border-slate-100 hover:bg-slate-50 transition cursor-pointer">
                    <td className="px-6 py-4 font-bold text-emerald-700">{company.name}</td>
                    <td className="px-6 py-4">
                      <span className="chip bg-slate-100 text-slate-700">{company.industry || "Chưa cập nhật"}</span>
                    </td>
                    <td className="px-6 py-4">{company.size || "Chưa cập nhật"}</td>
                    <td className="px-6 py-4">{company.location || "Chưa cập nhật"}</td>
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