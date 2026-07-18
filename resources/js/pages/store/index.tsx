import SiteLayout from '@/components/site-layout';
import { type Game, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Check, Plus } from 'lucide-react';
import { useEffect, useState, type MouseEvent } from 'react';

interface StoreIndexProps {
    mode: 'default' | 'filtered';
    filterTitle?: string;
    games?: Game[];
    heroGames?: Game[];
    featuredGames?: Game[];
    newReleases?: Game[];
    onSaleGames?: Game[];
    freeGames?: Game[];
    ownedGameIds: number[];
    cartGameIds: number[];
}

function formatPrice(price: string | number) {
    return `Rp ${Number(price).toLocaleString('id-ID')}`;
}

const GENRE_ACCENTS: Record<string, string> = {
    Action: 'radial-gradient(ellipse 90% 120% at 75% 50%, rgba(220,70,40,0.55) 0%, transparent 60%), linear-gradient(100deg, #0e0e11 0%, rgba(160,40,25,0.90) 45%, #0e0e11 100%)',
    RPG: 'radial-gradient(ellipse 90% 120% at 75% 50%, rgba(130,70,230,0.55) 0%, transparent 60%), linear-gradient(100deg, #0e0e11 0%, rgba(70,25,140,0.90) 45%, #0e0e11 100%)',
    Strategy: 'radial-gradient(ellipse 90% 120% at 75% 50%, rgba(40,180,140,0.55) 0%, transparent 60%), linear-gradient(100deg, #0e0e11 0%, rgba(15,90,75,0.90) 45%, #0e0e11 100%)',
    Simulation: 'radial-gradient(ellipse 90% 120% at 75% 50%, rgba(55,180,80,0.55) 0%, transparent 60%), linear-gradient(100deg, #0e0e11 0%, rgba(15,90,30,0.90) 45%, #0e0e11 100%)',
    Indie: 'radial-gradient(ellipse 90% 120% at 75% 50%, rgba(220,155,30,0.55) 0%, transparent 60%), linear-gradient(100deg, #0e0e11 0%, rgba(130,80,10,0.90) 45%, #0e0e11 100%)',
    Multiplayer: 'radial-gradient(ellipse 90% 120% at 75% 50%, rgba(45,120,220,0.55) 0%, transparent 60%), linear-gradient(100deg, #0e0e11 0%, rgba(15,60,140,0.90) 45%, #0e0e11 100%)',
};
const DEFAULT_ACCENT =
    'radial-gradient(ellipse 90% 120% at 75% 50%, rgba(220,70,50,0.55) 0%, transparent 60%), linear-gradient(100deg, #0e0e11 0%, rgba(184,50,50,0.90) 45%, #0e0e11 100%)';

function Hero({ games }: { games: Game[] }) {
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (games.length <= 1) return;
        const timer = setInterval(() => setActive((i) => (i + 1) % games.length), 5000);
        return () => clearInterval(timer);
    }, [games.length]);

    if (games.length === 0) return null;

    const activeGame = games[active];
    const activeEyebrow =
        active === 0 ? 'Featured Game' : activeGame.discount > 0 ? `Special Offer — -${activeGame.discount}% OFF` : 'Recommended';

    return (
        <div className="mb-12">
            <span className="uap-hero-eyebrow-above">{activeEyebrow}</span>
            <div className="uap-hero">
                {games.map((game, i) => {
                    const discountedPrice = game.discount > 0 ? Number(game.price) * (1 - game.discount / 100) : Number(game.price);

                    return (
                        <div key={game.id} className={`uap-hero-slide ${i === active ? 'active' : ''}`}>
                            {game.image ? (
                                <>
                                    <div
                                        className="uap-hero-slide-bg uap-hero-slide-bg-blur"
                                        style={{ backgroundImage: `url('/uploads/games/${game.id}/${game.image}')` }}
                                    />
                                    <div className="uap-hero-slide-art">
                                        <div
                                            className="uap-hero-slide-bg uap-hero-slide-bg-fit"
                                            style={{ backgroundImage: `url('/uploads/games/${game.id}/${game.image}')` }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="uap-hero-slide-bg" style={{ background: GENRE_ACCENTS[game.genre ?? ''] ?? DEFAULT_ACCENT }} />
                            )}
                            <div className="uap-hero-slide-overlay" />
                            <div className="uap-hero-content">
                                <h1 className="uap-hero-title">{game.title}</h1>
                                <p className="uap-hero-desc">
                                    {(game.description ?? 'Discover this amazing game on UAP.').slice(0, 130)}
                                    {(game.description?.length ?? 0) > 130 ? '...' : ''}
                                </p>
                                <div className="uap-hero-meta">
                                    <span className="uap-hero-genre-tag">{game.genre}</span>
                                    {game.discount > 0 && <span className="uap-hero-discount-tag">-{game.discount}% OFF</span>}
                                </div>
                                <div className="uap-hero-actions">
                                    {game.is_free ? (
                                        <>
                                            <Link href={`/game/${game.id}`} className="uap-btn uap-btn-primary">
                                                Play Free
                                            </Link>
                                            <span className="uap-hero-price" style={{ color: 'var(--uap-accent-green)' }}>
                                                FREE TO PLAY
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={`/game/${game.id}`} className="uap-btn uap-btn-primary">
                                                View Game
                                            </Link>
                                            <div className="uap-hero-price-block">
                                                {game.discount > 0 && <span className="uap-hero-price-was">{formatPrice(game.price)}</span>}
                                                <span className="uap-hero-price">{formatPrice(discountedPrice)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {games.length > 1 && (
                    <div className="uap-hero-nav">
                        {games.map((game, i) => (
                            <button key={game.id} onClick={() => setActive(i)} className={`uap-hero-dot ${i === active ? 'active' : ''}`} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function GameCard({ game, owned, inCart, isAuthed }: { game: Game; owned: boolean; inCart: boolean; isAuthed: boolean }) {
    const discounted = game.discount > 0 ? Number(game.price) * (1 - game.discount / 100) : null;
    const [adding, setAdding] = useState(false);

    const quickAdd = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (owned || inCart || adding) return;
        setAdding(true);
        router.post(`/cart/add/${game.id}`, {}, { preserveScroll: true, onFinish: () => setAdding(false) });
    };

    return (
        <Link href={`/game/${game.id}`} className="uap-card uap-game-card group relative block p-3">
            <div className="uap-game-card-img mb-2">{game.image && <img src={`/uploads/games/${game.id}/${game.image}`} alt={game.title} />}</div>

            {isAuthed && (
                <button
                    onClick={quickAdd}
                    title={owned ? 'Already in your library' : inCart ? 'Already in cart' : 'Add to cart'}
                    className="absolute top-5 right-5 flex h-7 w-7 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                    style={{
                        background: 'rgba(0,0,0,0.7)',
                        color: owned ? 'var(--uap-accent-green)' : inCart ? 'var(--uap-accent)' : 'var(--uap-text-primary)',
                        opacity: owned || inCart ? 1 : undefined,
                    }}
                >
                    {owned || inCart ? <Check size={14} /> : <Plus size={14} />}
                </button>
            )}

            <p className="uap-game-card-title">{game.title}</p>
            <p className="uap-game-card-genre mb-2">{game.genre}</p>
            <div className="flex items-center justify-between">
                {game.discount > 0 && <span className="uap-price-discount">-{game.discount}%</span>}
                {game.is_free ? (
                    <span className="uap-price-free">Free</span>
                ) : discounted ? (
                    <span className="uap-price-tag">{formatPrice(String(discounted))}</span>
                ) : (
                    <span className="uap-price-tag">{formatPrice(game.price)}</span>
                )}
            </div>
        </Link>
    );
}

function GameSection({ title, games, ownedGameIds, cartGameIds, isAuthed }: { title: string; games: Game[]; ownedGameIds: number[]; cartGameIds: number[]; isAuthed: boolean }) {
    if (games.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="uap-section-title">{title}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {games.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        owned={ownedGameIds.includes(game.id)}
                        inCart={cartGameIds.includes(game.id)}
                        isAuthed={isAuthed}
                    />
                ))}
            </div>
        </section>
    );
}

export default function StoreIndex({
    mode,
    filterTitle,
    games,
    heroGames,
    featuredGames,
    newReleases,
    onSaleGames,
    freeGames,
    ownedGameIds,
    cartGameIds,
}: StoreIndexProps) {
    const { auth } = usePage<SharedData>().props;
    const isAuthed = !!auth.user;
    const heroSlides = heroGames && heroGames.length > 0 ? heroGames : (featuredGames ?? []).slice(0, 3);

    return (
        <>
            <Head title={mode === 'filtered' ? filterTitle ?? 'Store' : 'Store'} />
            <SiteLayout section="store">
                {mode === 'default' && (
                    <div className="px-6 pt-6">
                        <Hero games={heroSlides} />
                    </div>
                )}
                <div className="px-6 py-8">
                    {mode === 'filtered' ? (
                        (games ?? []).length === 0 ? (
                            <div className="uap-card p-16 text-center" style={{ color: 'var(--uap-text-secondary)' }}>
                                No games found{filterTitle ? ` in ${filterTitle}` : ''}.
                            </div>
                        ) : (
                            <GameSection
                                title={filterTitle ?? 'Games'}
                                games={games ?? []}
                                ownedGameIds={ownedGameIds}
                                cartGameIds={cartGameIds}
                                isAuthed={isAuthed}
                            />
                        )
                    ) : (
                        <>
                            <GameSection
                                title="Featured & Recommended"
                                games={featuredGames ?? []}
                                ownedGameIds={ownedGameIds}
                                cartGameIds={cartGameIds}
                                isAuthed={isAuthed}
                            />
                            <GameSection
                                title="New Releases"
                                games={newReleases ?? []}
                                ownedGameIds={ownedGameIds}
                                cartGameIds={cartGameIds}
                                isAuthed={isAuthed}
                            />
                            <GameSection
                                title="Weekend Specials"
                                games={onSaleGames ?? []}
                                ownedGameIds={ownedGameIds}
                                cartGameIds={cartGameIds}
                                isAuthed={isAuthed}
                            />
                            <GameSection
                                title="Free to Play"
                                games={freeGames ?? []}
                                ownedGameIds={ownedGameIds}
                                cartGameIds={cartGameIds}
                                isAuthed={isAuthed}
                            />
                        </>
                    )}
                </div>
            </SiteLayout>
        </>
    );
}
