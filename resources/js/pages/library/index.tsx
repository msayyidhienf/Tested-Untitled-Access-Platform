import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SiteLayout from '@/components/site-layout';
import { type Game, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, FolderPlus, Star, X } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

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

function formatPrice(value: string | number) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

function timeAgo(value: string) {
    const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
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
    const [selectedId, setSelectedId] = useState<number | null>(entries[0]?.game_id ?? null);

    // Keep the selection valid whenever the list changes (tab switch, search, etc).
    useEffect(() => {
        if (!entries.some((e) => e.game_id === selectedId)) {
            setSelectedId(entries[0]?.game_id ?? null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entries]);

    const selected = entries.find((e) => e.game_id === selectedId) ?? null;

    const goToTab = (key: string, cId?: number) => {
        router.get('/library', { tab: key, collection: cId, q: query || undefined });
    };

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        router.get('/library', { tab, collection: collectionId ?? undefined, q: query || undefined });
    };

    const withCurrentFilters = () => ({ tab, collection: collectionId ?? undefined, q: query || undefined });

    const toggleFavorite = (gameId: number) => {
        router.post(`/library/favorite/${gameId}`, withCurrentFilters(), { preserveScroll: true });
    };

    const toggleInstalled = (gameId: number) => {
        router.post(`/library/install/${gameId}`, withCurrentFilters(), { preserveScroll: true });
    };

    const playGame = (gameId: number) => {
        router.post(`/library/play/${gameId}`, withCurrentFilters(), { preserveScroll: true });
    };

    const toggleGameInCollection = (collectionIdToToggle: number, gameId: number) => {
        router.post(`/collections/${collectionIdToToggle}/games/${gameId}`, withCurrentFilters(), { preserveScroll: true });
    };

    const submitNewCollection: FormEventHandler = (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;
        router.post('/collections', { name: newCollectionName }, { onSuccess: () => setNewCollectionName('') });
    };

    const deleteCollection = (collection: CollectionRow) => {
        if (confirm(`Delete collection "${collection.name}"? Games inside it stay in your library.`)) {
            router.post(`/collections/${collection.id}/delete`, {}, {
                onSuccess: () => (tab === 'collection' && collectionId === collection.id ? goToTab('all') : undefined),
            });
        }
    };

    return (
        <>
            <Head title="Library" />
            <SiteLayout section="library">
            <div className="flex h-[calc(100vh-var(--uap-topbar-h))] flex-col px-6 py-6">
                {/* Header */}
                <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold">My Library</h1>
                        <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            {stats.totalGames} game{stats.totalGames !== 1 ? 's' : ''} · {stats.totalHours.toLocaleString('id-ID')} hours logged
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
                    <div className="mb-3 p-3 text-sm" style={{ background: 'rgba(46, 160, 67, 0.1)', border: '1px solid var(--uap-accent-green)' }}>
                        {flash.status}
                    </div>
                )}

                {/* Two-pane Steam-style layout */}
                <div className="flex min-h-0 flex-1 gap-4">
                    {/* Left: game list */}
                    <aside className="uap-library-sidebar">
                        <form onSubmit={submitSearch} className="p-3">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search your library..."
                                style={{
                                    background: 'var(--uap-bg-deep)',
                                    border: '1px solid var(--uap-border)',
                                    color: 'var(--uap-text-primary)',
                                }}
                                className="w-full px-3 py-1.5 text-xs outline-none"
                            />
                        </form>

                        <div className="flex flex-wrap gap-1 px-3 pb-2">
                            {TABS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => goToTab(t.key)}
                                    className={`uap-tag ${tab === t.key ? 'uap-tag-accent' : ''}`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {collections.length > 0 && (
                            <div className="flex flex-wrap gap-1 px-3 pb-2">
                                {collections.map((c) => (
                                    <div key={c.id} className="group flex items-center">
                                        <button
                                            onClick={() => goToTab('collection', c.id)}
                                            className={`uap-tag ${tab === 'collection' && collectionId === c.id ? 'uap-tag-accent' : ''}`}
                                        >
                                            {c.name} ({c.library_entries_count})
                                        </button>
                                        <button
                                            onClick={() => deleteCollection(c)}
                                            className="hidden group-hover:block"
                                            style={{ color: 'var(--uap-text-dim)', marginLeft: '-4px' }}
                                            title="Delete collection"
                                        >
                                            <X size={11} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={submitNewCollection} className="flex items-center gap-1 px-3 pb-3">
                            <FolderPlus size={13} style={{ color: 'var(--uap-text-dim)', flexShrink: 0 }} />
                            <input
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="New collection..."
                                maxLength={60}
                                style={{
                                    background: 'var(--uap-bg-deep)',
                                    border: '1px solid var(--uap-border)',
                                    color: 'var(--uap-text-primary)',
                                }}
                                className="w-full min-w-0 px-2 py-1 text-[11px] outline-none"
                            />
                        </form>

                        <div style={{ borderTop: '1px solid var(--uap-border)' }} className="flex-1 overflow-y-auto">
                            {entries.length === 0 ? (
                                <p className="p-4 text-center text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {search ? `No results for "${search}".` : 'No games here yet.'}
                                </p>
                            ) : (
                                entries.map((entry) => (
                                    <button
                                        key={entry.id}
                                        onClick={() => setSelectedId(entry.game_id)}
                                        className="uap-library-row"
                                        style={{
                                            background: selectedId === entry.game_id ? 'rgba(184, 50, 50, 0.12)' : 'transparent',
                                            color: selectedId === entry.game_id ? 'var(--uap-text-primary)' : 'var(--uap-text-secondary)',
                                            borderLeft: selectedId === entry.game_id ? '3px solid var(--uap-accent)' : '3px solid transparent',
                                        }}
                                    >
                                        <span className="uap-library-row-icon">
                                            {entry.game.image ? (
                                                <img src={`/uploads/games/${entry.game_id}/${entry.game.image}`} alt="" />
                                            ) : (
                                                entry.game.title.slice(0, 2).toUpperCase()
                                            )}
                                        </span>
                                        <span className="min-w-0 flex-1 truncate text-left text-[13px] font-medium">{entry.game.title}</span>
                                        {entry.is_installed && (
                                            <span
                                                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                style={{ background: 'var(--uap-accent-green)' }}
                                                title="Installed"
                                            />
                                        )}
                                        {entry.is_favorite && <Star size={11} style={{ color: 'var(--uap-accent-gold)', flexShrink: 0 }} />}
                                    </button>
                                ))
                            )}
                        </div>
                    </aside>

                    {/* Right: selected game detail */}
                    <main className="uap-library-detail">
                        {!selected ? (
                            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                                <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {stats.totalGames === 0 ? 'Your library is empty.' : 'Select a game from the list.'}
                                </p>
                                {stats.totalGames === 0 && (
                                    <Link href="/store" className="uap-btn uap-btn-primary uap-btn-sm">
                                        Browse the Store
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="uap-library-banner">
                                    {selected.game.image && (
                                        <img src={`/uploads/games/${selected.game_id}/${selected.game.image}`} alt="" />
                                    )}
                                    <div className="uap-library-banner-overlay" />
                                    <h2 className="uap-library-banner-title">{selected.game.title}</h2>
                                </div>

                                <div className="uap-library-actionbar">
                                    <button
                                        onClick={() => (selected.is_installed ? playGame(selected.game_id) : toggleInstalled(selected.game_id))}
                                        className="uap-btn uap-btn-primary"
                                    >
                                        {selected.is_installed ? '▶ Play' : 'Install'}
                                    </button>

                                    {selected.is_installed && (
                                        <button onClick={() => toggleInstalled(selected.game_id)} className="uap-btn uap-btn-outline uap-btn-sm">
                                            Uninstall
                                        </button>
                                    )}

                                    <div className="uap-library-stat">
                                        <span className="uap-library-stat-label">Last Played</span>
                                        <span>{selected.last_played_at ? timeAgo(selected.last_played_at) : 'Never'}</span>
                                    </div>
                                    <div className="uap-library-stat">
                                        <span className="uap-library-stat-label">Play Time</span>
                                        <span>{selected.hours_played} hours</span>
                                    </div>

                                    <div className="ml-auto flex items-center gap-1.5">
                                        {collections.length > 0 && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="uap-btn uap-btn-outline uap-btn-sm" title="Add to collection">
                                                        <FolderPlus size={13} />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {collections.map((c) => (
                                                        <DropdownMenuItem
                                                            key={c.id}
                                                            onSelect={(e) => {
                                                                e.preventDefault();
                                                                toggleGameInCollection(c.id, selected.game_id);
                                                            }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span className="flex h-4 w-4 items-center justify-center">
                                                                {(entryCollectionIds[selected.game_id] ?? []).includes(c.id) && <Check size={13} />}
                                                            </span>
                                                            {c.name}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                        <button
                                            onClick={() => toggleFavorite(selected.game_id)}
                                            className="uap-btn uap-btn-outline uap-btn-sm"
                                            style={{ color: selected.is_favorite ? 'var(--uap-accent-gold)' : undefined }}
                                            title={selected.is_favorite ? 'Remove from Favorites' : 'Add to Favorites'}
                                        >
                                            {selected.is_favorite ? '★' : '☆'}
                                        </button>
                                        <Link href={`/game/${selected.game_id}`} className="uap-btn uap-btn-outline uap-btn-sm">
                                            Store Page
                                        </Link>
                                    </div>
                                </div>

                                <div className="uap-library-body">
                                    <div className="mb-3 flex flex-wrap gap-2">
                                        {selected.game.genre && <span className="uap-tag">{selected.game.genre}</span>}
                                        {selected.game.developer && <span className="uap-tag">{selected.game.developer}</span>}
                                        {!selected.game.is_free && (
                                            <span className="uap-tag uap-tag-green">{formatPrice(selected.game.price)}</span>
                                        )}
                                    </div>

                                    {selected.game.description && (
                                        <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                            {selected.game.description}
                                        </p>
                                    )}

                                    {tab === 'all' && !search && recentlyPlayed.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="mb-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--uap-text-dim)' }}>
                                                Recently Played
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {recentlyPlayed
                                                    .filter((e) => e.game_id !== selected.game_id)
                                                    .map((e) => (
                                                        <button
                                                            key={e.id}
                                                            onClick={() => setSelectedId(e.game_id)}
                                                            className="uap-tag"
                                                        >
                                                            {e.game.title} · {e.last_played_at && timeAgo(e.last_played_at)}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </main>
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
