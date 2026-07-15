import CommunitySidebar, { CommunityTabs } from '@/components/community-sidebar';
import SiteLayout from '@/components/site-layout';
import UserAvatar from '@/components/user-avatar';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface ReplyItem {
    id: number;
    content: string;
    created_at: string;
    user: { id: number; username: string; avatar: string | null };
}

interface PostItem {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
    user: { id: number; username: string; avatar: string | null };
    replies: ReplyItem[];
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

function PostCard({ post, canReply }: { post: PostItem; canReply: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitReply: FormEventHandler = (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setSubmitting(true);
        router.post(
            `/community/posts/${post.id}/replies`,
            { content: replyContent },
            {
                preserveScroll: true,
                onSuccess: () => setReplyContent(''),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <div className="uap-card p-4">
            <div className="mb-2 flex items-center gap-2">
                <UserAvatar user={post.user} />
                <Link href={`/profile/${post.user.id}`} className="text-sm font-semibold hover:underline">
                    {post.user.username}
                </Link>
                <span className="uap-tag">{post.category}</span>
            </div>
            <h3 className="mb-1 font-semibold">{post.title}</h3>
            <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                {post.content}
            </p>

            <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 text-xs hover:underline"
                style={{ color: 'var(--uap-text-dim)' }}
            >
                {post.replies.length} repl{post.replies.length === 1 ? 'y' : 'ies'} {expanded ? '▲' : '▼'}
            </button>

            {expanded && (
                <div className="mt-3 flex flex-col gap-3" style={{ borderTop: '1px solid var(--uap-border)', paddingTop: '12px' }}>
                    {post.replies.length === 0 && (
                        <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                            No replies yet.
                        </p>
                    )}
                    {post.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-2">
                            <UserAvatar user={reply.user} />
                            <div>
                                <Link href={`/profile/${reply.user.id}`} className="text-xs font-semibold hover:underline">
                                    {reply.user.username}
                                </Link>
                                <p className="text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {reply.content}
                                </p>
                            </div>
                        </div>
                    ))}

                    {canReply && (
                        <form onSubmit={submitReply} className="flex gap-2">
                            <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                style={inputStyle}
                                className="flex-1 px-3 py-1.5 text-xs outline-none"
                            />
                            <button type="submit" disabled={submitting} className="uap-btn uap-btn-primary uap-btn-sm">
                                Reply
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

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
                                    No posts yet.
                                </div>
                            )}
                            {posts.map((post) => (
                                <PostCard key={post.id} post={post} canReply={!!auth.user} />
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
