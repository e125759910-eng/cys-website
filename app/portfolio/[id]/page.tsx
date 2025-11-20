import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { notFound } from "next/navigation";
import { works } from "@/data/works";

interface PortfolioDetailPageProps {
  params: { id: string };
}

export default function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const workId = Number(params.id);
  const work = works.find((w) => w.id === workId);

  if (!work) {
    return notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {work.title}
        </h1>
        <p className="text-neutral-400 mb-8">{work.description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {work.images.map((img) => (
            <div key={img.id} className="relative w-full aspect-[4/3] overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
              <Image
                src={img.img}
                alt={img.title}
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
