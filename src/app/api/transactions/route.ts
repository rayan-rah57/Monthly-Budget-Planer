import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/transactions - Fetch all transactions for logged-in user
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
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {
      userId: session.user.id,
    };

    if (month && year) {
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      if (!isNaN(monthNum) && !isNaN(yearNum)) {
        where.date = {
          gte: new Date(yearNum, monthNum - 1, 1),
          lt: new Date(yearNum, monthNum, 1),
        };
      }
    }

    if (type && ["INCOME", "EXPENSE", "BILL", "DEBT", "SAVING"].includes(type)) {
      where.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: "asc" },
    });

    // Serialize Decimal for JSON
    const serialized = transactions.map((t) => ({
      ...t,
      amount: t.amount.toString(),
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction for logged-in user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { date, description, amount, category, type } = body;

    if (!date || description == null || amount == null || !category || !type) {
      return NextResponse.json(
        { error: "Missing required fields: date, description, amount, category, type" },
        { status: 400 }
      );
    }

    const validTypes = ["INCOME", "EXPENSE", "BILL", "DEBT", "SAVING"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description: String(description),
        amount: Number(amount),
        category: String(category),
        type,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      ...transaction,
      amount: transaction.amount.toString(),
    });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
