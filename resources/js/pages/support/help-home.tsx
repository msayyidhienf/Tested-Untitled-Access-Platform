import SiteLayout from '@/components/site-layout';
import { Head, Link } from '@inertiajs/react';

interface ArticleItem {
    id: number;
    title: string;
    views: number;
}

interface HelpHomeProps {
    popularArticles: ArticleItem[];
}

const CATEGORIES = [
    { code: 'Purchase & Payment', title: 'Purchase & Payment', desc: 'Transaction issues, payment methods, billing' },
    { code: 'Installation & Download', title: 'Installation & Download', desc: 'Failed install, slow download, launch errors' },
    { code: 'Account & Login', title: 'Account & Login', desc: 'Forgot password, locked account, change email' },
    { code: 'Refund', title: 'Refund & Returns', desc: 'Refund eligibility, how to apply, refund status' },
    { code: 'In-Game Issues', title: 'In-Game Issues', desc: 'Bugs, crashes, corrupt saves, performance' },
    { code: 'Account Security', title: 'Account Security', desc: 'Hacked account, enable 2FA, suspicious activity' },
];

function SupportTabs({ active }: { active: string }) {
    const tabs = [
        { key: '', label: 'Help Center', href: '/support' },
        { key: 'faq', label: 'FAQ', href: '/support/faq' },
        { key: 'contact', label: 'Contact Us', href: '/support/contact' },
        { key: 'refund', label: 'Refund Policy', href: '/support/refund' },
    ];

    return (
        <nav className="mb-6 flex gap-2" style={{ borderBottom: '1px solid var(--uap-border)' }}>
            {tabs.map((t) => (
                <Link
                    key={t.label}
                    href={t.href}
                    style={{
                        fontFamily: "'Monda', sans-serif",
                        color: active === t.key ? 'var(--uap-accent)' : 'var(--uap-text-secondary)',
                        borderBottom: active === t.key ? '2px solid var(--uap-accent)' : '2px solid transparent',
                    }}
                    className="px-4 py-2 text-sm font-semibold"
                >
                    {t.label}
                </Link>
            ))}
        </nav>
    );
}

export default function HelpHome({ popularArticles }: HelpHomeProps) {
    return (
        <>
            <Head title="Help & Support" />
            <SiteLayout section="support">
            <div className="px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold">Help & Support</h1>
                        <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            How can we help you today?
                        </p>
                    </div>
                    <Link href="/support/contact" className="uap-btn uap-btn-primary">
                        Open a Ticket
                    </Link>
                </div>

                <SupportTabs active="" />

                <h2 className="uap-section-title">Browse by Category</h2>
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {CATEGORIES.map((cat) => (
                        <Link key={cat.code} href={`/support/articles?cat=${encodeURIComponent(cat.code)}`} className="uap-card p-4">
                            <div className="mb-1 font-semibold">{cat.title}</div>
                            <div className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                {cat.desc}
                            </div>
                        </Link>
                    ))}
                </div>

                <h2 className="uap-section-title">Popular Articles</h2>
                <div className="mb-8 flex flex-col gap-2">
                    {popularArticles.length === 0 ? (
                        <div className="uap-card p-4 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            No articles available yet.
                        </div>
                    ) : (
                        popularArticles.map((article) => (
                            <Link key={article.id} href={`/support/articles/${article.id}`} className="uap-card flex items-center justify-between px-4 py-3">
                                <span>{article.title}</span>
                                <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {article.views.toLocaleString('id-ID')} views &rsaquo;
                                </span>
                            </Link>
                        ))
                    )}
                </div>

                <div className="uap-card flex items-center justify-between p-6">
                    <div>
                        <div className="font-semibold">Can't find what you're looking for?</div>
                        <div className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            Our support team is available every day to help you.
                        </div>
                    </div>
                    <Link href="/support/contact" className="uap-btn uap-btn-primary">
                        Contact Support
                    </Link>
                </div>
            </div>
            </SiteLayout>
        </>
    );
}

export { SupportTabs };
