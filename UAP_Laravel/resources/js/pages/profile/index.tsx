import SiteLayout from '@/components/site-layout';
import { type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface LibraryEntry {
    id: number;
    hours_played: number;
    game: { id: number; title: string };
}

interface AchievementItem {
    id: number;
    name: string;
    description: string;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

interface UnlockedAchievement {
    id: number;
    unlocked_at: string;
    achievement: AchievementItem;
}

interface FriendEntry {
    id: number;
    friend?: { id: number; username: string; country: string };
    user?: { id: number; username: string; country: string };
}

interface SearchUser {
    id: number;
    username: string;
    country: string;
}

interface ProfileIndexProps {
    user: User & { username: string; bio: string | null; country: string | null; created_at: string };
    stats: {
        totalGames: number;
        totalHours: number;
        totalFavorites: number;
        totalAchievements: number;
        friendCount: number;
    };
    recentlyPlayed: LibraryEntry[];
    achievements: UnlockedAchievement[];
    allAchievements: AchievementItem[];
    friends: FriendEntry[];
    pendingRequests: FriendEntry[];
    search: string;
    searchResults: SearchUser[];
}

const RARITY_CLASS: Record<string, string> = {
    Common: 'uap-tag-green',
    Rare: 'uap-tag',
    Epic: 'uap-tag-accent',
    Legendary: 'uap-tag-warning',
};

const inputStyle = {
    background: 'var(--uap-bg-card)',
    border: '1px solid var(--uap-border)',
    color: 'var(--uap-text-primary)',
};

type Tab = 'overview' | 'achievements' | 'friends';

export default function ProfileIndex({
    user,
    stats,
    recentlyPlayed,
    achievements,
    allAchievements,
    friends,
    pendingRequests,
    search,
    searchResults,
}: ProfileIndexProps) {
    const [tab, setTab] = useState<Tab>('overview');
    const [query, setQuery] = useState(search);

    const unlockedIds = achievements.map((a) => a.achievement.id);
    const joinDate = new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/profile', { search: query || undefined }, { preserveState: true });
    };

    const sendRequest = (userId: number) => router.post(`/friends/request/${userId}`, {}, { preserveScroll: true });
    const acceptRequest = (userId: number) => router.post(`/friends/accept/${userId}`, {}, { preserveScroll: true });
    const declineRequest = (userId: number) => router.post(`/friends/decline/${userId}`, {}, { preserveScroll: true });

    return (
        <>
            <Head title="Profile" />
            <SiteLayout>
            <div className="px-6 py-8">
                {/* Header */}
                <div className="uap-card mb-6 flex items-start gap-6 p-7">
                    <div
                        className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full text-2xl font-extrabold"
                        style={{ border: '4px solid var(--uap-accent)', background: 'var(--uap-bg-hover)' }}
                    >
                        {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-extrabold">{user.username}</h1>
                        <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            {user.email} &bull; Bergabung sejak {joinDate}
                        </p>
                        <div className="mt-2 flex gap-2">
                            <span className="uap-tag uap-tag-green">Online</span>
                            <span className="uap-tag">{user.country ?? 'Indonesia'}</span>
                        </div>
                        {user.bio && (
                            <p className="mt-3 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                {user.bio}
                            </p>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-6 grid grid-cols-5 gap-4">
                    {[
                        ['Games', stats.totalGames],
                        ['Hours Played', stats.totalHours],
                        ['Achievements', stats.totalAchievements],
                        ['Favorites', stats.totalFavorites],
                        ['Friends', stats.friendCount],
                    ].map(([label, value]) => (
                        <div key={label} className="uap-card p-4 text-center">
                            <p className="text-xl font-extrabold">{value}</p>
                            <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                {label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="mb-5 flex gap-2" style={{ borderBottom: '1px solid var(--uap-border)' }}>
                    {(['overview', 'achievements', 'friends'] as Tab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                fontFamily: "'Monda', sans-serif",
                                color: tab === t ? 'var(--uap-accent)' : 'var(--uap-text-secondary)',
                                borderBottom: tab === t ? '2px solid var(--uap-accent)' : '2px solid transparent',
                            }}
                            className="px-4 py-2 text-sm font-semibold capitalize"
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {tab === 'overview' && (
                    <div className="uap-card p-6">
                        <h2 className="uap-section-title">Recently Played</h2>
                        {recentlyPlayed.length === 0 ? (
                            <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                Belum ada game yang dimainkan.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {recentlyPlayed.map((entry) => (
                                    <Link
                                        key={entry.id}
                                        href={`/game/${entry.game.id}`}
                                        style={{ border: '1px solid var(--uap-border)' }}
                                        className="flex items-center justify-between px-4 py-2"
                                    >
                                        <span>{entry.game.title}</span>
                                        <span className="text-sm" style={{ color: 'var(--uap-text-dim)' }}>
                                            {entry.hours_played} hrs
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Achievements */}
                {tab === 'achievements' && (
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                        {allAchievements.map((ach) => {
                            const unlocked = unlockedIds.includes(ach.id);
                            return (
                                <div key={ach.id} className="uap-card p-4" style={{ opacity: unlocked ? 1 : 0.5 }}>
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-semibold">{ach.name}</span>
                                        <span className={`uap-tag ${RARITY_CLASS[ach.rarity]}`}>{ach.rarity}</span>
                                    </div>
                                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        {ach.description}
                                    </p>
                                    {!unlocked && (
                                        <p className="mt-2 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                            Belum terbuka
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Friends */}
                {tab === 'friends' && (
                    <div className="flex flex-col gap-6">
                        <form onSubmit={submitSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search username..."
                                style={inputStyle}
                                className="flex-1 px-3 py-2 text-sm outline-none"
                            />
                            <button type="submit" className="uap-btn uap-btn-outline">
                                Search
                            </button>
                        </form>

                        {search && (
                            <div>
                                <h3 className="uap-section-title">Search Results</h3>
                                {searchResults.length === 0 ? (
                                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        Tidak ada user ditemukan.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {searchResults.map((u) => (
                                            <div
                                                key={u.id}
                                                style={{ border: '1px solid var(--uap-border)' }}
                                                className="flex items-center justify-between px-4 py-2"
                                            >
                                                <span>
                                                    {u.username}{' '}
                                                    <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                                        ({u.country})
                                                    </span>
                                                </span>
                                                <button onClick={() => sendRequest(u.id)} className="uap-btn uap-btn-primary uap-btn-sm">
                                                    Add Friend
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {pendingRequests.length > 0 && (
                            <div>
                                <h3 className="uap-section-title">Pending Requests</h3>
                                <div className="flex flex-col gap-2">
                                    {pendingRequests.map((req) => (
                                        <div
                                            key={req.id}
                                            style={{ border: '1px solid var(--uap-border)' }}
                                            className="flex items-center justify-between px-4 py-2"
                                        >
                                            <span>{req.user?.username}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => acceptRequest(req.user!.id)} className="uap-btn uap-btn-green uap-btn-sm">
                                                    Accept
                                                </button>
                                                <button onClick={() => declineRequest(req.user!.id)} className="uap-btn uap-btn-outline uap-btn-sm">
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="uap-section-title">Friends ({friends.length})</h3>
                            {friends.length === 0 ? (
                                <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                    Belum ada teman.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                                    {friends.map((f) => (
                                        <div key={f.id} style={{ border: '1px solid var(--uap-border)' }} className="px-4 py-2">
                                            <p className="font-medium">{f.friend?.username}</p>
                                            <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                                {f.friend?.country}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            </SiteLayout>
        </>
    );
}
