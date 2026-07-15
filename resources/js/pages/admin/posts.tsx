import AdminLayout from '@/layouts/admin-layout';
import { Head, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface PostRow {
    id: number;
    title: string;
    content: string;
    category: string;
    created_at: string;
    edited_at: string | null;
    replies_count: number;
    user: { id: number; username: string; email: string } | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface AdminPostsProps {
    posts: Paginated<PostRow>;
    search: string;
    category: string;
}

const CATEGORIES = ['General', 'Announcement', 'Game Discussion', 'Tech Support', 'Trading'];

export default function AdminPosts({ posts, search, category }: AdminPostsProps) {
    const filterBy = (key: string) => {
        router.get('/admin/posts', { ...(key ? { category: key } : {}), ...(search ? { search } : {}) }, { preserveState: true });
    };

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        const value = (e.target as HTMLFormElement).search.value;
        router.get('/admin/posts', { ...(category ? { category } : {}), ...(value ? { search: value } : {}) }, { preserveState: true });
    };

    const deletePost = (post: PostRow) => {
        if (confirm(`Delete post "${post.title}" by ${post.user?.username ?? 'unknown user'}? This also removes its replies.`)) {
            router.post(`/admin/posts/${post.id}/delete`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Posts" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-extrabold">Community Posts</h1>
                <span className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                    {posts.data.length} of this page
                </span>
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => filterBy('')} className={`uap-tag ${!category ? 'uap-tag-accent' : ''}`}>
                        All
                    </button>
                    {CATEGORIES.map((c) => (
                        <button key={c} onClick={() => filterBy(c)} className={`uap-tag ${category === c ? 'uap-tag-accent' : ''}`}>
                            {c}
                        </button>
                    ))}
                </div>
                <form onSubmit={submitSearch} className="flex gap-2">
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Search title, content, or username"
                        className="p-2 text-sm"
                        style={{ background: 'var(--uap-bg-deep)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                    />
                    <button type="submit" className="uap-btn uap-btn-outline uap-btn-sm">
                        Search
                    </button>
                </form>
            </div>

            <div className="uap-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Author</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Replies</th>
                            <th className="px-4 py-3">Posted</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-10 text-center" style={{ color: 'var(--uap-text-dim)' }}>
                                    No posts found.
                                </td>
                            </tr>
                        )}
                        {posts.data.map((post) => (
                            <tr key={post.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                <td className="max-w-[280px] px-4 py-3">
                                    <p className="truncate font-semibold">{post.title}</p>
                                    <p className="truncate text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                        {post.content}
                                        {post.edited_at && <span style={{ color: 'var(--uap-accent-gold)' }}> · edited</span>}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <p>{post.user?.username ?? 'Deleted user'}</p>
                                    <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                        {post.user?.email}
                                    </p>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="uap-tag">{post.category}</span>
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {post.replies_count}
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {new Date(post.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => deletePost(post)} className="uap-btn uap-btn-danger uap-btn-sm">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {posts.last_page > 1 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {posts.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                            className={`uap-tag ${link.active ? 'uap-tag-accent' : ''}`}
                            style={!link.url ? { opacity: 0.4, cursor: 'default' } : undefined}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
