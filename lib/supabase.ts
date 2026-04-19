import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type User = {
  id: string;
  email?: string;
  username?: string;
  total_points: number;
  created_at: string;
};

export type Post = {
  id: number;
  user_id: string;
  photo_url: string;
  analysis_result: {
    cleanliness_improvement: number;
    description: string;
  };
  points_earned: number;
  created_at: string;
};

export type GachaItem = {
  id: number;
  name: string;
  description: string;
  rarity: "C" | "B" | "A" | "S" | "SS" | "SSS";
  reward_type: string;
  reward_value: number;
  image_url: string;
};

export type GachaResult = {
  id: number;
  user_id: string;
  item_id: number;
  pulled_at: string;
};
