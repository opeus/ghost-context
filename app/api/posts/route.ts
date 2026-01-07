import { NextResponse } from 'next/server';
import { fetchAllPosts, fetchAllTags, getBlogs } from '@/lib/ghost';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const blogIndex = parseInt(searchParams.get('blogIndex') || '0');

  try {
    const blogs = getBlogs();
    if (blogs.length === 0) {
      return NextResponse.json(
        { error: 'No blogs configured' },
        { status: 500 }
      );
    }

    if (type === 'blogs') {
      return NextResponse.json({ blogs: blogs.map((b, i) => ({ index: i, name: b.name, url: b.url })) });
    }

    const blog = blogs[blogIndex];
    if (!blog) {
      return NextResponse.json(
        { error: 'Invalid blog index' },
        { status: 400 }
      );
    }

    if (type === 'tags') {
      const tags = await fetchAllTags(blog);
      return NextResponse.json({ tags });
    } else {
      const posts = await fetchAllPosts(blog);
      return NextResponse.json({ posts });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
