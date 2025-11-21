import { NextResponse } from "next/server";
import { headers } from "next/headers";

interface WorkImage {
  id: number;
  title: string;
  img: string;
}

interface WorkCase {
  id: number;
  title: string;
  folder: string;
  coverImage: string;
  images: WorkImage[];
  description?: string;
  category?: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 使用 headers() 获取 host，避免使用 localhost
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "https";
    
    if (!host) {
      return NextResponse.json(
        { error: "Host header not found" },
        { status: 500 }
      );
    }

    const baseUrl = `${protocol}://${host}`;
    
    // 通过 HTTP 读取 public/data/works.json（在 Vercel 上必须使用 HTTP）
    const worksRes = await fetch(`${baseUrl}/data/works.json`, {
      cache: "no-store",
    });

    if (!worksRes.ok) {
      console.error("Failed to fetch works.json:", worksRes.status);
      return NextResponse.json(
        { error: "Failed to load works data" },
        { status: 500 }
      );
    }

    const data = (await worksRes.json()) as { works: WorkCase[] };

    const { id } = await params;
    const workId = Number(id);
    const work = data.works.find((w) => w.id === workId);

    if (!work) {
      return NextResponse.json(
        { error: "Work not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(work);
  } catch (error) {
    console.error("Error fetching work:", error);
    return NextResponse.json(
      { error: "Failed to fetch work" },
      { status: 500 }
    );
  }
}
