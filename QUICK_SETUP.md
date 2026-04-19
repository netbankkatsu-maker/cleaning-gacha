# 🚀 掃除ガチャ - クイックセットアップ (5分)

## ステップ 1: Supabase プロジェクト作成

1. https://supabase.com にアクセス
2. **「Start your project」** をクリック
3. Google/GitHub でサインイン
4. 新規プロジェクト作成：
   - **Name**: `cleaning-gacha`
   - **Password**: 安全なパスワード（メモしておく）
   - **Region**: `Asia-Northeast (Tokyo)`
5. **「Create new project」** をクリック（2-3分待機）

---

## ステップ 2: テーブル作成（コピペで完了）

プロジェクト作成後：

1. 左メニュー → **「SQL Editor」**
2. **「New Query」** をクリック
3. 以下を **全てコピペ** して実行：

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

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_gacha_results_user_id ON gacha_results(user_id);

-- Insert gacha items
INSERT INTO gacha_items (name, description, rarity, reward_type, reward_value) VALUES
('スタンプ・バッジ', '図鑑用スタンプ', 'C', 'stamp', 0),
('入浴剤', 'いい香りの入浴剤', 'B', 'bath_bomb', 500),
('推し活応援金', '好きなものに使える', 'A', 'money', 500),
('コーヒーチケット', 'スターバックス1杯分', 'S', 'coffee', 500),
('スイーツ券', '好きなお菓子1000円分', 'SS', 'sweets', 1000),
('好きな夜食', '好きな夜食3000円分相当', 'SSS', 'night_snack', 3000);
```

4. ▶️ **「Run」** をクリック
5. ✅ 成功メッセージを確認

---

## ステップ 3: ストレージ作成

1. 左メニュー → **「Storage」**
2. **「Create a new bucket」**
3. Name: `photos`
4. ✅ **「Public bucket」をON**
5. **「Create bucket」**

---

## ステップ 4: API キー取得

1. 左メニュー → **「Settings」** → **「API」**
2. 以下をコピー（後で使う）：
   - **Project URL** 
   - **anon public キー**

例：
```
URL: https://xxxxxx.supabase.co
KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## ステップ 5: Google OAuth 設定

1. Supabase左メニュー → **「Authentication」** → **「Providers」**
2. **「Google」** を探して **有効化**
3. **「Google OAuth Client ID」** と **「Google OAuth Client Secret」** を入力
   - Google Cloud Console で作成（下記参照）

---

## ステップ 6: Google Cloud Console 設定

### 6a. プロジェクト作成
1. https://console.cloud.google.com にアクセス
2. 上部 「プロジェクト選択」 → 「新しいプロジェクト」
3. Name: `cleaning-gacha`
4. **「作成」**

### 6b. OAuth 認証情報作成
1. 左メニュー → **「APIs と サービス」** → **「認証情報」**
2. **「認証情報を作成」** → **「OAuth 2.0 クライアント ID」**
3. **「同意画面を設定」** をクリック
   - **「ユーザーの種類」**: 外部
   - **「作成」**
4. 以下を入力：
   - **アプリ名**: `cleaning-gacha`
   - **ユーザーサポート**: メールアドレス
   - **デベロッパー連絡先**: メールアドレス
5. **「保存して次へ」** (スコープはスキップ)
6. **「保存して次へ」** (テストユーザーはスキップ)
7. **「ダッシュボードに戻る」**

### 6c. クライアント ID を作成
1. **「認証情報を作成」** → **「OAuth 2.0 クライアント ID」**
2. **アプリケーションの種類**: **「Webアプリケーション」**
3. Name: `cleaning-gacha`
4. **「認可済みのリダイレクト URI」** に以下を追加：
   ```
   http://localhost:3000/api/auth/callback
   https://your-vercel-domain.vercel.app/api/auth/callback
   ```
5. **「作成」**
6. **クライアント ID とシークレット をコピー** ⭐

---

## ステップ 7: Groq API キー取得

1. https://console.groq.com にアクセス
2. Google/GitHub でサインイン
3. 左メニュー → **「API Keys」**
4. **「Create API Key」**
5. キーをコピー ⭐

---

## ステップ 8: 環境変数を設定

以下の情報をコピーして、`.env.local` に貼り付け：

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
GROQ_API_KEY=gsk_xxx
```

---

## ステップ 9: ローカルテスト

```bash
cd C:\Users\katsu-pc\Desktop\claude\cleaning-gacha
npm run dev
```

ブラウザ: http://localhost:3000

---

## ステップ 10: Vercel デプロイ

```bash
npm install -g vercel
vercel
```

環境変数を設定して デプロイ完了！🎉

---

**問題が発生したら、下記を確認：**
- Supabase テーブルが作成されたか
- API キーが正しいか
- Google OAuth がリダイレクト URI を登録しているか
