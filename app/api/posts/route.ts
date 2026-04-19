import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeCleaningPhoto } from "@/lib/groq";
import { calculatePoints } from "@/lib/gacha-logic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "Missing file or userId" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Analyze with Groq
    const analysis = await analyzeCleaningPhoto(base64);

    // Calculate points
    const { points, message } = calculatePoints(
      analysis.cleanliness_improvement
    );

    // Upload image to Supabase Storage
    const fileName = `posts/${userId}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } =
      await supabase.storage.from("photos").upload(fileName, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(fileName);

    // Save post to database
    const { data: postData, error: dbError } = await supabase
      .from("posts")
      .insert([
        {
          user_id: userId,
          photo_url: publicUrl,
          analysis_result: analysis,
          points_earned: points,
        },
      ])
      .select();

    if (dbError) {
      throw new Error(dbError.message);
    }

    // Update user points
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("total_points")
      .eq("id", userId)
      .single();

    if (!userError) {
      await supabase
        .from("users")
        .update({
          total_points: (userData?.total_points || 0) + points,
        })
        .eq("id", userId);
    }

    return NextResponse.json(
      {
        success: true,
        post: postData?.[0],
        points,
        message,
        analysis,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error posting:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create post",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    let query = supabase.from("posts").select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ posts: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch posts",
      },
      { status: 500 }
    );
  }
}
