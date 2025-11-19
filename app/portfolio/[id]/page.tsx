"use client";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { works } from "@/data/works";
import { motion } from "framer-motion";

export default function WorkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workId = parseInt(params.id as string);
  const work = works.find(w => w.id === workId);

  if (!work) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <section className="py-20 px-6 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#FFD700] mb-4">作品不存在</h1>
          <button
            onClick={() => router.push('/portfolio')}
            className="px-6 py-3 rounded-xl bg-gradient-to-br from-[#FFD700] via-[#FFE44D] to-[#FFA500] text-black font-semibold hover:scale-105 transition-all"
          >
            返回作品集
          </button>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-20 px-6 max-w-7xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/portfolio')}
          className="mb-8 px-4 py-2 rounded-lg bg-black/40 border border-[#FFD700]/40 text-[#FFD700] hover:bg-black/60 hover:border-[#FFD700]/60 transition-all"
        >
          ← 返回作品集
        </button>

        {/* 个案标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFE44D] to-[#FFD700]">
            {work.title}
          </h1>
          <div className="h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-4"></div>
          {work.description && (
            <p className="text-neutral-400 text-lg">{work.description}</p>
          )}
        </div>

        {/* 照片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {work.images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-[#FFD700]/30 bg-black/40 backdrop-blur-sm hover:bg-black/60 hover:border-[#FFD700]/50 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,215,0,0.1),0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-gold-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-full h-64 overflow-hidden bg-black/50 flex items-center justify-center">
                  <img
                    src={image.img}
                    alt={image.title}
                    className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // 检查是否是 RAW 格式文件
                      if (image.img.toLowerCase().endsWith('.nef')) {
                        target.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'text-center p-4';
                        errorDiv.innerHTML = `
                          <div class="text-[#FFD700] text-2xl mb-2">⚠️</div>
                          <div class="text-neutral-400 text-xs">RAW 格式</div>
                          <div class="text-neutral-500 text-xs mt-1">需轉換為 JPG</div>
                        `;
                        target.parentElement?.appendChild(errorDiv);
                      } else {
                        target.style.display = 'none';
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'text-center p-4';
                        errorDiv.innerHTML = `
                          <div class="text-neutral-400 text-xs">圖片無法載入</div>
                        `;
                        target.parentElement?.appendChild(errorDiv);
                      }
                    }}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/70 to-transparent border-t border-[#FFD700]/20 backdrop-blur-sm text-center py-3 px-4">
                  <p className="text-sm font-medium text-[#FFD700]">{image.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}

