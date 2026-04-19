"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface UploadResponse {
  success: boolean;
  points: number;
  message: string;
  analysis: {
    cleanliness_improvement: number;
    description: string;
  };
}

export default function NewPost() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data: UploadResponse = await response.json();
      setResult(data);
      setPreview(null);
      setFile(null);
    } catch (error) {
      console.error("Error uploading:", error);
      alert("アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <nav className="bg-white shadow-md p-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← ダッシュボード
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6 text-purple-600">📸 写真を投稿</h1>

          {!result ? (
            <div>
              <div
                className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition"
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <div>
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg mb-4"
                    />
                    <p className="text-gray-600">別の写真を選択</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl mb-4">📷</div>
                    <p className="text-gray-600 mb-2">
                      写真をドラッグ&ドロップまたはクリック
                    </p>
                    <p className="text-sm text-gray-500">
                      掃除前後の写真をアップロードしてください
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
              >
                {uploading ? "分析中..." : "投稿してポイントをゲット"}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-4 text-green-600">
                投稿成功！
              </h2>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg mb-4">{result.message}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded p-4">
                    <p className="text-gray-600 text-sm">改善度</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {result.analysis.cleanliness_improvement}%
                    </p>
                  </div>
                  <div className="bg-white rounded p-4">
                    <p className="text-gray-600 text-sm">獲得ポイント</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      +{result.points}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
              >
                ダッシュボードへ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
