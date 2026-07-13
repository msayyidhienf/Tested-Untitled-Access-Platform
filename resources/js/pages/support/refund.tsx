import SiteLayout from '@/components/site-layout';
import { SupportTabs } from '@/pages/support/help-home';
import { Head, Link } from '@inertiajs/react';

const RULES = [
    {
        color: '#4a8a5a',
        title: 'Eligibility',
        body: 'Request must be submitted within 14 days of purchase and total playtime must be under 2 hours.',
    },
    {
        color: '#6677aa',
        title: 'Processing Time',
        body: 'Refund verification takes 1–3 business days. Funds are returned within 3–7 business days after approval.',
    },
    {
        color: '#c04040',
        title: 'Non-Refundable',
        body: 'DLC, in-game items, UAP Wallet top-ups, and games played for more than 2 hours are not eligible for refund.',
    },
    {
        color: '#a08040',
        title: 'How to Request',
        body: 'Click "Request a Refund" below, select Refund as the category, and describe your purchase. Our team will review within 1–3 business days.',
    },
];

export default function Refund() {
    return (
        <>
            <Head title="Refund Policy" />
            <SiteLayout section="support">
            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold">Help & Support</h1>
                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        How can we help you today?
                    </p>
                </div>

                <SupportTabs active="refund" />

                <h2 className="uap-section-title">Refund Policy</h2>

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="flex flex-col gap-3">
                        <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            UAP makes refunds easy to ensure your satisfaction with every purchase. Below are the terms and conditions that apply
                            to all refund requests.
                        </p>

                        {RULES.map((rule) => (
                            <div
                                key={rule.title}
                                className="p-4"
                                style={{ background: 'var(--uap-bg-card)', borderLeft: `4px solid ${rule.color}` }}
                            >
                                <div className="mb-1 font-semibold" style={{ color: rule.color }}>
                                    {rule.title}
                                </div>
                                <div className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {rule.body}
                                </div>
                            </div>
                        ))}

                        <Link href="/support/contact" className="uap-btn uap-btn-primary mt-2 inline-block text-center">
                            Request a Refund
                        </Link>
                    </div>

                    <div className="uap-card p-5">
                        <h3 className="uap-section-title">Quick Eligibility Check</h3>

                        <div className="flex flex-col gap-2 text-sm">
                            {[
                                'Purchased within the last 14 days',
                                'Less than 2 hours of total playtime',
                                'Full game (not DLC or in-game item)',
                                'Not purchased with promotional credit',
                            ].map((line) => (
                                <div key={line} className="flex items-center gap-2">
                                    <span style={{ color: 'var(--uap-accent-green)' }}>✓</span>
                                    <span>{line}</span>
                                </div>
                            ))}
                        </div>

                        <hr className="my-4" style={{ borderColor: 'var(--uap-border)' }} />

                        <div className="flex flex-col gap-2 text-sm">
                            {[
                                'More than 2 hours played — not eligible',
                                'Purchase older than 14 days — not eligible',
                                'DLC or in-game items — not eligible',
                            ].map((line) => (
                                <div key={line} className="flex items-center gap-2">
                                    <span style={{ color: 'var(--uap-accent-red)' }}>✗</span>
                                    <span>{line}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/support/contact" className="uap-btn uap-btn-outline mt-5 block text-center">
                            Submit Refund Request &rsaquo;
                        </Link>
                    </div>
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
