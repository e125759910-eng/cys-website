"use client";
import { useState } from "react";

interface WarrantyInfo {
  id: string;
  customerName: string;
  phone: string;
  carModel: string;
  project: string;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyPeriod: number; // 保固期限（月）
}

export default function WarrantyQueryForm() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [warranties, setWarranties] = useState<WarrantyInfo[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setWarranties([]);
    setLoading(true);

    try {
      const res = await fetch("/api/warranty/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const result = await res.json();

      if (res.ok) {
        setWarranties(result.warranties || []);
        if (result.warranties && result.warranties.length === 0) {
          setError("查無此電話號碼的保固資料");
        }
      } else {
        setError(result.error || "查詢失敗，請稍後再試");
      }
    } catch (err) {
      setError("連線錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getWarrantyStatus = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { text: "已過期", color: "text-red-400" };
    } else if (daysLeft <= 30) {
      return { text: `剩餘 ${daysLeft} 天`, color: "text-yellow-400" };
    } else {
      return { text: `剩餘 ${daysLeft} 天`, color: "text-green-400" };
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="tel"
            placeholder="請輸入聯絡電話"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="flex-1 p-4 rounded-xl bg-black/40 border border-[#FFD700]/30 text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFD700]/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFD700] via-[#FFE44D] to-[#FFA500] text-black font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "查詢中..." : "查詢保固"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 text-center">
          {error}
        </div>
      )}

      {warranties.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">保固資訊</h2>
          {warranties.map((warranty) => {
            const status = getWarrantyStatus(warranty.warrantyEndDate);
            return (
              <div
                key={warranty.id}
                className="p-6 rounded-xl border border-[#FFD700]/30 bg-black/40 backdrop-blur-sm"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">客戶姓名</p>
                    <p className="text-white font-semibold">{warranty.customerName}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">聯絡電話</p>
                    <p className="text-white font-semibold">{warranty.phone}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">車型</p>
                    <p className="text-white font-semibold">{warranty.carModel}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">施工項目</p>
                    <p className="text-white font-semibold">{warranty.project}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">保固開始日期</p>
                    <p className="text-white">{formatDate(warranty.warrantyStartDate)}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">保固結束日期</p>
                    <p className="text-white">{formatDate(warranty.warrantyEndDate)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-neutral-400 text-sm mb-1">保固狀態</p>
                    <p className={`font-semibold ${status.color}`}>{status.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

