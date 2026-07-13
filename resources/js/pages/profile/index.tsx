import SiteLayout from '@/components/site-layout';
import { type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface LibraryEntry {
    id: number;
    hours_played: number;
    game: { id: number; title: string; image?: string | null };
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

interface FriendUser {
    id: number;
    username: string;
    country: string;
    avatar: string | null;
}

interface FriendEntry {
    id: number;
    friend?: FriendUser;
    user?: FriendUser;
}

interface SearchUser {
    id: number;
    username: string;
    country: string;
    avatar: string | null;
}

type Friendship = 'accepted' | 'pending_sent' | 'pending_received' | 'none' | null;

interface ProfileIndexProps {
    user: User & { username: string; bio: string | null; country: string | null; created_at: string };
    isOwnProfile: boolean;
    friendship: Friendship;
    stats: {
        totalGames: number;
        totalHours: number;
        totalFavorites: number;
        totalAchievements: number;
        friendCount: number;
        totalReviews: number;
    };
    recentlyPlayed: LibraryEntry[];
    showcaseGames: LibraryEntry[];
    showcaseCandidates: LibraryEntry[];
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

function MiniAvatar({ user }: { user: FriendUser }) {
    return user.avatar ? (
        <img src={`/uploads/avatars/${user.id}/${user.avatar}`} alt={user.username} className="h-10 w-10 flex-shrink-0 object-cover" />
    ) : (
        <span
            style={{ background: 'var(--uap-bg-hover)' }}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-xs font-bold"
        >
            {user.username.slice(0, 2).toUpperCase()}
        </span>
    );
}

export default function ProfileIndex({
    user,
    isOwnProfile,
    friendship,
    stats,
    recentlyPlayed,
    showcaseGames,
    showcaseCandidates,
    achievements,
    allAchievements,
    friends,
    pendingRequests,
    search,
    searchResults,
}: ProfileIndexProps) {
    const [query, setQuery] = useState(search);
    const [showcasePickerOpen, setShowcasePickerOpen] = useState(false);

    const unlockedIds = achievements.map((a) => a.achievement.id);
    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/profile', { search: query || undefined }, { preserveState: true });
    };

    const sendRequest = (userId: number) => router.post(`/friends/request/${userId}`, {}, { preserveScroll: true });
    const acceptRequest = (userId: number) => router.post(`/friends/accept/${userId}`, {}, { preserveScroll: true });
    const declineRequest = (userId: number) => router.post(`/friends/decline/${userId}`, {}, { preserveScroll: true });
    const toggleShowcase = (gameId: number) =>
        router.post(`/library/favorite/${gameId}`, {}, { preserveScroll: true, onSuccess: () => setShowcasePickerOpen(false) });

    return (
        <>
            <Head title="Profile" />
            <SiteLayout>
                <div className="px-6 py-8">
                    {/* Banner */}
                    <div className={`uap-card h-72 w-full overflow-hidden ${!user.banner ? 'uap-banner-fallback' : ''}`}>
                        {user.banner && (
                            <img src={`/uploads/banners/${user.id}/${user.banner}`} alt="" className="h-full w-full object-cover" />
                        )}
                    </div>

                    {/* Avatar beside nickname, fully below the banner */}
                    <div className="mb-6 flex items-center gap-5 pt-5">
                        <div
                            className="flex h-32 w-32 flex-shrink-0 items-center justify-center text-3xl font-extrabold"
                            style={{ border: '4px solid var(--uap-accent)', background: 'var(--uap-bg-hover)', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                        >
                            {user.avatar ? (
                                <img src={`/uploads/avatars/${user.id}/${user.avatar}`} alt={user.username} className="h-full w-full object-cover" />
                            ) : (
                                user.username.slice(0, 2).toUpperCase()
                            )}
                        </div>

                        <div className="flex-1">
                            <h1 className="text-2xl font-extrabold">{user.username}</h1>
                            <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                {isOwnProfile ? `${user.email} • ` : ''}Member since {joinDate}
                            </p>
                            <div className="mt-2 flex gap-2">
                                <span className="uap-tag uap-tag-green">Online</span>
                                <span className="uap-tag">{user.country ?? 'Indonesia'}</span>
                            </div>
                        </div>

                        {!isOwnProfile && (
                            <div className="flex-shrink-0">
                                {friendship === 'accepted' && (
                                    <span className="uap-btn uap-btn-outline" style={{ cursor: 'default' }}>
                                        Friends
                                    </span>
                                )}
                                {friendship === 'pending_sent' && (
                                    <span className="uap-btn uap-btn-outline" style={{ cursor: 'default' }}>
                                        Request Sent
                                    </span>
                                )}
                                {friendship === 'pending_received' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => acceptRequest(user.id)} className="uap-btn uap-btn-green">
                                            Accept
                                        </button>
                                        <button onClick={() => declineRequest(user.id)} className="uap-btn uap-btn-outline">
                                            Decline
                                        </button>
                                    </div>
                                )}
                                {friendship === 'none' && (
                                    <button onClick={() => sendRequest(user.id)} className="uap-btn uap-btn-primary">
                                        Add Friend
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {user.bio && (
                        <p className="mb-6 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            {user.bio}
                        </p>
                    )}

                    {/* Steam-style two column layout */}
                    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                        {/* Main column */}
                        <div className="flex flex-col gap-6">
                            {/* Showcase */}
                            {(showcaseGames.length > 0 || isOwnProfile) && (
                                <div>
                                    <h2 className="uap-section-title">Showcase</h2>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                        {showcaseGames.map((entry) => (
                                            <div key={entry.id} className="uap-card uap-game-card group relative block overflow-hidden">
                                                <Link href={`/game/${entry.game.id}`} className="block">
                                                    <div className="uap-game-card-img">
                                                        {entry.game.image && (
                                                            <img src={`/uploads/games/${entry.game.id}/${entry.game.image}`} alt={entry.game.title} />
                                                        )}
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="truncate text-xs font-semibold">{entry.game.title}</p>
                                                        <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                                            {entry.hours_played} hrs
                                                        </p>
                                                    </div>
                                                </Link>
                                                {isOwnProfile && (
                                                    <button
                                                        onClick={() => toggleShowcase(entry.game.id)}
                                                        title="Remove from Showcase"
                                                        style={{ background: 'rgba(0,0,0,0.65)' }}
                                                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {isOwnProfile && showcaseGames.length < 6 && (
                                            <button
                                                onClick={() => setShowcasePickerOpen((v) => !v)}
                                                style={{ border: '1px dashed var(--uap-border)', color: 'var(--uap-text-secondary)' }}
                                                className="flex min-h-[110px] flex-col items-center justify-center gap-1 text-sm hover:bg-[var(--uap-bg-hover)]"
                                            >
                                                <span className="text-lg leading-none">+</span>
                                                <span>Add a Showcase</span>
                                            </button>
                                        )}
                                    </div>

                                    {showcasePickerOpen && (
                                        <div className="uap-card mt-3 p-4">
                                            <p className="mb-3 text-sm font-semibold" style={{ color: 'var(--uap-text-dim)' }}>
                                                Select a game from your library to showcase
                                            </p>
                                            {showcaseCandidates.length === 0 ? (
                                                <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                                    No more games available. Every owned game is already showcased or you have no other games.
                                                </p>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {showcaseCandidates.map((entry) => (
                                                        <button
                                                            key={entry.id}
                                                            onClick={() => toggleShowcase(entry.game.id)}
                                                            style={{ border: '1px solid var(--uap-border)' }}
                                                            className="flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--uap-bg-hover)]"
                                                        >
                                                            <div
                                                                className="flex h-9 w-14 flex-shrink-0 items-center justify-center overflow-hidden"
                                                                style={{ background: 'var(--uap-bg-deep)' }}
                                                            >
                                                                {entry.game.image && (
                                                                    <img
                                                                        src={`/uploads/games/${entry.game.id}/${entry.game.image}`}
                                                                        alt={entry.game.title}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                            <span className="text-sm">{entry.game.title}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Recent Activity */}
                            <div className="uap-card p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="uap-section-title mb-0">Recent Activity</h2>
                                    <span className="text-sm" style={{ color: 'var(--uap-text-dim)' }}>
                                        {stats.totalHours} hrs total
                                    </span>
                                </div>
                                {recentlyPlayed.length === 0 ? (
                                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        No games played yet.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {recentlyPlayed.map((entry) => (
                                            <Link
                                                key={entry.id}
                                                href={`/game/${entry.game.id}`}
                                                style={{ border: '1px solid var(--uap-border)' }}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--uap-bg-hover)]"
                                            >
                                                <div
                                                    className="flex h-12 w-20 flex-shrink-0 items-center justify-center overflow-hidden"
                                                    style={{ background: 'var(--uap-bg-deep)' }}
                                                >
                                                    {entry.game.image && (
                                                        <img
                                                            src={`/uploads/games/${entry.game.id}/${entry.game.image}`}
                                                            alt={entry.game.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <span className="flex-1">{entry.game.title}</span>
                                                <span className="text-sm" style={{ color: 'var(--uap-text-dim)' }}>
                                                    {entry.hours_played} hrs on record
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Achievements */}
                            <div className="uap-card p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="uap-section-title mb-0">Achievements</h2>
                                    <span className="text-sm" style={{ color: 'var(--uap-text-dim)' }}>
                                        {stats.totalAchievements} of {allAchievements.length} unlocked
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                    {allAchievements.map((ach) => {
                                        const unlocked = unlockedIds.includes(ach.id);
                                        return (
                                            <div
                                                key={ach.id}
                                                style={{ border: '1px solid var(--uap-border)', opacity: unlocked ? 1 : 0.45 }}
                                                className="p-4"
                                            >
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="font-semibold">{ach.name}</span>
                                                    <span className={`uap-tag ${RARITY_CLASS[ach.rarity]}`}>{ach.rarity}</span>
                                                </div>
                                                <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                                    {ach.description}
                                                </p>
                                                {!unlocked && (
                                                    <p className="mt-2 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                                        Not unlocked yet
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Find Friends (own profile only) */}
                            {isOwnProfile && (
                                <div className="uap-card p-6">
                                    <h2 className="uap-section-title">Find Friends</h2>
                                    <form onSubmit={submitSearch} className="mb-4 flex gap-2">
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
                                            <h3 className="mb-2 text-sm font-semibold" style={{ color: 'var(--uap-text-dim)' }}>
                                                Search Results
                                            </h3>
                                            {searchResults.length === 0 ? (
                                                <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                                    No users found.
                                                </p>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {searchResults.map((u) => (
                                                        <div
                                                            key={u.id}
                                                            style={{ border: '1px solid var(--uap-border)' }}
                                                            className="flex items-center justify-between px-4 py-2"
                                                        >
                                                            <Link href={`/profile/${u.id}`} className="flex items-center gap-2 hover:underline">
                                                                <MiniAvatar user={u} />
                                                                <span>
                                                                    {u.username}{' '}
                                                                    <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                                                        ({u.country})
                                                                    </span>
                                                                </span>
                                                            </Link>
                                                            <button onClick={() => sendRequest(u.id)} className="uap-btn uap-btn-primary uap-btn-sm">
                                                                Add Friend
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="flex flex-col gap-4">
                            <div className="uap-card p-4">
                                <div className="flex flex-col gap-2 text-sm">
                                    <Link href="/library" className="flex items-center justify-between hover:text-[var(--uap-accent)]">
                                        <span>Games</span>
                                        <span className="font-bold">{stats.totalGames}</span>
                                    </Link>
                                    <div className="flex items-center justify-between" style={{ color: 'var(--uap-text-secondary)' }}>
                                        <span>Hours Played</span>
                                        <span className="font-bold">{stats.totalHours}</span>
                                    </div>
                                    <div className="flex items-center justify-between" style={{ color: 'var(--uap-text-secondary)' }}>
                                        <span>Achievements</span>
                                        <span className="font-bold">{stats.totalAchievements}</span>
                                    </div>
                                    <Link href="/community/reviews" className="flex items-center justify-between hover:text-[var(--uap-accent)]">
                                        <span>Reviews</span>
                                        <span className="font-bold">{stats.totalReviews}</span>
                                    </Link>
                                    <div className="flex items-center justify-between" style={{ color: 'var(--uap-text-secondary)' }}>
                                        <span>Favorites</span>
                                        <span className="font-bold">{stats.totalFavorites}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Pending requests (own profile only) */}
                            {isOwnProfile && pendingRequests.length > 0 && (
                                <div className="uap-card p-4">
                                    <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--uap-text-dim)' }}>
                                        PENDING REQUESTS ({pendingRequests.length})
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {pendingRequests.map((req) => (
                                            <div key={req.id} className="flex items-center justify-between gap-2">
                                                <Link href={`/profile/${req.user!.id}`} className="flex items-center gap-2 hover:underline">
                                                    <MiniAvatar user={req.user!} />
                                                    <span className="text-sm">{req.user?.username}</span>
                                                </Link>
                                                <div className="flex gap-1">
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

                            {/* Friends list */}
                            <div className="uap-card p-4">
                                <h3 className="mb-3 text-sm font-semibold" style={{ color: 'var(--uap-text-dim)' }}>
                                    FRIENDS ({friends.length})
                                </h3>
                                {friends.length === 0 ? (
                                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        No friends yet.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {friends.map((f) => (
                                            <Link
                                                key={f.id}
                                                href={`/profile/${f.friend?.id}`}
                                                className="flex items-center gap-2 hover:bg-[var(--uap-bg-hover)]"
                                            >
                                                <MiniAvatar user={f.friend!} />
                                                <div>
                                                    <p className="text-sm font-medium">{f.friend?.username}</p>
                                                    <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                                        {f.friend?.country}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SiteLayout>
        </>
    );
}
