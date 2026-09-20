import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/menu/categories
export async function GET() {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ data: categories });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[GET /api/menu/categories]", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/menu/categories — Owner/Admin only
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !["OWNER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await prisma.menuCategory.create({
      data: { name },
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[POST /api/menu/categories]", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
