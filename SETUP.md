# 掃除ガチャ - セットアップガイド

## 1. Supabase セットアップ

### 1.1 プロジェクト作成
1. [supabase.com](https://supabase.com) にアクセス
2. 「New Project」をクリック
3. プロジェクト名を入力（例：cleaning-gacha）
4. データベースパスワードを設定
5. リージョンを選択（推奨：Tokyo または Asia）
6. 「Create new project」をクリック

### 1.2 API キー取得
1. 左メニュー「Settings」→「API」
2. 以下をコピー：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon (public)` キー → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `.env.local` に貼り付け

### 1.3 テーブル作成
SQL エディタで以下を実行：

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT,
  username TEXT UNIQUE,
  total_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  photo_url TEXT,
  analysis_result JSONB,
  points_earned INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gacha items table
CREATE TABLE gacha_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL,
  reward_type TEXT,
  reward_value INT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gacha results table
CREATE TABLE gacha_results (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id BIGINT NOT NULL REFERENCES gacha_items(id),
  pulled_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_gacha_results_user_id ON gacha_results(user_id);
```

### 1.4 サンプル ガチャアイテム追加
SQL エディタで実行：

```sql
INSERT INTO gacha_items (name, description, rarity, reward_type, reward_value) VALUES
('スタンプ・バッジ', '図鑑用スタンプ', 'C', 'stamp', 0),
('入浴剤', 'いい香りの入浴剤', 'B', 'bath_bomb', 500),
('推し活応援金', '好きなものに使える', 'A', 'money', 500),
('コーヒーチケット', 'スターバックス1杯分', 'S', 'coffee', 500),
('スイーツ券', '好きなお菓子1000円分', 'SS', 'sweets', 1000),
('好きな夜食', '好きな夜食3000円分相当', 'SSS', 'night_snack', 3000);
```

### 1.5 ストレージ設定
1. 左メニュー「Storage」
2. 「New bucket」をクリック
3. 名前：`photos`
4. 「Public bucket」を有効化
5. 作成

### 1.6 Google OAuth 設定
1. 左メニュー「Authentication」→「Providers」
2. Google を探して有効化
3. [Google Cloud Console](https://console.cloud.google.com) で OAuth 認証情報を作成
4. リダイレクト URI：`http://localhost:3000/api/auth/callback`（本番は実際の URL）

## 2. Groq API キー取得

1. [groq.com/groqcloud](https://groq.com/groqcloud) にアクセス
2. アカウント作成
3. API キーを生成
4. `.env.local` の `GROQ_API_KEY` に貼り付け

## 3. ローカル開発開始

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開く

## 4. デプロイ（Vercel）

```bash
npm install -g vercel
vercel
```

Vercel ダッシュボードで環境変数を設定：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`
- `NEXT_PUBLIC_APP_URL` (Vercel の URL)

完了！
