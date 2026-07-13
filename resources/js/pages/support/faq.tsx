import SiteLayout from '@/components/site-layout';
import { SupportTabs } from '@/pages/support/help-home';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const FAQS = [
    {
        q: 'Can I refund a game I already purchased?',
        a: 'Yes, you can request a refund within 14 days of purchase as long as total playtime has not exceeded 2 hours. Go to the Refund Policy tab for full details or submit a request via Contact Us.',
    },
    {
        q: 'What payment methods are available?',
        a: 'We accept Bank Transfer, QRIS, GoPay, OVO, Dana, ShopeePay, and Visa/Mastercard Credit/Debit cards.',
    },
    {
        q: 'How long does the refund process take?',
        a: 'Refund verification takes 1–3 business days. Funds are returned to your original payment method within 3–7 business days after approval.',
    },
    {
        q: 'Can games be played offline?',
        a: 'It depends on the game. Most single-player games support offline mode after their initial download. Online and multiplayer games require an active internet connection.',
    },
    {
        q: 'Can I use my account on another device?',
        a: 'Yes, your UAP account works on any device. Just log in with the same email and password. A maximum of 3 devices can be active simultaneously.',
    },
    {
        q: 'What should I do if my account is hacked?',
        a: 'Contact our support team immediately via the Contact Us form with proof of account ownership (original email, purchase history). We will help recover your account within 24 hours.',
    },
    {
        q: 'How do I fix "Game failed to launch" error?',
        a: "Try these steps in order: (1) Restart the UAP client, (2) Verify game files from your Library, (3) Update your GPU drivers, (4) Temporarily disable antivirus, (5) Reinstall the game. If the issue persists, contact support.",
    },
    {
        q: 'How do I enable Two-Factor Authentication?',
        a: 'Go to Account Settings → Security → Two-Factor Authentication and follow the setup steps. We support authenticator apps and SMS verification. Enabling 2FA is strongly recommended.',
    },
    {
        q: 'Why is my download speed slow?',
        a: 'Try switching to a closer download server in Settings → Downloads. Pause other downloads or streaming apps, connect via ethernet instead of Wi-Fi, and ensure no background apps are consuming bandwidth.',
    },
    {
        q: 'Can I transfer my games to another account?',
        a: 'Game licenses are tied to the purchasing account and cannot be transferred to another account. Family sharing features may be available depending on your region.',
    },
];

export default function Faq() {
    const [query, setQuery] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const filtered = query
        ? FAQS.filter(
              (f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()),
          )
        : FAQS;

    return (
        <>
            <Head title="FAQ" />
            <SiteLayout section="support">
            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold">Help & Support</h1>
                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        How can we help you today?
                    </p>
                </div>

                <SupportTabs active="faq" />

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search help topics, FAQs, guides..."
                    style={{ background: 'var(--uap-bg-card)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                    className="mb-6 w-full max-w-md px-3 py-2 text-sm outline-none"
                />

                <h2 className="uap-section-title">Frequently Asked Questions</h2>

                {filtered.length === 0 ? (
                    <div className="uap-card p-8 text-center text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        No results found for &quot;{query}&quot;.
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filtered.map((faq, i) => (
                            <div key={faq.q} className="uap-card">
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
                                >
                                    <span>{faq.q}</span>
                                    <span style={{ color: 'var(--uap-accent)' }} className={`transition-transform ${openIndex === i ? 'rotate-90' : ''}`}>
                                        &rsaquo;
                                    </span>
                                </button>
                                {openIndex === i && (
                                    <div className="px-4 pb-3 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="uap-card mt-6 flex items-center justify-between p-6">
                    <div>
                        <div className="font-semibold">Still have questions?</div>
                        <div className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            Our team is happy to help with anything not covered here.
                        </div>
                    </div>
                    <Link href="/support/contact" className="uap-btn uap-btn-primary">
                        Contact Us
                    </Link>
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
