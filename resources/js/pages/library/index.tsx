import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SiteLayout from '@/components/site-layout';
import { type Game, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, FolderPlus, X } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface LibraryEntry {
    id: number;
    game_id: number;
    hours_played: number;
    last_played_at: string | null;
    is_installed: boolean;
    is_favorite: boolean;
    game: Game;
}

interface CollectionRow {
    id: number;
    name: string;
    library_entries_count: number;
}

interface LibraryStats {
    totalGames: number;
    totalHours: number;
    totalFavorites: number;
    totalInstalled: number;
}

interface LibraryIndexProps {
    tab: string;
    collectionId: number | null;
    search: string;
    entries: LibraryEntry[];
    entryCollectionIds: Record<number, number[]>;
    collections: CollectionRow[];
    recentlyPlayed: LibraryEntry[];
    stats: LibraryStats;
}

const TABS = [
    { key: 'all', label: 'All Games' },
    { key: 'installed', label: 'Installed' },
    { key: 'not-installed', label: 'Not Installed' },
    { key: 'favorites', label: 'Favorites' },
];

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

function LibraryGameCard({
    entry,
    collections,
    inCollectionIds,
    subtitle,
    onToggleFavorite,
    onToggleInstalled,
    onPlay,
    onToggleCollection,
}: {
    entry: LibraryEntry;
    collections: CollectionRow[];
    inCollectionIds: number[];
    subtitle?: string;
    onToggleFavorite: (gameId: number) => void;
    onToggleInstalled: (gameId: number) => void;
    onPlay: (gameId: number) => void;
    onToggleCollection: (collectionId: number, gameId: number) => void;
}) {
    return (
        <div className="uap-card group relative">
            <Link href={`/game/${entry.game_id}`} className="block aspect-video" style={{ background: 'var(--uap-bg-deep)' }}>
                {entry.game.image && (
                    <img
                        src={`/uploads/games/${entry.game_id}/${entry.game.image}`}
                        alt={entry.game.title}
                        className="h-full w-full object-cover"
                    />
                )}
            </Link>

            <div className="absolute top-2 right-2 flex gap-1">
                {collections.length > 0 && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                style={{ background: 'rgba(0,0,0,0.6)', color: 'var(--uap-text-dim)' }}
                                className="flex h-7 w-7 items-center justify-center"
                                title="Add to collection"
                            >
                                <FolderPlus size={13} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {collections.map((c) => (
                                <DropdownMenuItem
                                    key={c.id}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        onToggleCollection(c.id, entry.game_id);
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="flex h-4 w-4 items-center justify-center">
                                        {inCollectionIds.includes(c.id) && <Check size={13} />}
                                    </span>
                                    {c.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                <button
                    onClick={() => onToggleFavorite(entry.game_id)}
                    style={{
                        background: 'rgba(0,0,0,0.6)',
                        color: entry.is_favorite ? 'var(--uap-accent-gold)' : 'var(--uap-text-dim)',
                    }}
                    className="flex h-7 w-7 items-center justify-center text-sm"
                    title={entry.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                >
                    {entry.is_favorite ? '★' : '☆'}
                </button>
            </div>

            <div className="p-2">
                <Link href={`/game/${entry.game_id}`} className="uap-game-card-title block hover:underline">
                    {entry.game.title}
                </Link>
                <div className="mt-1 flex items-center justify-between text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                    <span>{subtitle ?? entry.game.genre}</span>
                    {!subtitle && entry.hours_played > 0 && <span>{entry.hours_played}h</span>}
                </div>

                <div className="mt-2 flex gap-1.5">
                    <button
                        onClick={() => onToggleInstalled(entry.game_id)}
                        className={`uap-btn uap-btn-sm flex-1 ${entry.is_installed ? 'uap-btn-outline' : 'uap-btn-primary'}`}
                    >
                        {entry.is_installed ? 'Uninstall' : 'Install'}
                    </button>
                    <button
                        onClick={() => onPlay(entry.game_id)}
                        disabled={!entry.is_installed}
                        title={entry.is_installed ? 'Log a play session' : 'Install first to play'}
                        className="uap-btn uap-btn-outline uap-btn-sm flex-1 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Play
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LibraryIndex({
    tab,
    collectionId,
    search,
    entries,
    entryCollectionIds,
    collections,
    recentlyPlayed,
    stats,
}: LibraryIndexProps) {
    const { flash } = usePage<SharedData>().props;
    const [query, setQuery] = useState(search);
    const [newCollectionName, setNewCollectionName] = useState('');

    const goToTab = (key: string, cId?: number) => {
        router.get('/library', { tab: key, collection: cId, q: query || undefined });
    };

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/library', { tab, collection: collectionId ?? undefined, q: query || undefined });
    };

    const toggleFavorite = (gameId: number) => {
        router.post(`/library/favorite/${gameId}`, { tab, collection: collectionId ?? undefined, q: query || undefined }, { preserveScroll: true });
    };

    const toggleInstalled = (gameId: number) => {
        router.post(`/library/install/${gameId}`, { tab, collection: collectionId ?? undefined, q: query || undefined }, { preserveScroll: true });
    };

    const playGame = (gameId: number) => {
        router.post(`/library/play/${gameId}`, { tab, collection: collectionId ?? undefined, q: query || undefined }, { preserveScroll: true });
    };

    const toggleGameInCollection = (collectionIdToToggle: number, gameId: number) => {
        router.post(
            `/collections/${collectionIdToToggle}/games/${gameId}`,
            { tab, collection: collectionId ?? undefined, q: query || undefined },
            { preserveScroll: true },
        );
    };

    const submitNewCollection: FormEventHandler = (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;
        router.post('/collections', { name: newCollectionName }, { onSuccess: () => setNewCollectionName('') });
    };

    const deleteCollection = (collection: CollectionRow) => {
        if (confirm(`Delete collection "${collection.name}"? Games inside it stay in your library.`)) {
            router.post(`/collections/${collection.id}/delete`, {}, { onSuccess: () => (tab === 'collection' && collectionId === collection.id ? goToTab('all') : undefined) });
        }
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

                {flash?.status && (
                    <div className="mb-4 p-3 text-sm" style={{ background: 'rgba(46, 160, 67, 0.1)', border: '1px solid var(--uap-accent-green)' }}>
                        {flash.status}
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-3 flex flex-wrap items-center gap-2" style={{ borderBottom: '1px solid var(--uap-border)' }}>
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

                    <span style={{ color: 'var(--uap-border)' }}>|</span>

                    {collections.map((c) => (
                        <div
                            key={c.id}
                            className="group flex items-center gap-1 px-3 py-2"
                            style={{
                                borderBottom: tab === 'collection' && collectionId === c.id ? '2px solid var(--uap-accent)' : '2px solid transparent',
                            }}
                        >
                            <button
                                onClick={() => goToTab('collection', c.id)}
                                style={{
                                    fontFamily: "'Monda', sans-serif",
                                    color: tab === 'collection' && collectionId === c.id ? 'var(--uap-accent)' : 'var(--uap-text-secondary)',
                                }}
                                className="text-sm font-semibold"
                            >
                                {c.name} <span style={{ color: 'var(--uap-text-dim)' }}>({c.library_entries_count})</span>
                            </button>
                            <button
                                onClick={() => deleteCollection(c)}
                                className="opacity-0 group-hover:opacity-100"
                                style={{ color: 'var(--uap-text-dim)' }}
                                title="Delete collection"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* New collection */}
                <form onSubmit={submitNewCollection} className="mb-6 flex items-center gap-2">
                    <FolderPlus size={15} style={{ color: 'var(--uap-text-dim)' }} />
                    <input
                        type="text"
                        value={newCollectionName}
                        onChange={(e) => setNewCollectionName(e.target.value)}
                        placeholder="New collection name (e.g. Backlog, Currently Playing)"
                        maxLength={60}
                        style={{
                            background: 'var(--uap-bg-card)',
                            border: '1px solid var(--uap-border)',
                            color: 'var(--uap-text-primary)',
                        }}
                        className="w-72 px-3 py-1.5 text-xs outline-none"
                    />
                    <button type="submit" disabled={!newCollectionName.trim()} className="uap-btn uap-btn-outline uap-btn-sm">
                        Create
                    </button>
                </form>

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
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                            {recentlyPlayed.map((entry) => (
                                <LibraryGameCard
                                    key={entry.id}
                                    entry={entry}
                                    collections={collections}
                                    inCollectionIds={entryCollectionIds[entry.game_id] ?? []}
                                    subtitle={entry.last_played_at ? `Played ${timeAgo(entry.last_played_at)}` : undefined}
                                    onToggleFavorite={toggleFavorite}
                                    onToggleInstalled={toggleInstalled}
                                    onPlay={playGame}
                                    onToggleCollection={toggleGameInCollection}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Game Grid */}
                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="uap-section-title" style={{ marginBottom: 0 }}>
                            {tab === 'favorites'
                                ? 'Favorites'
                                : tab === 'installed'
                                  ? 'Installed'
                                  : tab === 'not-installed'
                                    ? 'Not Installed'
                                    : tab === 'collection'
                                      ? (collections.find((c) => c.id === collectionId)?.name ?? 'Collection')
                                      : 'All Games'}
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
                            ) : tab === 'collection' ? (
                                'No games in this collection yet. Use the folder icon on a game to add it.'
                            ) : (
                                <>
                                    Library is empty.{' '}
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
                                <LibraryGameCard
                                    key={entry.id}
                                    entry={entry}
                                    collections={collections}
                                    inCollectionIds={entryCollectionIds[entry.game_id] ?? []}
                                    onToggleFavorite={toggleFavorite}
                                    onToggleInstalled={toggleInstalled}
                                    onPlay={playGame}
                                    onToggleCollection={toggleGameInCollection}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
            </SiteLayout>
        </>
    );
}
