import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    // Debug log (check your terminal to see what the server is reading)
    console.log('🔐 Auth attempt. Provided:', password, '| Expected:', correctPassword);

    if (!correctPassword) {
      return NextResponse.json({ error: 'Server error: ADMIN_PASSWORD is missing in .env.local' }, { status: 500 });
    }

    if (password === correctPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}