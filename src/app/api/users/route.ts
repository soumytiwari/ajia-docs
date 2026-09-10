import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to load users:", error);

    return NextResponse.json(
      {
        error: "Failed to load users",
      },
      {
        status: 500,
      },
    );
  }
}
