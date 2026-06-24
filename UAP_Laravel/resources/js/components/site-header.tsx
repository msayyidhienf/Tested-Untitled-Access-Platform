import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const NAV_ITEMS = [
    { label: 'Store', href: '/store', match: '/store' },
    { label: 'Library', href: '/library', match: '/library' },
    { label: 'Community', href: '/community', match: '/community' },
    { label: 'Support', href: '/support', match: '/support' },
];

const fontMonda = { fontFamily: "'Monda', sans-serif" };

export default function SiteHeader() {
    const { auth, cartCount } = usePage<SharedData>().props;
    const currentUrl = usePage().url;

    return (
        <header
            style={{
                height: 'var(--uap-topbar-h)',
                background: 'rgba(19, 19, 24, 0.96)',
                borderBottom: '1px solid var(--uap-border)',
                backdropFilter: 'blur(12px)',
            }}
            className="sticky top-0 z-50 flex items-center gap-0 px-6"
        >
            <Link href="/store" style={{ ...fontMonda, color: 'var(--uap-accent)' }} className="flex-shrink-0 text-lg font-extrabold">
                UAP
            </Link>

            <nav className="ml-8 flex flex-1 items-center gap-0.5">
                {NAV_ITEMS.map((item) => {
                    const active = currentUrl.startsWith(item.match);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                ...fontMonda,
                                color: active ? 'var(--uap-accent)' : 'var(--uap-text-secondary)',
                                background: active ? 'rgba(184, 50, 50, 0.08)' : 'transparent',
                                letterSpacing: '0.02em',
                            }}
                            className="px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:text-[var(--uap-text-primary)]"
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="ml-auto flex items-center gap-2.5">
                <Link
                    href="/cart"
                    style={{
                        ...fontMonda,
                        color: currentUrl.startsWith('/cart') ? 'var(--uap-accent)' : 'var(--uap-text-secondary)',
                    }}
                    className="relative px-3.5 py-1.5 text-[13px] font-semibold hover:text-[var(--uap-text-primary)]"
                >
                    Cart
                    {cartCount > 0 && (
                        <span
                            style={{ ...fontMonda, background: 'var(--uap-accent-red)' }}
                            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center px-1 text-[9px] font-bold text-white"
                        >
                            {cartCount}
                        </span>
                    )}
                </Link>

                {auth.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                style={{
                                    background: 'rgba(184, 50, 50, 0.06)',
                                    border: '1px solid rgba(184, 50, 50, 0.15)',
                                }}
                                className="flex items-center gap-2 py-1 pl-1 pr-3"
                            >
                                {auth.user.avatar ? (
                                    <img
                                        src={`/uploads/avatars/${auth.user.id}/${auth.user.avatar}`}
                                        alt={auth.user.username}
                                        style={{ border: '2px solid rgba(184, 50, 50, 0.5)' }}
                                        className="h-[30px] w-[30px] object-cover"
                                    />
                                ) : (
                                    <span
                                        style={{ ...fontMonda, border: '2px solid rgba(184, 50, 50, 0.5)', background: 'var(--uap-bg-hover)' }}
                                        className="flex h-[30px] w-[30px] items-center justify-center text-xs font-bold text-[var(--uap-text-primary)]"
                                    >
                                        {auth.user.username.slice(0, 2).toUpperCase()}
                                    </span>
                                )}
                                <span style={{ ...fontMonda, color: 'var(--uap-text-primary)' }} className="text-[13px] font-semibold">
                                    {auth.user.username}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48"
                            style={{ ...fontMonda, background: 'var(--uap-bg-card)', border: '1px solid var(--uap-border)', color: 'var(--uap-text-primary)' }}
                        >
                            <DropdownMenuItem asChild className="focus:bg-[var(--uap-bg-hover)] focus:text-[var(--uap-text-primary)]">
                                <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="focus:bg-[var(--uap-bg-hover)] focus:text-[var(--uap-text-primary)]">
                                <Link href="/settings/profile">Account Settings</Link>
                            </DropdownMenuItem>
                            {auth.user.role === 'admin' && (
                                <DropdownMenuItem asChild className="focus:bg-[var(--uap-bg-hover)] focus:text-[var(--uap-text-primary)]">
                                    <Link href="/admin" style={{ color: 'var(--uap-accent)' }}>
                                        Admin Panel
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator style={{ background: 'var(--uap-border)' }} />
                            <DropdownMenuItem asChild className="focus:bg-[var(--uap-bg-hover)] focus:text-[var(--uap-accent-red)]">
                                <Link href="/logout" method="post" as="button" className="w-full" style={{ color: 'var(--uap-accent-red)' }}>
                                    Logout
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            style={{ ...fontMonda, color: 'var(--uap-text-secondary)', border: '1px solid var(--uap-border)' }}
                            className="px-3.5 py-1 text-xs font-semibold hover:text-[var(--uap-text-primary)]"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            style={{ ...fontMonda, background: 'var(--uap-accent)' }}
                            className="px-3.5 py-1 text-xs font-semibold text-white"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
