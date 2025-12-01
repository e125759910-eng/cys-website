"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Warranty {
  id: string;
  name: string;
  email: string;
  serial: string;
  date: string;
  registeredAt: string;
}

export default function AdminDashboardPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchWarranties();
  }, []);

  const fetchWarranties = async () => {
    try {
      const res = await fetch("/api/admin/warranties");
      
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      const data = await res.json();
      
      if (res.ok) {
        setWarranties(data.warranties || []);
      } else {
        setError(data.error || "載入失敗");
      }
    } catch (err) {
      setError("連線錯誤");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#FFD700]">載入中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFE44D] to-[#FFD700]">
            保固管理後台
          </h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            登出
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="bg-black/60 border border-[#FFD700]/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FFD700]/10 border-b border-[#FFD700]/30">
                <tr>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">登記時間</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">姓名</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">產品序號</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">購買日期</th>
                </tr>
              </thead>
              <tbody>
                {warranties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-neutral-400">
                      目前沒有保固登記資料
                    </td>
                  </tr>
                ) : (
                  warranties.map((warranty) => (
                    <tr
                      key={warranty.id}
                      className="border-b border-neutral-800 hover:bg-black/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-neutral-300">
                        {new Date(warranty.registeredAt).toLocaleString("zh-TW")}
                      </td>
                      <td className="px-6 py-4 text-neutral-300">{warranty.name}</td>
                      <td className="px-6 py-4 text-neutral-300">{warranty.email}</td>
                      <td className="px-6 py-4 text-neutral-300 font-mono text-sm">
                        {warranty.serial}
                      </td>
                      <td className="px-6 py-4 text-neutral-300">
                        {warranty.date || "未提供"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-neutral-500 text-center">
          共 {warranties.length} 筆保固登記
        </div>
      </div>
    </main>
  );
}

