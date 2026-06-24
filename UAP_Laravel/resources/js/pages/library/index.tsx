import SiteLayout from '@/components/site-layout';
import { type Game } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface LibraryEntry {
    id: number;
    game_id: number;
    hours_played: number;
    is_installed: boolean;
    is_favorite: boolean;
    game: Game;
}

interface LibraryStats {
    totalGames: number;
    totalHours: number;
    totalFavorites: number;
    totalInstalled: number;
}

interface LibraryIndexProps {
    tab: string;
    search: string;
    entries: LibraryEntry[];
    recentlyPlayed: LibraryEntry[];
    stats: LibraryStats;
}

const TABS = [
    { key: 'all', label: 'All Games' },
    { key: 'installed', label: 'Installed' },
    { key: 'not-installed', label: 'Not Installed' },
    { key: 'favorites', label: 'Favorites' },
];

export default function LibraryIndex({ tab, search, entries, recentlyPlayed, stats }: LibraryIndexProps) {
    const [query, setQuery] = useState(search);

    const goToTab = (key: string) => {
        router.get('/library', { tab: key, q: query || undefined });
    };

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/library', { tab, q: query || undefined });
    };

    const toggleFavorite = (gameId: number) => {
        router.post(`/library/favorite/${gameId}`, { tab, q: query || undefined });
    };

    return (
        <>
            <Head title="Library" />
            <SiteLayout section="library">
            <div className="px-6 py-8">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold">My Library</h1>
                        <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            {stats.totalGames} game{stats.totalGames !== 1 ? 's' : ''} · {stats.totalHours.toLocaleString('id-ID')} hours logged
                            across all titles
                        </p>
                    </div>
                    <div className="flex gap-6">
                        {[
                            ['Games', stats.totalGames],
                            ['Hours', stats.totalHours],
                            ['Favorites', stats.totalFavorites],
                            ['Installed', stats.totalInstalled],
                        ].map(([label, value]) => (
                            <div key={label} className="text-center">
                                <div className="text-xl font-extrabold">{value}</div>
                                <div className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-4 flex gap-2" style={{ borderBottom: '1px solid var(--uap-border)' }}>
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => goToTab(t.key)}
                            style={{
                                fontFamily: "'Monda', sans-serif",
                                color: tab === t.key ? 'var(--uap-accent)' : 'var(--uap-text-secondary)',
                                borderBottom: tab === t.key ? '2px solid var(--uap-accent)' : '2px solid transparent',
                            }}
                            className="px-4 py-2 text-sm font-semibold"
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <form onSubmit={submitSearch} className="mb-6">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search your library..."
                        style={{
                            background: 'var(--uap-bg-card)',
                            border: '1px solid var(--uap-border)',
                            color: 'var(--uap-text-primary)',
                        }}
                        className="w-full max-w-sm px-3 py-2 text-sm outline-none"
                    />
                </form>

                {/* Recently Played */}
                {tab === 'all' && !search && recentlyPlayed.length > 0 && (
                    <section className="mb-8">
                        <h2 className="uap-section-title">Recently Played</h2>
                        <div className="flex gap-3 overflow-x-auto">
                            {recentlyPlayed.map((entry) => (
                                <Link key={entry.id} href={`/game/${entry.game_id}`} className="uap-card flex w-56 flex-shrink-0 items-center gap-3 p-3">
                                    <div
                                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center text-sm font-bold"
                                        style={{ background: 'var(--uap-bg-hover)', color: 'var(--uap-text-primary)' }}
                                    >
                                        {entry.game.title.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="truncate text-sm font-medium">{entry.game.title}</p>
                                        <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                            {entry.hours_played} hrs played
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Game Grid */}
                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="uap-section-title" style={{ marginBottom: 0 }}>
                            {tab === 'favorites' ? 'Favorites' : tab === 'installed' ? 'Installed' : tab === 'not-installed' ? 'Not Installed' : 'All Games'}
                        </h2>
                        <span className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                            {entries.length} title{entries.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {entries.length === 0 ? (
                        <div className="uap-card p-12 text-center text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            {search ? (
                                `No results for "${search}".`
                            ) : tab === 'favorites' ? (
                                'No favorites yet. Click the star on any game.'
                            ) : (
                                <>
                                    Library kosong.{' '}
                                    <Link href="/store" style={{ color: 'var(--uap-accent)' }} className="hover:underline">
                                        Browse the Store
                                    </Link>
                                    .
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {entries.map((entry) => (
                                <div key={entry.id} className="uap-card group relative">
                                    <Link href={`/game/${entry.game_id}`} className="block aspect-video" style={{ background: 'var(--uap-bg-deep)' }}>
                                        {entry.game.image && (
                                            <img
                                                src={`/uploads/games/${entry.game_id}/${entry.game.image}`}
                                                alt={entry.game.title}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </Link>
                                    <div className="p-2">
                                        <Link href={`/game/${entry.game_id}`} className="uap-game-card-title block hover:underline">
                                            {entry.game.title}
                                        </Link>
                                        <div className="mt-1 flex items-center justify-between text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                            <span>{entry.game.genre}</span>
                                            {entry.hours_played > 0 && <span>{entry.hours_played}h</span>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(entry.game_id)}
                                        style={{ background: 'rgba(0,0,0,0.6)', color: entry.is_favorite ? 'var(--uap-accent-gold)' : 'var(--uap-text-dim)' }}
                                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center text-sm"
                                        title={entry.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                    >
                                        {entry.is_favorite ? '★' : '☆'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
            </SiteLayout>
        </>
    );
}
