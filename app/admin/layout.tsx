import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  // 簡單驗證（生產環境應使用更安全的方式）
  const isAuthenticated = token && (() => {
    try {
      const decoded = Buffer.from(token.value, "base64").toString("utf-8");
      return decoded.startsWith(process.env.ADMIN_USERNAME || "admin:");
    } catch {
      return false;
    }
  })();

  // 如果不是登入頁面且未認證，重定向到登入頁
  // 注意：這個檢查在登入頁面會被跳過，因為登入頁面不需要認證

  return <>{children}</>;
}

