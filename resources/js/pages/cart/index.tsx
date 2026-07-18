import SiteLayout from '@/components/site-layout';
import { type Game, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CartItem {
    id: number;
    game_id: number;
    game: Game;
}

interface CartIndexProps {
    items: CartItem[];
    total: number;
}

function formatPrice(value: number) {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

function itemPrice(game: Game) {
    const price = Number(game.price);
    return game.discount > 0 ? price * (1 - game.discount / 100) : price;
}

export default function CartIndex({ items, total }: CartIndexProps) {
    const { flash } = usePage<SharedData>().props;
    const [removingId, setRemovingId] = useState<number | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);

    const savings = items.reduce((sum, item) => {
        const price = Number(item.game.price);
        return sum + (item.game.discount > 0 ? price - itemPrice(item.game) : 0);
    }, 0);

    const removeItem = (gameId: number) => {
        setRemovingId(gameId);
        router.delete(`/cart/${gameId}`, { preserveScroll: true, onFinish: () => setRemovingId(null) });
    };

    const checkout = () => {
        if (checkingOut) return;
        setCheckingOut(true);
        router.post('/cart/checkout', {}, { onFinish: () => setCheckingOut(false) });
    };

    return (
        <>
            <Head title="Cart" />
            <SiteLayout>
            <div className="px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-extrabold">Shopping Cart</h1>
                        <p className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            {items.length} game{items.length !== 1 ? 's' : ''} ready for checkout
                        </p>
                    </div>
                    <Link href="/store" className="uap-btn uap-btn-outline uap-btn-sm">
                        + Add More Games
                    </Link>
                </div>

                {flash?.status && (
                    <div className="mb-6 p-4" style={{ background: 'rgba(46, 160, 67, 0.1)', border: '1px solid var(--uap-accent-green)' }}>
                        <span style={{ color: 'var(--uap-text-primary)' }}>{flash.status}</span>
                    </div>
                )}

                {flash?.error && (
                    <div
                        className="mb-6 flex items-center justify-between gap-4 p-4"
                        style={{ background: 'rgba(184, 50, 50, 0.1)', border: '1px solid var(--uap-accent)' }}
                    >
                        <span style={{ color: 'var(--uap-text-primary)' }}>{flash.error}</span>
                        <Link href="/wallet" className="uap-btn uap-btn-primary uap-btn-sm flex-shrink-0">
                            Top Up Ucash
                        </Link>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="uap-card p-16 text-center">
                        <p className="mb-4" style={{ color: 'var(--uap-text-secondary)' }}>
                            Your cart is empty.
                        </p>
                        <Link href="/store" className="uap-btn uap-btn-primary">
                            Browse Store
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        {/* Items */}
                        <div className="flex flex-col gap-3">
                            {items.map((item) => (
                                <div key={item.id} className="uap-card flex items-center gap-4 p-3">
                                    <Link
                                        href={`/game/${item.game_id}`}
                                        className="block h-20 w-36 flex-shrink-0 overflow-hidden"
                                        style={{ background: 'var(--uap-bg-deep)' }}
                                    >
                                        {item.game.image && (
                                            <img
                                                src={`/uploads/games/${item.game_id}/${item.game.image}`}
                                                alt={item.game.title}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </Link>

                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`/game/${item.game_id}`}
                                            className="block truncate font-semibold hover:underline"
                                            style={{ color: 'var(--uap-text-primary)' }}
                                        >
                                            {item.game.title}
                                        </Link>
                                        {item.game.genre && <p className="uap-game-card-genre mt-0.5">{item.game.genre}</p>}
                                        <div className="mt-2 flex items-center gap-2">
                                            {item.game.discount > 0 && <span className="uap-price-discount">-{item.game.discount}%</span>}
                                            {item.game.discount > 0 && (
                                                <span className="text-xs line-through" style={{ color: 'var(--uap-text-dim)' }}>
                                                    {formatPrice(Number(item.game.price))}
                                                </span>
                                            )}
                                            <span className="uap-price-tag">{formatPrice(itemPrice(item.game))}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.game_id)}
                                        disabled={removingId === item.game_id}
                                        title="Remove from cart"
                                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center transition-colors disabled:opacity-40"
                                        style={{ color: 'var(--uap-text-dim)' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--uap-accent-red)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--uap-text-dim)')}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="uap-card sticky top-[calc(var(--uap-topbar-h)+16px)] h-fit p-6">
                            <h2 className="uap-section-title">Order Summary</h2>
                            <div className="mb-4 flex max-h-64 flex-col gap-2 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between gap-2 text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        <span className="truncate">{item.game.title}</span>
                                        <span className="flex-shrink-0" style={{ color: 'var(--uap-text-primary)' }}>
                                            {formatPrice(itemPrice(item.game))}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <hr className="mb-4" style={{ borderColor: 'var(--uap-border)' }} />
                            {savings > 0 && (
                                <div className="mb-2 flex justify-between text-sm">
                                    <span style={{ color: 'var(--uap-text-secondary)' }}>You save</span>
                                    <span style={{ color: 'var(--uap-accent-green)' }}>-{formatPrice(savings)}</span>
                                </div>
                            )}
                            <div className="mb-6 flex justify-between" style={{ color: 'var(--uap-text-primary)' }}>
                                <span className="font-bold">Total</span>
                                <span className="text-lg font-extrabold">{formatPrice(total)}</span>
                            </div>
                            <button onClick={checkout} disabled={checkingOut} className="uap-btn uap-btn-primary mb-2 w-full disabled:opacity-60">
                                {checkingOut ? 'Processing...' : 'Checkout'}
                            </button>
                            <Link href="/store" className="uap-btn uap-btn-outline w-full">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            </SiteLayout>
        </>
    );
}
