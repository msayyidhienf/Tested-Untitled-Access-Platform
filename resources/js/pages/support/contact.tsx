import SiteLayout from '@/components/site-layout';
import { SupportTabs } from '@/pages/support/help-home';
import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface ContactProps {
    sent: boolean;
}

const CATEGORIES = [
    'Purchase & Payment',
    'Installation & Download',
    'Account & Login',
    'Refund',
    'In-Game Issues',
    'Account Security',
    'Other',
];

const inputStyle = {
    background: 'var(--uap-bg-deep)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

export default function Contact({ sent }: ContactProps) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user?.username ?? '',
        email: auth.user?.email ?? '',
        category: '',
        message: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/support/contact', {
            onSuccess: () => reset('message'),
        });
    };

    return (
        <>
            <Head title="Contact Us" />
            <SiteLayout section="support">
            <div className="px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold">Help & Support</h1>
                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        How can we help you today?
                    </p>
                </div>

                <SupportTabs active="contact" />

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <div className="uap-card p-6">
                        <h2 className="uap-section-title">Send us a message</h2>

                        {sent && (
                            <div
                                className="mb-4 p-3 text-sm"
                                style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.25)', color: 'var(--uap-accent-green)' }}
                            >
                                <strong>Message sent!</strong> Our team will get back to you within 24 business hours.
                            </div>
                        )}

                        <form onSubmit={submit} className="flex flex-col gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Your name"
                                        style={inputStyle}
                                        className="w-full px-3 py-2 text-sm outline-none"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="you@example.com"
                                        style={inputStyle}
                                        className="w-full px-3 py-2 text-sm outline-none"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                                    Issue Category
                                </label>
                                <select value={data.category} onChange={(e) => setData('category', e.target.value)} style={inputStyle} className="w-full px-3 py-2 text-sm">
                                    <option value="">Select a category...</option>
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                                    Describe your issue
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) => setData('message', e.target.value)}
                                    rows={5}
                                    placeholder="Please describe your issue in as much detail as possible."
                                    style={inputStyle}
                                    className="w-full px-3 py-2 text-sm outline-none"
                                />
                                {errors.message && (
                                    <p className="mt-1 text-xs" style={{ color: 'var(--uap-accent-red)' }}>
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <button type="submit" disabled={processing} className="uap-btn uap-btn-primary" style={{ opacity: processing ? 0.5 : 1 }}>
                                Send Message
                            </button>
                        </form>
                    </div>

                    <aside className="flex flex-col gap-3">
                        {[
                            ['Live Chat', 'Chat directly with our support team. Available every day.', 'Online — avg. response 5 min'],
                            ['Email Support', 'support@uap.id', 'Response within 24 business hours'],
                            ['Business Hours', 'Mon – Fri: 09:00 – 21:00 WIB', 'Sat – Sun: 10:00 – 18:00 WIB'],
                            ['Ticket Response Time', 'Most tickets are resolved within 1 business day.', 'Priority support for account issues'],
                        ].map(([title, body, status]) => (
                            <div key={title} className="uap-card p-4">
                                <div className="mb-1 font-semibold">{title}</div>
                                <div className="mb-1 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {body}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {status}
                                </div>
                            </div>
                        ))}
                    </aside>
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
