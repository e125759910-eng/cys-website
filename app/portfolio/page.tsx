import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGrid from "@/components/PortfolioGrid";

export default async function PortfolioPage() {
  // 使用绝对 URL 确保在 Vercel 上正常工作
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  const res = await fetch(`${baseUrl}/data/works.json`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch works: ${res.status}`);
  }

  const data = await res.json();

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FFE440] to-[#FFD700]">
            CYS 作品集
          </h1>

          <div className="w-16 h-1.5 mx-auto rounded-full bg-gradient-to-r from-[#FFD700] via-[#FFE440] to-transparent shadow-[0_0_15px_rgba(255,215,0,0.5)] mb-4"></div>
          <p className="text-neutral-400 text-lg">
            精選案例：展現科技感及專業品質包膜作品
          </p>
        </div>

        <PortfolioGrid items={data.works} />
      </section>
      <Footer />
    </main>
  );
}
