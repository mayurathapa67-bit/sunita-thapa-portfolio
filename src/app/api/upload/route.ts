import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(request: Request) {
  try {
    // 1. Check Environment Variables
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error("❌ [UPLOAD ERROR] Missing Cloudinary env variables in .env.local!");
      return NextResponse.json({ error: "Cloudinary not configured on server" }, { status: 500 });
    }

    // 2. Configure Cloudinary
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

    // 3. Get the file from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 4. Convert file to buffer and upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("⬆️ Uploading to Cloudinary...");

    const result: { secure_url: string } = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "sunita-thapa-portfolio", 
          resource_type: "auto" 
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        }
      );
      uploadStream.end(buffer);
    });

    console.log("✅ Upload successful:", result.secure_url);

    return NextResponse.json({ 
      success: true, 
      url: result.secure_url, 
      thumb: result.secure_url 
    });

  } catch (error) {
    console.error("❌ [UPLOAD ERROR] Cloudinary failed:", error);
    return NextResponse.json({ 
      error: "Upload failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}