"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Warranty {
  id: string;
  customerName: string;
  phone: string;
  carModel: string;
  project: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyPeriod: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminDashboardPage() {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingWarranty, setEditingWarranty] = useState<Warranty | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    carModel: "",
    project: "",
    warrantyStartDate: "",
    warrantyPeriod: 12,
  });
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

  const handleAdd = () => {
    setEditingWarranty(null);
    setFormData({
      customerName: "",
      phone: "",
      carModel: "",
      project: "",
      warrantyStartDate: new Date().toISOString().split("T")[0],
      warrantyPeriod: 12,
    });
    setShowForm(true);
  };

  const handleEdit = (warranty: Warranty) => {
    setEditingWarranty(warranty);
    setFormData({
      customerName: warranty.customerName,
      phone: warranty.phone,
      carModel: warranty.carModel,
      project: warranty.project,
      warrantyStartDate: warranty.warrantyStartDate.split("T")[0],
      warrantyPeriod: warranty.warrantyPeriod,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除此保固資料嗎？")) return;

    setError("");
    try {
      const res = await fetch(`/api/admin/warranties?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await fetchWarranties();
      } else {
        setError(data.error || data.details || "刪除失敗");
        console.error("Delete error:", data);
      }
    } catch (err) {
      console.error("Delete exception:", err);
      setError(err instanceof Error ? err.message : "刪除失敗");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = "/api/admin/warranties";
      const method = editingWarranty ? "PUT" : "POST";
      const body = editingWarranty
        ? { id: editingWarranty.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setShowForm(false);
        setEditingWarranty(null);
        setFormData({
          customerName: "",
          phone: "",
          carModel: "",
          project: "",
          warrantyStartDate: new Date().toISOString().split("T")[0],
          warrantyPeriod: 12,
        });
        await fetchWarranties();
      } else {
        setError(data.error || data.details || "操作失敗");
        console.error("Submit error:", data);
      }
    } catch (err) {
      console.error("Submit exception:", err);
      setError(err instanceof Error ? err.message : "操作失敗");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#FFD700]">載入中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFE44D] to-[#FFD700]">
            保固管理後台
          </h1>
          <div className="flex gap-4">
            <button
              onClick={handleAdd}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold hover:opacity-90 transition-opacity"
            >
              新增保固
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              登出
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8 p-6 bg-black/60 border border-[#FFD700]/30 rounded-2xl">
            <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
              {editingWarranty ? "編輯保固資料" : "新增保固資料"}
            </h2>
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-300 mb-2">客戶姓名 *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-black/40 border border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-2">聯絡電話 *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-black/40 border border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-2">車型 *</label>
                <input
                  type="text"
                  value={formData.carModel}
                  onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                  required
                  placeholder="例如：BMW 3 Series"
                  className="w-full p-3 rounded-lg bg-black/40 border border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-2">施工項目 *</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                  required
                  placeholder="例如：全車消光白"
                  className="w-full p-3 rounded-lg bg-black/40 border border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-2">保固開始日期 *</label>
                <input
                  type="date"
                  value={formData.warrantyStartDate}
                  onChange={(e) => setFormData({ ...formData, warrantyStartDate: e.target.value })}
                  required
                  className="w-full p-3 rounded-lg bg-black/40 border border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-2">保固期限（月） *</label>
                <input
                  type="number"
                  value={formData.warrantyPeriod}
                  onChange={(e) => setFormData({ ...formData, warrantyPeriod: parseInt(e.target.value) || 12 })}
                  required
                  min="1"
                  className="w-full p-3 rounded-lg bg-black/40 border border-[#FFD700]/30 text-white focus:border-[#FFD700] focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold hover:opacity-90 transition-opacity"
                >
                  {editingWarranty ? "更新" : "新增"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingWarranty(null);
                  }}
                  className="flex-1 py-3 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-black/60 border border-[#FFD700]/30 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FFD700]/10 border-b border-[#FFD700]/30">
                <tr>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">客戶姓名</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">聯絡電話</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">車型</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">施工項目</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">保固開始</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">保固結束</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">期限</th>
                  <th className="px-6 py-4 text-left text-[#FFD700] font-semibold">操作</th>
                </tr>
              </thead>
              <tbody>
                {warranties.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-neutral-400">
                      目前沒有保固資料，請點擊「新增保固」開始新增
                    </td>
                  </tr>
                ) : (
                  warranties.map((warranty) => (
                    <tr
                      key={warranty.id}
                      className="border-b border-neutral-800 hover:bg-black/40 transition-colors"
                    >
                      <td className="px-6 py-4 text-neutral-300">{warranty.customerName}</td>
                      <td className="px-6 py-4 text-neutral-300">{warranty.phone}</td>
                      <td className="px-6 py-4 text-neutral-300">{warranty.carModel}</td>
                      <td className="px-6 py-4 text-neutral-300">{warranty.project}</td>
                      <td className="px-6 py-4 text-neutral-300">{formatDate(warranty.warrantyStartDate)}</td>
                      <td className="px-6 py-4 text-neutral-300">{formatDate(warranty.warrantyEndDate)}</td>
                      <td className="px-6 py-4 text-neutral-300">{warranty.warrantyPeriod} 個月</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(warranty)}
                            className="px-3 py-1 rounded bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition-colors text-sm"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleDelete(warranty.id)}
                            className="px-3 py-1 rounded bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-neutral-500 text-center">
          共 {warranties.length} 筆保固資料
        </div>
      </div>
    </main>
  );
}
