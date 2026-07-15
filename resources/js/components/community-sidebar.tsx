import UserAvatar from '@/components/user-avatar';
import { Link } from '@inertiajs/react';
import type { CSSProperties } from 'react';

interface TopPlayer {
    id: number;
    username: string;
    avatar: string | null;
    total_hours: number;
}

interface LiveGame {
    title: string;
    player_count: number;
}

interface TrendingGame {
    title: string;
    review_count: number;
}

interface SidebarData {
    topPlayers: TopPlayer[];
    liveGames: LiveGame[];
    trending: TrendingGame[];
    stats: {
        totalPosts: number;
        totalMembers: number;
        totalReviews: number;
    };
}

const BAR_COLORS = ['var(--uap-accent)', 'var(--uap-accent-green)', 'var(--uap-accent-blue)', 'var(--uap-accent-gold)'];

const widgetTitleStyle: CSSProperties = {
    fontFamily: "'Monda', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: 'var(--uap-text-dim)',
};

export default function CommunitySidebar({ sidebar }: { sidebar: SidebarData }) {
    const maxPlayers = Math.max(1, ...sidebar.liveGames.map((g) => g.player_count));

    return (
        <aside className="flex w-72 flex-shrink-0 flex-col gap-4">
            {/* Live Activity */}
            <div className="uap-card p-4">
                <div className="mb-2 flex items-center gap-2" style={widgetTitleStyle}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--uap-accent-green)' }} />
                    LIVE ACTIVITY
                </div>
                <div className="text-2xl font-extrabold">{sidebar.stats.totalMembers.toLocaleString('id-ID')}</div>
                <div className="mb-3 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                    REGISTERED MEMBERS
                </div>
                {sidebar.liveGames.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {sidebar.liveGames.map((g, i) => (
                            <div key={g.title} className="flex items-center gap-2 text-xs">
                                <span className="w-20 truncate" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {g.title}
                                </span>
                                <div className="h-1.5 flex-1 overflow-hidden" style={{ background: 'var(--uap-bg-hover)' }}>
                                    <div
                                        className="h-full"
                                        style={{
                                            width: `${Math.max(6, Math.round((g.player_count / maxPlayers) * 100))}%`,
                                            backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                                        }}
                                    />
                                </div>
                                <span style={{ color: 'var(--uap-text-dim)' }}>{g.player_count || '—'}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                        No library data yet.
                    </p>
                )}
            </div>

            {/* Top Players */}
            {sidebar.topPlayers.length > 0 && (
                <div className="uap-card p-4">
                    <div className="mb-2" style={widgetTitleStyle}>
                        TOP PLAYERS
                    </div>
                    <div className="flex flex-col gap-2">
                        {sidebar.topPlayers.map((p, i) => (
                            <div key={p.id} className="flex items-center gap-2">
                                <span className="w-4 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {i + 1}
                                </span>
                                <UserAvatar user={p} size={24} />
                                <span className="flex-1 truncate text-sm">{p.username}</span>
                                <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {p.total_hours} hrs
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Trending */}
            {sidebar.trending.length > 0 && (
                <div className="uap-card p-4">
                    <div className="mb-2" style={widgetTitleStyle}>
                        TRENDING NOW
                    </div>
                    <div className="flex flex-col gap-2">
                        {sidebar.trending.map((t, i) => (
                            <div key={t.title}>
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <span className="w-4 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                        {i + 1}
                                    </span>
                                    <span>#{t.title.replace(/\s+/g, '')}</span>
                                </div>
                                <div className="pl-6 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {t.review_count} review{t.review_count !== 1 ? 's' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="uap-card p-4">
                <div className="mb-2" style={widgetTitleStyle}>
                    COMMUNITY
                </div>
                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                        <span style={{ color: 'var(--uap-text-secondary)' }}>Total Posts</span>
                        <span className="font-semibold">{sidebar.stats.totalPosts}</span>
                    </div>
                    <div className="flex justify-between">
                        <span style={{ color: 'var(--uap-text-secondary)' }}>Members</span>
                        <span className="font-semibold">{sidebar.stats.totalMembers}</span>
                    </div>
                    <div className="flex justify-between">
                        <span style={{ color: 'var(--uap-text-secondary)' }}>Reviews</span>
                        <span className="font-semibold">{sidebar.stats.totalReviews}</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

function CommunityTabs({ active }: { active: 'feed' | 'reviews' | 'guides' }) {
    const tabs = [
        { key: 'feed', label: 'Feed', href: '/community' },
        { key: 'reviews', label: 'Reviews', href: '/community/reviews' },
        { key: 'guides', label: 'Guides', href: '/community/guides' },
    ];

    return (
        <div className="mb-5 flex gap-2" style={{ borderBottom: '1px solid var(--uap-border)' }}>
            {tabs.map((t) => (
                <Link
                    key={t.key}
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
        </div>
    );
}

export { CommunityTabs };
