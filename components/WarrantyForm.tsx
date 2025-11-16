"use client";
import { useState } from "react";

export default function WarrantyForm(){
  const [form, setForm] = useState({ name: "", email: "", serial: "", date: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try{
      const res = await fetch('/api/warranty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      setStatus(result.message || '保固登記成功！');
    }catch(err){
      setStatus('送出失敗，請稍後再試。');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input placeholder="姓名" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="p-3 rounded bg-black/40 border border-brand-blue" />
      <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="p-3 rounded bg-black/40 border border-brand-blue" />
      <input placeholder="產品序號" value={form.serial} onChange={e => setForm({ ...form, serial: e.target.value })} className="p-3 rounded bg-black/40 border border-brand-blue" />
      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="p-3 rounded bg-black/40 border border-brand-blue" />
      <button className="bg-brand-blue py-3 rounded hover:bg-blue-500 transition">送出登記</button>
      {status && <p className="mt-4 text-green-400">{status}</p>}
    </form>
  )
}

