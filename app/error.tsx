"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-8">
      <h2 className="text-2xl font-bold mb-4 text-[#FFD700]">發生錯誤</h2>
      <p className="mt-2 text-sm text-neutral-400 mb-6 text-center max-w-md">
        {error?.message ?? "未知錯誤"}
      </p>
      {error?.digest && (
        <p className="text-neutral-500 text-xs mb-4">錯誤 ID: {error.digest}</p>
      )}
      <button
        onClick={() => reset()}
        className="mt-4 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-3 text-black font-semibold hover:opacity-90 transition-opacity"
      >
        重新整理
      </button>
    </div>
  );
}
