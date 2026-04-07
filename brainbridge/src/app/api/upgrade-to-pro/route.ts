import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

export async function POST(request: NextRequest) {
  try {
    const { uid } = await request.json();
    
    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // 将用户的 isPro 状态置为 true
    const userRef = ref(database, `users/${uid}`);
    await set(userRef, {
      isPro: true,
      updatedAt: Date.now()
    }, { merge: true });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error upgrading user to pro:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
