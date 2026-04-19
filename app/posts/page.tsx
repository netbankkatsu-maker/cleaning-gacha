"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Post } from "@/lib/supabase";

export default function PostsList() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    } else if (user) {
      fetchPosts();
    }
  }, [user, loading, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?userId=${user?.id}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setFetching(false);
    }
  };

  if (loading || fetching) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <nav className="bg-white shadow-md p-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← ダッシュボード
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-green-600">📷 投稿一覧</h1>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">📸</div>
            <p className="text-gray-600 mb-4">
              まだ投稿がありません。
            </p>
            <button
              onClick={() => router.push("/posts/new")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              最初の写真を投稿する
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {post.photo_url && (
                  <img
                    src={post.photo_url}
                    alt="Post"
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-gray-600 text-sm">
                        {new Date(post.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      +{post.points_earned} PT
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">改善度:</span>
                      <span className="ml-2 text-purple-600 font-bold">
                        {post.analysis_result?.cleanliness_improvement || 0}%
                      </span>
                    </p>
                    <p className="text-gray-600">
                      {post.analysis_result?.description || "分析中..."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => router.push("/posts/new")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            + 新しい写真を投稿
          </button>
        </div>
      </div>
    </div>
  );
}
