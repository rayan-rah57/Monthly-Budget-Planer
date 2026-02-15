import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/budget-config - Fetch budget configs for a month for logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!month || !year) {
      return NextResponse.json(
        { error: "month and year are required" },
        { status: 400 }
      );
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    if (isNaN(monthNum) || isNaN(yearNum)) {
      return NextResponse.json({ error: "Invalid month or year" }, { status: 400 });
    }

    const configs = await prisma.budgetConfig.findMany({
      where: { 
        month: monthNum, 
        year: yearNum,
        userId: session.user.id,
      },
      orderBy: [{ type: "asc" }, { category: "asc" }],
    });

    const serialized = configs.map((c) => ({
      ...c,
      targetAmount: c.targetAmount.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/budget-config error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget config" },
      { status: 500 }
    );
  }
}
