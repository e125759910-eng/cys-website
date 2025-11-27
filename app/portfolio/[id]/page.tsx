import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { works } from "@/data/works";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PortfolioDetailPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return works.map((w) => ({
    id: w.id.toString(),
  }));
}

export default function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const id = Number(params.id);
  const work = works.find((w) => w.id === id);

  if (!work) return notFound();

  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {work.title}
        </h1>

        {work.description && (
          <p className="text-neutral-400 mb-8">{work.description}</p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {work.images.map((img) => (
            <div key={img.id} className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={img.img}
                alt={img.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
