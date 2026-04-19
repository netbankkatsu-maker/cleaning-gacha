"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GachaItem } from "@/lib/supabase";

interface PullResult {
  success: boolean;
  item: GachaItem;
  rarity: string;
  remainingPoints: number;
}

const rarityColors: Record<string, string> = {
  C: "bg-gray-500",
  B: "bg-blue-500",
  A: "bg-purple-500",
  S: "bg-pink-500",
  SS: "bg-yellow-500",
  SSS: "bg-red-500",
};

const rarityEmojis: Record<string, string> = {
  C: "⚫",
  B: "🔵",
  A: "🟣",
  S: "🌸",
  SS: "⭐",
  SSS: "🌟",
};

export default function GachaPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userPoints, setUserPoints] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [result, setResult] = useState<PullResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (user) {
      fetchUserPoints();
    }
  }, [user, loading, router]);

  const fetchUserPoints = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${user?.id}`);
      const data = await response.json();
      setUserPoints(data.user?.total_points || 0);
    } catch (error) {
      console.error("Error fetching points:", error);
    }
  };

  const handlePull = async () => {
    if (!user) return;

    setPulling(true);
    setShowAnimation(true);

    try {
      const response = await fetch("/api/gacha/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "ガチャに失敗しました");
        setPulling(false);
        setShowAnimation(false);
        return;
      }

      // Animation delay
      setTimeout(() => {
        setResult(data);
        setUserPoints(data.remainingPoints);
      }, 1500);
    } catch (error) {
      console.error("Error pulling gacha:", error);
      alert("ガチャに失敗しました");
      setPulling(false);
      setShowAnimation(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setShowAnimation(false);
    setPulling(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      <nav className="bg-white shadow-md p-4 mb-8">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← ダッシュボード
          </button>
          <p className="text-2xl font-bold text-yellow-600">
            ⭐ ポイント: {userPoints}
          </p>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-4xl font-bold mb-8 text-orange-600">
            🎰 ガチャに挑戦
          </h1>

          {!result ? (
            <div>
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  30ポイント以上でガチャに挑戦できます
                </p>
              </div>

              {showAnimation && (
                <div className="mb-8">
                  <div className="inline-block">
                    <div className="animate-spin text-6xl">🎰</div>
                  </div>
                  <p className="text-gray-600 mt-4 animate-pulse">
                    ガチャ回転中...
                  </p>
                </div>
              )}

              {!showAnimation && (
                <button
                  onClick={handlePull}
                  disabled={pulling || userPoints < 30}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-2xl transition transform hover:scale-105 mb-6"
                >
                  {pulling
                    ? "ガチャ回転中..."
                    : `ガチャを引く (30ポイント)`}
                </button>
              )}

              <button
                onClick={() => router.push("/gacha/book")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
              >
                📚 図鑑を見る
              </button>
            </div>
          ) : (
            <div>
              <div className={`mb-8 p-8 rounded-lg ${rarityColors[result.rarity]}`}>
                <div className="text-8xl mb-4">
                  {rarityEmojis[result.rarity]}
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {result.item.name}
                </h2>
                <p className="text-white mb-4">{result.item.description}</p>
                <p className="text-2xl font-bold text-white">
                  レア度: {result.rarity}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-gray-700 mb-2">
                  報酬: {result.item.reward_type}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {result.item.reward_value}円相当
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
              >
                もう一度引く
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
