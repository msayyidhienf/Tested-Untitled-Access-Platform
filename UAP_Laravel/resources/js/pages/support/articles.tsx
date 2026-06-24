import SiteLayout from '@/components/site-layout';
import { SupportTabs } from '@/pages/support/help-home';
import { Head, Link } from '@inertiajs/react';

interface ArticleItem {
    id: number;
    title: string;
    views: number;
}

interface ArticlesProps {
    category: string;
    articles: ArticleItem[];
}

export default function Articles({ category, articles }: ArticlesProps) {
    return (
        <>
            <Head title={category || 'Articles'} />
            <SiteLayout section="support">
            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold">Help & Support</h1>
                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        How can we help you today?
                    </p>
                </div>

                <SupportTabs active="" />

                <h2 className="uap-section-title">{category || 'Articles'}</h2>

                {articles.length === 0 ? (
                    <div className="uap-card p-8 text-center text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        No articles found in this category.
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {articles.map((article) => (
                            <Link key={article.id} href={`/support/articles/${article.id}`} className="uap-card flex items-center justify-between px-4 py-3">
                                <span>{article.title}</span>
                                <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {article.views.toLocaleString('id-ID')} views &rsaquo;
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            </SiteLayout>
        </>
    );
}
