# 掃除ガチャ 🎰

掃除の写真を投稿してポイントをゲット。ガチャで好物をゲット！

## 機能

- 📸 **写真投稿**: 掃除前後の写真を投稿
- 🤖 **AI分析**: Groq Vision APIで改善度を自動判定
- ⭐ **ポイント獲得**: 改善度に応じてポイント付与
- 🎰 **ガチャシステム**: ポイントで好物がゲットできるガチャ
- 📚 **図鑑**: ゲットしたアイテムを図鑑で管理
- 👥 **複数ユーザー対応**: Google OAuthでログイン

## 技術スタック

- **Frontend**: Next.js 15 + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq Vision API (Llama 3.2 Vision)
- **Authentication**: Supabase Auth + Google OAuth
- **Hosting**: Vercel

## セットアップ

詳細は [SETUP.md](./SETUP.md) を参照してください。

### クイックスタート

1. リポジトリをクローン
2. 環境変数を設定 (`.env.local`)
3. 依存関係をインストール
   ```bash
   npm install
   ```
4. 開発サーバーを起動
   ```bash
   npm run dev
   ```
5. `http://localhost:3000` を開く

## 環境変数

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GROQ_API_KEY=your_groq_api_key
```

## ガチャ確率

| レア度 | 確率 | ポイント消費 | ご褒美 |
|--------|------|------------|-------|
| C | 50% | 30pt | スタンプ・バッジ |
| B | 30% | 60pt | 入浴剤・香りグッズ |
| A | 12% | 100pt | 推し活応援金（500円） |
| S | 6% | 150pt | コーヒーチケット |
| SS | 1.5% | 200pt | スイーツ券（1000円） |
| SSS | 0.5% | 250pt | 好きな夜食（3000円） |

## ポイント獲得

- 大幅改善（70%以上）: 30pt
- 改善（30-70%）: 20pt
- 軽改善（10-30%）: 10pt
- 変わらず: 5pt

## ライセンス

MIT
