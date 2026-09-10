import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateDocumentSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getAccessibleDocument(documentId: string, userId: string) {
  return prisma.document.findFirst({
    where: {
      id: documentId,
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
  });
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext,
) {
  const userId = request.headers.get("x-user-id");
  const { id } = await params;

  if (!userId) {
    return NextResponse.json(
      { error: "Missing x-user-id header" },
      { status: 401 },
    );
  }

  const document = await getAccessibleDocument(id, userId);

  if (!document) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(document);
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  const userId = request.headers.get("x-user-id");
  const { id } = await params;

  if (!userId) {
    return NextResponse.json(
      { error: "Missing x-user-id header" },
      { status: 401 },
    );
  }

  const existingDocument = await getAccessibleDocument(id, userId);

  if (!existingDocument) {
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 },
    );
  }

  const body = await request.json();
  const result = updateDocumentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid document data",
        details: result.error.flatten(),
      },
      { status: 400 },
    );
  }

  const updateData: {
    title?: string;
    content?: object;
  } = {};

  if (result.data.title !== undefined) {
    updateData.title = result.data.title;
  }

  if (result.data.content !== undefined) {
    updateData.content = result.data.content;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 },
    );
  }

  const updatedDocument = await prisma.document.update({
    where: {
      id,
    },
    data: updateData,
  });

  return NextResponse.json(updatedDocument);
}
