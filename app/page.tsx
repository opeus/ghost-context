'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  slug: string;
  url: string;
  excerpt?: string;
  feature_image?: string;
  published_at: string;
  tags?: Array<{ name: string; slug: string }>;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [filterTag, setFilterTag] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      loadData();
    }
  }, [status]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsRes, tagsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/posts?type=tags'),
      ]);
      const postsData = await postsRes.json();
      const tagsData = await tagsRes.json();
      setPosts(postsData.posts || []);
      setTags(tagsData.tags || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
    setLoading(false);
  };

  const filteredPosts = filterTag
    ? posts.filter((post) =>
        post.tags?.some((tag) => tag.slug === filterTag)
      )
    : posts;

  const togglePost = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const selectAll = () => {
    setSelectedPosts(new Set(filteredPosts.map((p) => p.id)));
  };

  const deselectAll = () => {
    setSelectedPosts(new Set());
  };

  const exportContext = async () => {
    if (selectedPosts.size === 0) {
      alert('Please select at least one post to export');
      return;
    }

    setExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postIds: Array.from(selectedPosts) }),
      });

      const data = await response.json();

      if (response.ok) {
        // Download the file
        const blob = new Blob([data.content], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export: ' + data.error);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export posts');
    }
    setExporting(false);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ghost Context Exporter</h1>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Filter & Selection</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Tag
            </label>
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Posts</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.slug}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={selectAll}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Select All ({filteredPosts.length})
            </button>
            <button
              onClick={deselectAll}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md"
            >
              Deselect All
            </button>
            <button
              onClick={exportContext}
              disabled={selectedPosts.size === 0 || exporting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {exporting ? 'Exporting...' : `Export ${selectedPosts.size} Selected`}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Posts ({filteredPosts.length})
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => togglePost(post.id)}
                className={`p-4 rounded-md cursor-pointer transition-colors ${
                  selectedPosts.has(post.id)
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="flex gap-4">
                  {post.feature_image && (
                    <div className="flex-shrink-0">
                      <img
                        src={post.feature_image}
                        alt={post.title}
                        className="w-32 h-24 object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-lg">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-300 hover:text-blue-200 hover:underline"
                      >
                        View →
                      </a>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag.slug}
                            className="px-2 py-1 bg-gray-800 rounded text-xs"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedPosts.has(post.id)}
                    onChange={() => {}}
                    className="ml-4 w-5 h-5 flex-shrink-0 mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
