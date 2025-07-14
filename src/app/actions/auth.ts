
'use server';

import 'dotenv/config';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/user';
import { UserProfile } from '@/hooks/use-auth';

const JWT_SECRET = process.env.JWT_SECRET;

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export async function signup(formData: FormData) {
  if (!JWT_SECRET) {
    const errorMsg = 'Server configuration error: JWT_SECRET is missing.';
    console.error(errorMsg);
    return { error: errorMsg };
  }
  try {
    await dbConnect();

    const data = Object.fromEntries(formData.entries());
    const parsed = signupSchema.safeParse(data);

    if (!parsed.success) {
      return { error: parsed.error.errors.map((e) => e.message).join(', ') };
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return { error: 'Server configuration error: Database is not configured.' };
    }
    return { error: 'An unexpected error occurred.' };
  }
}

export async function login(formData: FormData) {
  if (!JWT_SECRET) {
    const errorMsg = 'Server configuration error: JWT_SECRET is missing.';
    console.error(errorMsg);
    return { error: errorMsg };
  }
  try {
    await dbConnect();

    const data = Object.fromEntries(formData.entries());
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
      return { error: parsed.error.errors.map((e) => e.message).join(', ') };
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid email or password.' };
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    const userObject = user.toObject({ virtuals: true });
    const userProfile: UserProfile = {
      id: userObject._id.toString(),
      name: userObject.name,
      email: userObject.email,
    };

    return { success: true, user: userProfile };
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error && error.message.includes('MONGODB_URI')) {
      return { error: 'Server configuration error: Database is not configured.' };
    }
    return { error: 'An unexpected error occurred.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
  return { success: true };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  if (!token) return null;

  if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set. Cannot authenticate user.');
    return null;
  }
  
  let decoded: { userId: string };
  try {
    // First, verify the token. If it's invalid or expired, this will throw.
    decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    // This catch block handles JWT errors (e.g., expired, malformed).
    // It's correct to delete the invalid token here.
    console.error('Invalid token detected:', error);
    const cookieStore = await cookies();
    cookieStore.delete('session_token');
    return null;
  }

  try {
    // If the token is structurally valid, try to fetch the user from the database.
    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      // The user ID from the token doesn't exist in the DB. The token is stale.
      const cookieStore = await cookies();
      cookieStore.delete('session_token');
      return null;
    }

    const userObject = user.toObject({ virtuals: true });
    
    return {
      id: userObject._id.toString(),
      name: userObject.name,
      email: userObject.email,
    };
  } catch (error) {
    // This catch block is for other errors, like a database connection issue.
    // We return null to indicate failure for this request, but crucially,
    // we DON'T delete the cookie. The session might be recoverable on a subsequent request.
    console.error('Error fetching user from database during session check:', error);
    return null;
  }
}
