
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return new NextResponse("University ID is required", { status: 400 });
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("universities")
      .select("cover_photo_url")
      .eq("id", id)
      .single();

    if (error || !data || !data.cover_photo_url) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const imageUrl = data.cover_photo_url;

    // specific handling for Base64 images
    if (imageUrl.startsWith("data:")) {
      const matches = imageUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        return new NextResponse("Invalid image data", { status: 500 });
      }

      const contentType = matches[1];
      const buffer = Buffer.from(matches[2], "base64");

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // if it's a normal URL, redirect to it
    return NextResponse.redirect(imageUrl);
    
  } catch (error) {
    console.error("Error serving university image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
