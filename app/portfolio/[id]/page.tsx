import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";

interface WorkData {
  id: number;
  title: string;
  images: string[];
}

interface PortfolioDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { id } = await params;
  
  // 使用 API 路由获取单个作品数据（相对路径）
  const res = await fetch(`/api/portfolio/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      return notFound();
    }
    throw new Error(`Failed to fetch work: ${res.status}`);
  }

  const work = (await res.json()) as WorkData;

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {work.title}
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {work.images.map((imgSrc, index) => (
            <div
              key={index}
              className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950"
            >
              <Image
                src={imgSrc}
                alt={`${work.title} - ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
