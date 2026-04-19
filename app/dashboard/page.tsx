"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserData {
  total_points: number;
  username?: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (user) {
      fetchUserData();
    }
  }, [user, loading, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `/api/user/profile?userId=${user?.id}`
      );
      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        読み込み中...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">掃除ガチャ</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            ログアウト
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">👤 プロフィール</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">メール:</span> {user.email}
            </p>
            <p className="text-lg">
              <span className="font-semibold text-purple-600">⭐ ポイント:</span>
              <span className="ml-2 text-2xl font-bold text-purple-600">
                {userData?.total_points || 0}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/posts/new"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md p-8 text-center transition transform hover:scale-105"
          >
            <div className="text-5xl mb-4">📸</div>
            <h3 className="text-2xl font-bold mb-2">写真を投稿</h3>
            <p className="text-blue-100">掃除の写真を投稿してポイントゲット</p>
          </Link>

          <Link
            href="/posts"
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-md p-8 text-center transition transform hover:scale-105"
          >
            <div className="text-5xl mb-4">📷</div>
            <h3 className="text-2xl font-bold mb-2">投稿一覧</h3>
            <p className="text-green-100">自分の掃除履歴を見る</p>
          </Link>

          <Link
            href="/gacha"
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg shadow-md p-8 text-center transition transform hover:scale-105"
          >
            <div className="text-5xl mb-4">🎰</div>
            <h3 className="text-2xl font-bold mb-2">ガチャに挑戦</h3>
            <p className="text-yellow-100">ポイントで好物をゲット</p>
          </Link>

          <Link
            href="/gacha/book"
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg shadow-md p-8 text-center transition transform hover:scale-105"
          >
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-2">図鑑</h3>
            <p className="text-pink-100">ゲットしたアイテムを確認</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
