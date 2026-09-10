import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const shareDocumentSchema = z.object({
  userId: z.string().min(1),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: NextRequest,
  { params }: RouteContext,
) {
  const currentUserId = request.headers.get("x-user-id");
  const { id: documentId } = await params;

  if (!currentUserId) {
    return NextResponse.json(
      { error: "Missing x-user-id header" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const result = shareDocumentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "A valid userId is required" },
      { status: 400 },
    );
  }

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      ownerId: currentUserId,
    },
  });

  if (!document) {
    return NextResponse.json(
      { error: "Only the document owner can share this document" },
      { status: 403 },
    );
  }

  if (result.data.userId === currentUserId) {
    return NextResponse.json(
      { error: "The owner already has access" },
      { status: 400 },
    );
  }

  const sharedUser = await prisma.user.findUnique({
    where: {
      id: result.data.userId,
    },
  });

  if (!sharedUser) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 },
    );
  }

  const existingShare = await prisma.documentShare.findUnique({
    where: {
      documentId_userId: {
        documentId,
        userId: result.data.userId,
      },
    },
  });

  if (existingShare) {
    return NextResponse.json(
      { error: "Document is already shared with this user" },
      { status: 409 },
    );
  }

  const share = await prisma.documentShare.create({
    data: {
      documentId,
      userId: result.data.userId,
    },
    include: {
      user: true,
    },
  });

  return NextResponse.json(share, { status: 201 });
}
