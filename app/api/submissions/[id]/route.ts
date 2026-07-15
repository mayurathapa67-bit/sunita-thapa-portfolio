import { NextRequest, NextResponse } from "next/server";
import { deleteSubmission, archiveSubmission } from "@/lib/submissions";
import { requireAdmin } from "@/lib/adminSession";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const archived = body.archived !== false;
    const ok = await archiveSubmission(params.id, archived);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const ok = await deleteSubmission(params.id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
