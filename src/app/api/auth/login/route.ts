import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { loginId, password } = body;

    if (!loginId || !password) {
      return NextResponse.json({ ok: false, error: 'loginId and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ loginId });
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, loginId: user.loginId },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return NextResponse.json({ 
      ok: true, 
      data: {
        token,
        user: {
          _id: user._id,
          loginId: user.loginId,
          email: user.email
        }
      } 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
