import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { type AppNotification, type SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Store', href: '/store', match: '/store' },
    { label: 'Library', href: '/library', match: '/library' },
    { label: 'Community', href: '/community', match: '/community' },
    { label: 'Support', href: '/support', match: '/support' },
];

const fontMonda = { fontFamily: "'Monda', sans-serif" };

function formatUcash(value: string | number) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

function timeAgo(value: string) {
    const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function openNotification(notification: AppNotification) {
    if (!notification.read_at) {
        router.post(`/notifications/${notification.id}/read`, {}, { preserveScroll: true });
    }
    if (notification.link) {
        router.visit(notification.link);
    }
}

export default function SiteHeader() {
    const { auth, cartCount, ucashBalance, notifications, unreadNotificationCount } = usePage<SharedData>().props;
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
            <Link href="/store" className="flex flex-shrink-0 items-center">
                <img src="/images/logo.png" alt="UAP" className="h-[34px] w-auto" />
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

            <div className="ml-auto flex items-center gap-1.5">
                <div
                    style={{
                        background: 'rgba(184, 50, 50, 0.06)',
                        border: '1px solid rgba(184, 50, 50, 0.15)',
                    }}
                    className="flex h-[38px] items-center"
                >
                    <Link
                        href="/cart"
                        style={{
                            ...fontMonda,
                            color: currentUrl.startsWith('/cart') ? 'var(--uap-accent)' : 'var(--uap-text-secondary)',
                        }}
                        className="relative flex h-full items-center px-3.5 text-[13px] font-semibold hover:text-[var(--uap-text-primary)]"
                    >
                        Cart
                        {cartCount > 0 && (
                            <span
                                style={{ ...fontMonda, background: 'var(--uap-accent-red)' }}
                                className="absolute top-1 right-1.5 flex h-4 min-w-4 items-center justify-center px-1 text-[9px] font-bold text-white"
                            >
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {auth.user && ucashBalance !== null && (
                        <Link
                            href="/wallet"
                            style={{
                                ...fontMonda,
                                color: currentUrl.startsWith('/wallet') ? 'var(--uap-accent)' : 'var(--uap-text-primary)',
                                borderLeft: '1px solid rgba(184, 50, 50, 0.15)',
                            }}
                            className="flex h-full items-center px-3.5 text-[13px] font-semibold hover:text-[var(--uap-accent)]"
                        >
                            {formatUcash(ucashBalance)}
                        </Link>
                    )}
                </div>

                {auth.user ? (
                    <div className="ml-1 flex items-center gap-1.5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    style={{
                                        background: 'rgba(184, 50, 50, 0.06)',
                                        border: '1px solid rgba(184, 50, 50, 0.15)',
                                    }}
                                    className="relative flex h-[38px] w-[38px] items-center justify-center"
                                >
                                    <Bell size={16} style={{ color: 'var(--uap-text-secondary)' }} />
                                    {unreadNotificationCount > 0 && (
                                        <span
                                            style={{ ...fontMonda, background: 'var(--uap-accent-red)' }}
                                            className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center px-1 text-[9px] font-bold text-white"
                                        >
                                            {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                                        </span>
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-80"
                                style={{
                                    ...fontMonda,
                                    background: 'var(--uap-bg-card)',
                                    border: '1px solid var(--uap-border)',
                                    color: 'var(--uap-text-primary)',
                                }}
                            >
                                <div className="flex items-center justify-between px-2 py-1.5">
                                    <span className="text-xs font-semibold uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                                        Notifications
                                    </span>
                                    {unreadNotificationCount > 0 && (
                                        <button
                                            onClick={() => router.post('/notifications/read-all', {}, { preserveScroll: true })}
                                            className="text-xs hover:underline"
                                            style={{ color: 'var(--uap-accent)' }}
                                        >
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <DropdownMenuSeparator style={{ background: 'var(--uap-border)' }} />
                                {notifications.length === 0 ? (
                                    <p className="px-2 py-4 text-center text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                                        No notifications yet.
                                    </p>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((n) => (
                                            <DropdownMenuItem
                                                key={n.id}
                                                onSelect={() => openNotification(n)}
                                                className="flex-col items-start gap-0.5 focus:bg-[var(--uap-bg-hover)] focus:text-[var(--uap-text-primary)]"
                                                style={{ background: n.read_at ? undefined : 'rgba(184, 50, 50, 0.06)' }}
                                            >
                                                <span className="text-sm font-semibold">{n.title}</span>
                                                {n.message && (
                                                    <span className="text-xs" style={{ color: 'var(--uap-text-secondary)' }}>
                                                        {n.message}
                                                    </span>
                                                )}
                                                <span className="text-[10px]" style={{ color: 'var(--uap-text-dim)' }}>
                                                    {timeAgo(n.created_at)}
                                                </span>
                                            </DropdownMenuItem>
                                        ))}
                                    </div>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    style={{
                                        background: 'rgba(184, 50, 50, 0.06)',
                                        border: '1px solid rgba(184, 50, 50, 0.15)',
                                    }}
                                    className="flex items-center gap-1.5 py-1 pl-1 pr-2"
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
                                    <ChevronDown size={14} style={{ color: 'var(--uap-text-secondary)' }} />
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
                    </div>
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
