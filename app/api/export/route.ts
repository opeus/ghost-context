import { NextResponse } from 'next/server';
import { fetchPostById } from '@/lib/ghost';

export async function POST(request: Request) {
  try {
    const { postIds } = await request.json();

    if (!postIds || !Array.isArray(postIds)) {
      return NextResponse.json(
        { error: 'Invalid post IDs' },
        { status: 400 }
      );
    }

    // Fetch all selected posts
    const posts = await Promise.all(
      postIds.map((id) => fetchPostById(id))
    );

    // Format posts as AI context
    let contextContent = '# Ghost Blog Context Export\n\n';
    contextContent += `Generated on: ${new Date().toISOString()}\n`;
    contextContent += `Total Articles: ${posts.length}\n\n`;
    contextContent += '---\n\n';

    posts.forEach((post, index) => {
      contextContent += `## Article ${index + 1}: ${post.title}\n\n`;
      contextContent += `**URL:** ${post.url}\n`;
      contextContent += `**Slug:** ${post.slug}\n`;
      contextContent += `**Published:** ${post.published_at}\n`;

      if (post.tags && post.tags.length > 0) {
        contextContent += `**Tags:** ${post.tags.map(t => t.name).join(', ')}\n`;
      }

      if (post.authors && post.authors.length > 0) {
        contextContent += `**Authors:** ${post.authors.map(a => a.name).join(', ')}\n`;
      }

      if (post.excerpt) {
        contextContent += `**Excerpt:** ${post.excerpt}\n`;
      }

      contextContent += '\n### Content\n\n';
      contextContent += post.plaintext || '';
      contextContent += '\n\n---\n\n';
    });

    return NextResponse.json({
      content: contextContent,
      filename: `ghost-context-${new Date().toISOString().split('T')[0]}.md`,
      count: posts.length,
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export posts' },
      { status: 500 }
    );
  }
}
