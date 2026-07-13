import AdminLayout from '@/layouts/admin-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface ArticleRow {
    id: number;
    category: string;
    title: string;
    content: string;
    views: number;
}

interface ArticlesProps {
    articles: ArticleRow[];
    editArticle: ArticleRow | null;
}

const inputStyle = {
    background: 'var(--uap-bg-deep)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

function ArticleForm({ editArticle, onDone }: { editArticle: ArticleRow | null; onDone: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        category: editArticle?.category ?? '',
        title: editArticle?.title ?? '',
        content: editArticle?.content ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const url = editArticle ? `/admin/articles/${editArticle.id}` : '/admin/articles';
        post(url, {
            onSuccess: () => {
                reset();
                onDone();
            },
        });
    };

    return (
        <form onSubmit={submit} className="uap-card mb-6 p-6">
            <h2 className="uap-section-title">{editArticle ? 'Edit Article' : 'Add Article'}</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                        Category
                    </label>
                    <input
                        type="text"
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        placeholder="e.g. Account, Billing, Troubleshooting"
                        required
                        style={inputStyle}
                        className="w-full px-3 py-2 text-sm outline-none"
                    />
                    {errors.category && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                            {errors.category}
                        </p>
                    )}
                </div>
                <div>
                    <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                        Title
                    </label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                        style={inputStyle}
                        className="w-full px-3 py-2 text-sm outline-none"
                    />
                    {errors.title && (
                        <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                            {errors.title}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                    Content
                </label>
                <textarea
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    rows={6}
                    required
                    style={inputStyle}
                    className="w-full px-3 py-2 text-sm outline-none"
                />
                {errors.content && (
                    <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                        {errors.content}
                    </p>
                )}
            </div>
            <div className="mt-4 flex gap-2">
                <button type="submit" disabled={processing} className="uap-btn uap-btn-primary">
                    {editArticle ? 'Update Article' : 'Add Article'}
                </button>
                {editArticle && (
                    <button type="button" onClick={onDone} className="uap-btn uap-btn-outline">
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default function AdminArticles({ articles, editArticle }: ArticlesProps) {
    const deleteArticle = (article: ArticleRow) => {
        if (confirm(`Delete article "${article.title}"?`)) {
            router.post(`/admin/articles/${article.id}/delete`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Admin Support Articles" />

            <h1 className="mb-6 text-2xl font-extrabold">Support Articles</h1>

            <ArticleForm key={editArticle?.id ?? 'new'} editArticle={editArticle} onDone={() => router.get('/admin/articles')} />

            <div className="uap-card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Views</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-10 text-center" style={{ color: 'var(--uap-text-dim)' }}>
                                    No articles yet.
                                </td>
                            </tr>
                        )}
                        {articles.map((article) => (
                            <tr key={article.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                <td className="px-4 py-3 font-medium">{article.title}</td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {article.category}
                                </td>
                                <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {article.views.toLocaleString('id-ID')}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.get('/admin/articles', { edit: article.id })}
                                            className="uap-btn uap-btn-outline uap-btn-sm"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => deleteArticle(article)} className="uap-btn uap-btn-danger uap-btn-sm">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
