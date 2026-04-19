import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    // Get all gacha items
    const { data: items, error: itemError } = await supabase
      .from("gacha_items")
      .select("*")
      .order("rarity");

    if (itemError) {
      throw new Error(itemError.message);
    }

    if (!userId) {
      return NextResponse.json(
        {
          items,
          owned: [],
        },
        { status: 200 }
      );
    }

    // Get user's owned items
    const { data: owned, error: ownedError } = await supabase
      .from("gacha_results")
      .select("item_id")
      .eq("user_id", userId);

    if (ownedError) {
      throw new Error(ownedError.message);
    }

    const ownedIds = owned?.map((result) => result.item_id) || [];

    return NextResponse.json(
      {
        items,
        owned: ownedIds,
        completionRate: items
          ? ((ownedIds.length / items.length) * 100).toFixed(1)
          : 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching gacha items:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch items",
      },
      { status: 500 }
    );
  }
}
