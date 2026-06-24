import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';

interface RecentUser {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
}

interface RecentGame {
    id: number;
    title: string;
    genre: string | null;
    price: string;
    is_free: boolean;
    discount: number;
    image: string | null;
}

interface DashboardProps {
    stats: {
        totalUsers: number;
        totalGames: number;
        freeGames: number;
        onSaleGames: number;
        totalOrders: number;
        totalRevenue: number;
    };
    recentUsers: RecentUser[];
    recentGames: RecentGame[];
}

function formatPrice(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function AdminDashboard({ stats, recentUsers, recentGames }: DashboardProps) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold">Dashboard</h1>
                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                        Welcome back, Admin
                    </p>
                </div>
                <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                    {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
            </div>

            <div className="mb-8 grid grid-cols-4 gap-4">
                <div className="uap-card p-5">
                    <div className="mb-2 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Total Users
                    </div>
                    <div className="text-3xl font-extrabold">{stats.totalUsers.toLocaleString('id-ID')}</div>
                    <Link href="/admin/users" className="mt-2 inline-block text-xs hover:underline" style={{ color: 'var(--uap-accent)' }}>
                        Manage Users
                    </Link>
                </div>
                <div className="uap-card p-5">
                    <div className="mb-2 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Total Games
                    </div>
                    <div className="text-3xl font-extrabold">{stats.totalGames.toLocaleString('id-ID')}</div>
                    <Link href="/admin/games" className="mt-2 inline-block text-xs hover:underline" style={{ color: 'var(--uap-accent)' }}>
                        Manage Games
                    </Link>
                </div>
                <div className="uap-card p-5">
                    <div className="mb-2 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        On Sale
                    </div>
                    <div className="text-3xl font-extrabold" style={{ color: 'var(--uap-accent)' }}>
                        {stats.onSaleGames}
                    </div>
                    <span className="mt-2 inline-block text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                        {stats.freeGames} free to play
                    </span>
                </div>
                <div className="uap-card p-5">
                    <div className="mb-2 text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                        Revenue
                    </div>
                    <div className="text-2xl font-extrabold" style={{ color: 'var(--uap-accent-green)' }}>
                        {formatPrice(stats.totalRevenue)}
                    </div>
                    <span className="mt-2 inline-block text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                        {stats.totalOrders} orders
                    </span>
                </div>
            </div>

            <div className="mb-8 flex gap-3">
                <Link href="/admin/games" className="uap-btn uap-btn-primary">
                    + Add Game
                </Link>
                <Link href="/admin/users" className="uap-btn uap-btn-outline">
                    Manage Users
                </Link>
                <Link href="/admin/tickets" className="uap-btn uap-btn-outline">
                    Support Tickets
                </Link>
                <a href="/store" target="_blank" className="uap-btn uap-btn-outline">
                    View Store
                </a>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="uap-card">
                    <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--uap-border)' }}>
                        <span className="text-sm font-semibold">Recent Users</span>
                        <Link href="/admin/users" className="text-xs hover:underline" style={{ color: 'var(--uap-accent)' }}>
                            View All
                        </Link>
                    </div>
                    {recentUsers.map((u) => (
                        <div
                            key={u.id}
                            className="flex items-center justify-between px-5 py-3 last:border-b-0"
                            style={{ borderBottom: '1px solid var(--uap-border)' }}
                        >
                            <div>
                                <div className="text-sm font-medium">{u.username}</div>
                                <div className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {u.email}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {u.role === 'admin' && <span className="uap-tag uap-tag-accent">ADMIN</span>}
                                <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {new Date(u.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="uap-card">
                    <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid var(--uap-border)' }}>
                        <span className="text-sm font-semibold">Recent Games</span>
                        <Link href="/admin/games" className="text-xs hover:underline" style={{ color: 'var(--uap-accent)' }}>
                            View All
                        </Link>
                    </div>
                    {recentGames.map((g) => (
                        <div
                            key={g.id}
                            className="flex items-center gap-3 px-5 py-3 last:border-b-0"
                            style={{ borderBottom: '1px solid var(--uap-border)' }}
                        >
                            <div className="h-8 w-12 flex-shrink-0 overflow-hidden" style={{ background: 'var(--uap-bg-deep)' }}>
                                {g.image && <img src={`/uploads/games/${g.image}`} className="h-full w-full object-cover" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">{g.title}</div>
                                <div className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {g.genre}
                                </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                {g.is_free ? (
                                    <span className="text-xs font-bold" style={{ color: 'var(--uap-accent-green)' }}>
                                        FREE
                                    </span>
                                ) : g.discount > 0 ? (
                                    <span className="uap-price-discount">-{g.discount}%</span>
                                ) : (
                                    <span className="uap-price-tag">{formatPrice(Number(g.price))}</span>
                                )}
                                <div className="mt-1">
                                    <Link href={`/admin/games?edit=${g.id}`} className="text-[10px] hover:underline" style={{ color: 'var(--uap-accent)' }}>
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
