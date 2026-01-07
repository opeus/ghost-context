import axios from 'axios';

const GHOST_API_URL = process.env.GHOST_API_URL;
const GHOST_CONTENT_API_KEY = process.env.GHOST_CONTENT_API_KEY;

export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html?: string;
  plaintext?: string;
  published_at: string;
  updated_at: string;
  tags?: Array<{ name: string; slug: string }>;
  authors?: Array<{ name: string }>;
}

export async function fetchAllPosts(): Promise<GhostPost[]> {
  try {
    const response = await axios.get(
      `${GHOST_API_URL}/ghost/api/content/posts/`,
      {
        params: {
          key: GHOST_CONTENT_API_KEY,
          limit: 'all',
          fields: 'id,title,slug,published_at,updated_at',
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

export async function fetchPostById(id: string): Promise<GhostPost> {
  try {
    const response = await axios.get(
      `${GHOST_API_URL}/ghost/api/content/posts/${id}/`,
      {
        params: {
          key: GHOST_CONTENT_API_KEY,
          fields: 'id,title,slug,html,plaintext,published_at,updated_at',
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

export async function fetchPostsByTag(tagSlug: string): Promise<GhostPost[]> {
  try {
    const response = await axios.get(
      `${GHOST_API_URL}/ghost/api/content/posts/`,
      {
        params: {
          key: GHOST_CONTENT_API_KEY,
          filter: `tag:${tagSlug}`,
          limit: 'all',
          fields: 'id,title,slug,published_at,updated_at',
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

export async function fetchAllTags() {
  try {
    const response = await axios.get(
      `${GHOST_API_URL}/ghost/api/content/tags/`,
      {
        params: {
          key: GHOST_CONTENT_API_KEY,
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
