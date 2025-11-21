import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";
import { headers } from "next/headers";

interface WorkData {
  id: number;
  title: string;
  description?: string;
  images: string[];
}

export default async function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 在服务器组件中需要使用绝对 URL
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || (process.env.NODE_ENV === "production" ? "https" : "http");
  const baseUrl = host ? `${protocol}://${host}` : "http://localhost:3000";
  
  const res = await fetch(`${baseUrl}/api/portfolio/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        作品資料讀取失敗（{res.status}）
      </main>
    );
  }

  const data = (await res.json()) as WorkData;

  // 将 images 字符串数组转换为 PortfolioGrid 需要的格式
  const gridItems = data.images.map((img, index) => ({
    id: index + 1,
    title: `${data.title} - ${index + 1}`,
    folder: data.title,
    coverImage: img,
    images: [{ id: index + 1, title: `${data.title} - ${index + 1}`, img }],
    description: data.description,
  }));

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700]">
            {data.title}
          </h1>
          {data.description && (
            <p className="text-neutral-400 text-lg mt-4">
              {data.description}
            </p>
          )}
        </div>

        <PortfolioGrid items={gridItems} />
      </section>
      <Footer />
    </main>
  );
}
