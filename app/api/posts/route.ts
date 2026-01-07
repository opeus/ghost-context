import { NextResponse } from 'next/server';
import { fetchAllPosts, fetchAllTags } from '@/lib/ghost';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    if (type === 'tags') {
      const tags = await fetchAllTags();
      return NextResponse.json({ tags });
    } else {
      const posts = await fetchAllPosts();
      return NextResponse.json({ posts });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
