import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 簡單的認證（生產環境應使用更安全的方式，如環境變數或資料庫）
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // 創建簡單的 session token（生產環境應使用 JWT 或更安全的方式）
      const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");
      
      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 小時
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "帳號或密碼錯誤" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "登入失敗" },
      { status: 500 }
    );
  }
}

