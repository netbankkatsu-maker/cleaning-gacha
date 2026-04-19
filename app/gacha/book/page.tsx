"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GachaItem } from "@/lib/supabase";

interface BookData {
  items: GachaItem[];
  owned: number[];
  completionRate: string;
}

const rarityColors: Record<string, string> = {
  C: "bg-gray-100 border-gray-400",
  B: "bg-blue-100 border-blue-400",
  A: "bg-purple-100 border-purple-400",
  S: "bg-pink-100 border-pink-400",
  SS: "bg-yellow-100 border-yellow-400",
  SSS: "bg-red-100 border-red-400",
};

const rarityEmojis: Record<string, string> = {
  C: "⚫",
  B: "🔵",
  A: "🟣",
  S: "🌸",
  SS: "⭐",
  SSS: "🌟",
};

export default function GachaBook() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookData, setBookData] = useState<BookData | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (user) {
      fetchBookData();
    }
  }, [user, loading, router]);

  const fetchBookData = async () => {
    try {
      const response = await fetch(`/api/gacha/items?userId=${user?.id}`);
      const data = await response.json();
      setBookData(data);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (!user || !bookData) {
    return null;
  }

  const groupedByRarity = bookData.items.reduce(
    (acc, item) => {
      if (!acc[item.rarity]) {
        acc[item.rarity] = [];
      }
      acc[item.rarity].push(item);
      return acc;
    },
    {} as Record<string, GachaItem[]>
  );

  const rarityOrder = ["SSS", "SS", "S", "A", "B", "C"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      <nav className="bg-white shadow-md p-4 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← ダッシュボード
          </button>
          <p className="text-lg font-bold">
            図鑑 コンプリート率:{" "}
            <span className="text-purple-600">{bookData.completionRate}%</span>
          </p>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-purple-600">📚 図鑑</h1>

        {rarityOrder.map((rarity) => {
          const items = groupedByRarity[rarity];
          if (!items) return null;

          return (
            <div key={rarity} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {rarityEmojis[rarity]} レア度 {rarity}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const isOwned = bookData.owned.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`border-2 rounded-lg p-6 transition transform hover:scale-105 ${
                        isOwned
                          ? rarityColors[rarity]
                          : "bg-gray-50 border-gray-300 opacity-50"
                      }`}
                    >
                      <div className="text-4xl mb-2">
                        {isOwned ? rarityEmojis[rarity] : "❓"}
                      </div>
                      <h3 className="text-lg font-bold mb-2">
                        {isOwned ? item.name : "???"}
                      </h3>
                      {isOwned && (
                        <div>
                          <p className="text-gray-600 text-sm mb-2">
                            {item.description}
                          </p>
                          <p className="text-green-600 font-semibold">
                            {item.reward_value}円相当
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="bg-white rounded-lg shadow-md p-6 mt-8 mb-8 text-center">
          <p className="text-gray-600">
            全てのアイテムをコンプリートして、大いなる達成感を得よう！
          </p>
        </div>
      </div>
    </div>
  );
}
