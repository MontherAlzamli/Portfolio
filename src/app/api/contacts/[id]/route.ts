import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

// GET /api/contacts/[id] - Get single contact message
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PUT /api/contacts/[id] - Update contact message (mark as read/unread)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const { read } = body;

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: { read },
    });

    return NextResponse.json({
      success: true,
      data: contact,
      message: 'Contact message updated successfully',
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/[id] - Delete contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await prisma.contact.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
