import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { pullGacha, rarityConfig } from "@/lib/gacha-logic";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // Get user's current points
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("total_points")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Pull gacha rarity
    const rarity = pullGacha();
    const cost = rarityConfig[rarity].pointsCost;

    // Check if user has enough points
    if (userData.total_points < cost) {
      return NextResponse.json(
        {
          error: "Not enough points",
          required: cost,
          current: userData.total_points,
        },
        { status: 400 }
      );
    }

    // Get random item of this rarity
    const { data: items, error: itemError } = await supabase
      .from("gacha_items")
      .select("*")
      .eq("rarity", rarity);

    if (itemError || !items || items.length === 0) {
      return NextResponse.json(
        { error: "No items available for this rarity" },
        { status: 500 }
      );
    }

    const item = items[Math.floor(Math.random() * items.length)];

    // Record gacha result
    const { data: resultData, error: resultError } = await supabase
      .from("gacha_results")
      .insert([
        {
          user_id: userId,
          item_id: item.id,
        },
      ])
      .select();

    if (resultError) {
      throw new Error(resultError.message);
    }

    // Deduct points from user
    await supabase
      .from("users")
      .update({
        total_points: userData.total_points - cost,
      })
      .eq("id", userId);

    return NextResponse.json(
      {
        success: true,
        item,
        rarity,
        remainingPoints: userData.total_points - cost,
        result: resultData?.[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error pulling gacha:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to pull gacha",
      },
      { status: 500 }
    );
  }
}
