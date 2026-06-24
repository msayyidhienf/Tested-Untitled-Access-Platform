import CommunitySidebar, { CommunityTabs } from '@/components/community-sidebar';
import SiteLayout from '@/components/site-layout';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface PostItem {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
    user: { username: string; avatar: string | null };
    replies_count: number;
}

interface FeedProps {
    posts: PostItem[];
    category: string | null;
    sidebar: any;
}

const CATEGORIES = ['General', 'Announcement', 'Game Discussion', 'Tech Support', 'Trading'];

const inputStyle = {
    background: 'var(--uap-bg-deep)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

export default function CommunityFeed({ posts, category, sidebar }: FeedProps) {
    const { auth } = usePage<SharedData>().props;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [postCategory, setPostCategory] = useState('General');

    const submitPost: FormEventHandler = (e) => {
        e.preventDefault();
        router.post(
            '/community/posts',
            { title, content, category: postCategory },
            {
                onSuccess: () => {
                    setTitle('');
                    setContent('');
                },
            },
        );
    };

    return (
        <>
            <Head title="Community" />
            <SiteLayout section="community">
            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold">Community</h1>
                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        Connect, share, and discuss with the UAP community.
                    </p>
                </div>

                <div className="flex gap-6">
                    <div className="flex-1">
                        <CommunityTabs active="feed" />

                        {auth.user && (
                            <form onSubmit={submitPost} className="uap-card mb-6 p-4">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Post title..."
                                    required
                                    style={inputStyle}
                                    className="mb-2 w-full px-3 py-2 text-sm outline-none"
                                />
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="What's on your mind?"
                                    required
                                    rows={3}
                                    style={inputStyle}
                                    className="mb-2 w-full px-3 py-2 text-sm outline-none"
                                />
                                <div className="flex items-center justify-between">
                                    <select
                                        value={postCategory}
                                        onChange={(e) => setPostCategory(e.target.value)}
                                        style={inputStyle}
                                        className="px-2 py-1.5 text-sm"
                                    >
                                        {CATEGORIES.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                    <button type="submit" className="uap-btn uap-btn-primary uap-btn-sm">
                                        Post
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mb-4 flex flex-wrap gap-2">
                            <Link href="/community" className={`uap-tag ${!category ? 'uap-tag-accent' : ''}`}>
                                All
                            </Link>
                            {CATEGORIES.map((c) => (
                                <Link
                                    key={c}
                                    href={`/community?category=${encodeURIComponent(c)}`}
                                    className={`uap-tag ${category === c ? 'uap-tag-accent' : ''}`}
                                >
                                    {c}
                                </Link>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            {posts.length === 0 && (
                                <div className="uap-card p-12 text-center text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                    Belum ada post.
                                </div>
                            )}
                            {posts.map((post) => (
                                <div key={post.id} className="uap-card p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <div
                                            className="flex h-7 w-7 items-center justify-center text-xs font-bold"
                                            style={{ background: 'var(--uap-bg-hover)' }}
                                        >
                                            {post.user.username.slice(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-semibold">{post.user.username}</span>
                                        <span className="uap-tag">{post.category}</span>
                                    </div>
                                    <h3 className="mb-1 font-semibold">{post.title}</h3>
                                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        {post.content}
                                    </p>
                                    <div className="mt-2 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                        {post.replies_count} replies
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <CommunitySidebar sidebar={sidebar} />
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
