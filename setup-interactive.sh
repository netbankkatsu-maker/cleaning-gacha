#!/bin/bash

echo "======================================"
echo "掃除ガチャ - 自動セットアップ"
echo "======================================"
echo ""

# Supabase 情報取得
echo "📊 Supabase 情報を入力してください"
echo ""
read -p "Project URL (例: https://xxxx.supabase.co): " SUPABASE_URL
read -p "Anon Public Key: " SUPABASE_KEY
echo ""

# Groq API キー取得
echo "🤖 Groq API キーを入力してください"
echo ""
read -p "Groq API Key: " GROQ_API_KEY
echo ""

# 環境変数ファイルに保存
cat > .env.local << ENVEOF
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_KEY}
GROQ_API_KEY=${GROQ_API_KEY}
ENVEOF

echo "✅ 環境変数を保存しました (.env.local)"
echo ""
echo "次のコマンドでサーバーを起動できます:"
echo "npm run dev"
echo ""
