import SiteLayout from '@/components/site-layout';
import { SupportTabs } from '@/pages/support/help-home';
import { Head, Link } from '@inertiajs/react';

interface ArticleProps {
    article: {
        id: number;
        title: string;
        content: string;
        category: string;
        views: number;
    };
}

export default function Article({ article }: ArticleProps) {
    return (
        <>
            <Head title={article.title} />
            <SiteLayout section="support">
            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold">Help & Support</h1>
                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        How can we help you today?
                    </p>
                </div>

                <SupportTabs active="" />

                <Link
                    href={`/support/articles?cat=${encodeURIComponent(article.category)}`}
                    className="mb-4 inline-block text-sm"
                    style={{ color: 'var(--uap-text-secondary)' }}
                >
                    &larr; Back to {article.category}
                </Link>

                <div className="uap-card p-6">
                    <div className="mb-2 flex items-center gap-2 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                        <span className="uap-tag">{article.category}</span>
                        <span>{article.views.toLocaleString('id-ID')} views</span>
                    </div>
                    <h2 className="mb-4 text-xl font-extrabold">{article.title}</h2>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--uap-text-secondary)' }}>
                        {article.content}
                    </p>
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
