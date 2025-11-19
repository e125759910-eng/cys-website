"use client";
import Link from "next/link";
import { WorkCase } from "@/data/works";

export default function PortfolioGrid({ items }: { items: WorkCase[] }){
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {items.map(item => (
        <Link
          key={item.id}
          href={`/portfolio/${item.id}`}
          className="group relative overflow-hidden rounded-2xl border border-[#FFD700]/30 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-[#FFD700]/50 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,215,0,0.1),0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-gold-glow block"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="w-full h-64 overflow-hidden bg-black/50 flex items-center justify-center">
              <img 
                src={item.coverImage} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // 检查是否是 RAW 格式文件
                  if (item.coverImage.toLowerCase().endsWith('.nef')) {
                    target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'text-center p-4 w-full';
                    errorDiv.innerHTML = `
                      <div class="text-[#FFD700] text-3xl mb-2">⚠️</div>
                      <div class="text-neutral-400 text-sm">RAW 格式</div>
                      <div class="text-neutral-500 text-xs mt-1">需轉換為 JPG</div>
                    `;
                    target.parentElement?.appendChild(errorDiv);
                  } else {
                    target.style.display = 'none';
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'text-center p-4 w-full';
                    errorDiv.innerHTML = `
                      <div class="text-neutral-400 text-sm">封面無法載入</div>
                    `;
                    target.parentElement?.appendChild(errorDiv);
                  }
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/70 to-transparent border-t border-[#FFD700]/20 backdrop-blur-sm text-center py-4 px-4">
              <h3 className="text-lg font-semibold text-[#FFD700] mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-neutral-500 mt-1">{item.description}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

