import SiteLayout from '@/components/site-layout';
import { type Game, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface GameImage {
    id: number;
    filename: string;
}

interface Review {
    id: number;
    rating: number;
    content: string;
    user: { username: string };
}

interface GameShowProps {
    game: Game & {
        release_date: string | null;
        developer: string | null;
        publisher: string | null;
        req_os: string | null;
        req_processor: string | null;
        req_memory: string | null;
        req_graphics: string | null;
        req_storage: string | null;
    };
    images: GameImage[];
    reviews: Review[];
    inCart: boolean;
    inLibrary: boolean;
}

function formatPrice(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

function reviewSentiment(avgRating: number, count: number): { label: string; color: string } {
    if (count === 0) return { label: 'No Reviews Yet', color: 'var(--uap-text-dim)' };
    if (avgRating >= 4.5) return { label: 'Overwhelmingly Positive', color: 'var(--uap-accent-green)' };
    if (avgRating >= 4.0) return { label: 'Very Positive', color: 'var(--uap-accent-green)' };
    if (avgRating >= 3.5) return { label: 'Mostly Positive', color: 'var(--uap-accent-green)' };
    if (avgRating >= 3.0) return { label: 'Mixed', color: 'var(--uap-accent-gold)' };
    if (avgRating >= 2.0) return { label: 'Mostly Negative', color: 'var(--uap-accent-red)' };
    return { label: 'Overwhelmingly Negative', color: 'var(--uap-accent-red)' };
}

export default function GameShow({ game, images, reviews, inCart, inLibrary }: GameShowProps) {
    const { auth } = usePage<SharedData>().props;
    const gallery =
        images.length > 0
            ? images.map((i) => `/uploads/games/${game.id}/screenshots/${i.filename}`)
            : game.image
              ? [`/uploads/games/${game.id}/${game.image}`]
              : [];
    const [activeImage, setActiveImage] = useState(0);

    const price = Number(game.price);
    const discounted = game.discount > 0 ? price * (1 - game.discount / 100) : null;

    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    const sentiment = reviewSentiment(avgRating, reviews.length);

    return (
        <>
            <Head title={game.title} />
            <SiteLayout section="store">
            <div className="px-6 py-8">
                <Link href="/store" className="mb-4 inline-block text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                    ← Back to Store
                </Link>

                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="uap-tag">{game.genre}</span>
                    {game.is_free && <span className="uap-tag uap-tag-green">Free to Play</span>}
                    {game.discount > 0 && <span className="uap-tag uap-tag-danger">-{game.discount}% OFF</span>}
                </div>
                <h1 className="mb-6 text-2xl font-extrabold" style={{ fontFamily: "'Monda', sans-serif" }}>
                    {game.title}
                </h1>

                <div className="mb-8 flex flex-col gap-4 lg:flex-row">
                    {/* Gallery */}
                    <div className="uap-card flex-1 p-4">
                        <div className="mb-2 aspect-video overflow-hidden" style={{ background: 'var(--uap-bg-deep)' }}>
                            {gallery.length > 0 && (
                                <img src={gallery[activeImage]} alt={game.title} className="h-full w-full object-cover" />
                            )}
                        </div>
                        {gallery.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {gallery.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        style={{ borderColor: i === activeImage ? 'var(--uap-accent)' : 'transparent' }}
                                        className="h-14 w-24 flex-shrink-0 overflow-hidden border-2"
                                    >
                                        <img src={src} alt="" className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info panel — Steam-style summary */}
                    <div className="flex w-full flex-col gap-4 lg:w-[380px]">
                        <div className="uap-card flex h-full flex-col p-5">
                            {/* Cover image */}
                            {game.image && (
                                <div className="mb-4 aspect-video overflow-hidden" style={{ background: 'var(--uap-bg-deep)' }}>
                                    <img
                                        src={`/uploads/games/${game.id}/${game.image}`}
                                        alt={game.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Short description */}
                            {game.description && (
                                <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--uap-text-secondary)' }}>
                                    {game.description.length > 220 ? `${game.description.slice(0, 220)}...` : game.description}
                                </p>
                            )}

                            {/* Reviews summary */}
                            <div className="mb-4 grid grid-cols-[110px_1fr] gap-y-1.5 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                <span className="uppercase tracking-wide">Recent Reviews:</span>
                                <span style={{ color: sentiment.color }}>
                                    {sentiment.label} {reviews.length > 0 && `(${reviews.length})`}
                                </span>
                                <span className="uppercase tracking-wide">All Reviews:</span>
                                <span style={{ color: sentiment.color }}>
                                    {sentiment.label} {reviews.length > 0 && `(${reviews.length})`}
                                </span>
                            </div>

                            <div style={{ borderTop: '1px solid var(--uap-border)' }} className="mb-4 pt-4">
                                <div className="grid grid-cols-[110px_1fr] gap-y-1.5 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {game.release_date && (
                                        <>
                                            <span className="uppercase tracking-wide">Release Date:</span>
                                            <span style={{ color: 'var(--uap-text-primary)' }}>
                                                {new Date(game.release_date).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </>
                                    )}
                                    {game.developer && (
                                        <>
                                            <span className="uppercase tracking-wide">Developer:</span>
                                            <span style={{ color: 'var(--uap-accent-blue)' }}>{game.developer}</span>
                                        </>
                                    )}
                                    {game.publisher && (
                                        <>
                                            <span className="uppercase tracking-wide">Publisher:</span>
                                            <span style={{ color: 'var(--uap-accent-blue)' }}>{game.publisher}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mb-4" style={{ borderTop: '1px solid var(--uap-border)', paddingTop: '16px' }}>
                                <div className="mb-2 text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    Popular tags for this game:
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {game.genre && <span className="uap-tag">{game.genre}</span>}
                                    {game.is_free && <span className="uap-tag uap-tag-green">Free to Play</span>}
                                    {game.discount > 0 && <span className="uap-tag uap-tag-danger">On Sale</span>}
                                </div>
                            </div>

                            {/* Price + CTA */}
                            <div className="mt-auto mb-3 pt-3" style={{ borderTop: '1px solid var(--uap-border)' }}>
                                {game.is_free ? (
                                    <span className="text-xl font-extrabold" style={{ color: 'var(--uap-accent-green)' }}>
                                        Free to Play
                                    </span>
                                ) : discounted ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm line-through" style={{ color: 'var(--uap-text-dim)' }}>
                                            {formatPrice(price)}
                                        </span>
                                        <span className="text-xl font-extrabold">{formatPrice(discounted)}</span>
                                    </div>
                                ) : (
                                    <span className="text-xl font-extrabold">{formatPrice(price)}</span>
                                )}
                            </div>

                            {inLibrary ? (
                                <Link href="/library" className="uap-btn uap-btn-outline block w-full text-center">
                                    Already in Library
                                </Link>
                            ) : auth.user ? (
                                inCart ? (
                                    <Link href="/cart" className="uap-btn uap-btn-outline block w-full text-center">
                                        In Cart
                                    </Link>
                                ) : (
                                    <Link href={`/cart/add/${game.id}`} method="post" as="button" className="uap-btn uap-btn-primary w-full">
                                        {game.is_free ? 'Get Free' : 'Add to Cart'}
                                    </Link>
                                )
                            ) : (
                                <Link href="/login" className="uap-btn uap-btn-outline block w-full text-center">
                                    Login to Buy
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {game.description && (
                    <div className="uap-card mb-6 p-6">
                        <h2 className="uap-section-title">About This Game</h2>
                        <p
                            className="text-sm leading-relaxed whitespace-pre-wrap"
                            style={{ color: 'var(--uap-text-secondary)' }}
                        >
                            {game.description}
                        </p>
                    </div>
                )}

                <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <div className="uap-card p-6">
                        <h2 className="uap-section-title">System Requirements</h2>
                        <div className="space-y-2 text-sm">
                            {[
                                ['OS', game.req_os],
                                ['Processor', game.req_processor],
                                ['Memory', game.req_memory],
                                ['Graphics', game.req_graphics],
                                ['Storage', game.req_storage],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between" style={{ color: 'var(--uap-text-secondary)' }}>
                                    <span>{label}</span>
                                    <span style={{ color: 'var(--uap-text-primary)' }}>{value || '-'}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="uap-card p-6">
                        <h2 className="uap-section-title">Game Details</h2>
                        <div className="space-y-2 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            <div className="flex justify-between">
                                <span>Genre</span>
                                <span style={{ color: 'var(--uap-text-primary)' }}>{game.genre}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Developer</span>
                                <span style={{ color: 'var(--uap-text-primary)' }}>{game.developer || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Publisher</span>
                                <span style={{ color: 'var(--uap-text-primary)' }}>{game.publisher || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="uap-card p-6">
                    <h2 className="uap-section-title">User Reviews</h2>
                    {reviews.length === 0 ? (
                        <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            Belum ada review untuk game ini.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="pb-4" style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="font-semibold">{review.user.username}</span>
                                        <span className="uap-tag">{review.rating}/5</span>
                                    </div>
                                    <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        {review.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
