import axios from 'axios';

export interface GhostBlog {
  name: string;
  url: string;
  contentKey: string;
  adminKey: string;
}

export function getBlogs(): GhostBlog[] {
  try {
    const blogsJson = process.env.GHOST_BLOGS || '[]';
    return JSON.parse(blogsJson);
  } catch (error) {
    console.error('Error parsing GHOST_BLOGS:', error);
    return [];
  }
}

export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  url: string;
  html?: string;
  plaintext?: string;
  excerpt?: string;
  feature_image?: string;
  published_at: string;
  updated_at: string;
  tags?: Array<{ name: string; slug: string }>;
  authors?: Array<{ name: string }>;
}

export async function fetchAllPosts(blog: GhostBlog): Promise<GhostPost[]> {
  try {
    const response = await axios.get(
      `${blog.url}/ghost/api/content/posts/`,
      {
        params: {
          key: blog.contentKey,
          limit: 'all',
          fields: 'id,title,slug,url,excerpt,feature_image,published_at,updated_at',
          include: 'tags,authors',
        },
      }
    );
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function fetchPostById(id: string, blog: GhostBlog): Promise<GhostPost> {
  try {
    const response = await axios.get(
      `${blog.url}/ghost/api/content/posts/${id}/`,
      {
        params: {
          key: blog.contentKey,
          fields: 'id,title,slug,url,html,plaintext,excerpt,feature_image,published_at,updated_at',
          include: 'tags,authors',
        },
      }
    );
    return response.data.posts[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export async function fetchPostsByTag(tagSlug: string, blog: GhostBlog): Promise<GhostPost[]> {
  try {
    const response = await axios.get(
      `${blog.url}/ghost/api/content/posts/`,
      {
        params: {
          key: blog.contentKey,
          filter: `tag:${tagSlug}`,
          limit: 'all',
          fields: 'id,title,slug,url,excerpt,feature_image,published_at,updated_at',
          include: 'tags,authors',
        },
      }
    );
    return response.data.posts;
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    throw error;
  }
}

export async function fetchAllTags(blog: GhostBlog) {
  try {
    const response = await axios.get(
      `${blog.url}/ghost/api/content/tags/`,
      {
        params: {
          key: blog.contentKey,
          limit: 'all',
          fields: 'id,name,slug',
        },
      }
    );
    return response.data.tags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}
