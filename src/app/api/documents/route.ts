import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const emptyDocumentContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

function getUserId(request: NextRequest) {
  return request.headers.get("x-user-id");
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 },
      );
    }

    const documents = await prisma.document.findMany({
      where: {
        OR: [
          {
            ownerId: userId,
          },
          {
            shares: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Failed to load documents:", error);

    return NextResponse.json(
      { error: "Failed to load documents" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request);

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    const body = await request.json().catch(() => ({}));

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Untitled document";

    const document = await prisma.document.create({
      data: {
        title,
        content: emptyDocumentContent,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("Failed to create document:", error);

    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 },
    );
  }
}
