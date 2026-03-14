import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { loginId, email, password } = body;

    if (!loginId || !email || !password) {
      return NextResponse.json({ ok: false, error: 'loginId, email, and password are required' }, { status: 400 });
    }

    // Check existing
    const existingUser = await User.findOne({ $or: [{ loginId }, { email }] });
    if (existingUser) {
      return NextResponse.json({ ok: false, error: 'User with this loginId or email already exists' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      loginId,
      email,
      passwordHash
    });

    return NextResponse.json({ 
      ok: true, 
      data: {
        _id: newUser._id,
        loginId: newUser.loginId,
        email: newUser.email
      }
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
