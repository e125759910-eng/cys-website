import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";

interface WorkData {
  id: number;
  title: string;
  description?: string;
  images: string[];
}

export default async function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const res = await fetch(`/api/portfolio/${id}`, {
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
