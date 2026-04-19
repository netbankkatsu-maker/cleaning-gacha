"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="text-2xl font-bold text-purple-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">掃除ガチャ</h1>
          <p className="text-gray-600">
            掃除の写真を投稿してポイントをゲット。ガチャで好物をゲット！
          </p>
        </header>

        {/* Auth Section */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">ログイン</h2>
          <button
            onClick={signInWithGoogle}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Google でログイン
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-lg font-bold mb-2">写真を投稿</h3>
            <p className="text-gray-600 text-sm">
              掃除前後の写真を投稿してポイント獲得
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-lg font-bold mb-2">ポイント獲得</h3>
            <p className="text-gray-600 text-sm">
              AI が分析して改善度合に応じてポイント付与
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🎰</div>
            <h3 className="text-lg font-bold mb-2">ガチャに挑戦</h3>
            <p className="text-gray-600 text-sm">
              ポイントで好物がゲットできるガチャを引く
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
