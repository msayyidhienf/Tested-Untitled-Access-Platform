import { Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Games', href: '/admin/games' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Support Tickets', href: '/admin/tickets' },
];

const fontMonda = { fontFamily: "'Monda', sans-serif" };

export default function AdminLayout({ children }: { children: ReactNode }) {
    const currentUrl = usePage().url;

    return (
        <div className="uap-page flex">
            <aside
                className="fixed top-0 left-0 flex h-screen w-56 flex-col"
                style={{ background: 'var(--uap-bg-deep)', borderRight: '1px solid var(--uap-border)' }}
            >
                <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--uap-border)' }}>
                    <Link href="/admin" className="flex items-center gap-2">
                        <span style={{ ...fontMonda, color: 'var(--uap-accent)' }} className="text-lg font-extrabold">
                            UAP
                        </span>
                        <span style={{ ...fontMonda, color: 'var(--uap-accent)' }} className="text-[11px] font-bold tracking-widest uppercase">
                            Admin
                        </span>
                    </Link>
                </div>

                <nav className="flex flex-1 flex-col gap-0.5 py-4">
                    <span style={{ ...fontMonda, color: 'var(--uap-text-dim)' }} className="px-5 pb-1.5 text-[10px] font-bold tracking-widest uppercase">
                        Management
                    </span>
                    {NAV_ITEMS.map((item) => {
                        const active = currentUrl === item.href || (item.href !== '/admin' && currentUrl.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    ...fontMonda,
                                    borderLeft: active ? '2px solid var(--uap-accent)' : '2px solid transparent',
                                    color: active ? 'var(--uap-accent)' : 'var(--uap-text-secondary)',
                                    background: active ? 'rgba(184, 50, 50, 0.06)' : 'transparent',
                                }}
                                className="px-5 py-2.5 text-[13px] font-semibold"
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex flex-col gap-1 px-5 py-4" style={{ borderTop: '1px solid var(--uap-border)' }}>
                    <Link href="/store" style={{ ...fontMonda, color: 'var(--uap-text-secondary)' }} className="py-1 text-xs font-semibold">
                        Back to Store
                    </Link>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        style={{ ...fontMonda, color: 'var(--uap-accent-red)' }}
                        className="py-1 text-left text-xs font-semibold"
                    >
                        Logout
                    </Link>
                </div>
            </aside>

            <main className="ml-56 flex-1 p-8">{children}</main>
        </div>
    );
}
