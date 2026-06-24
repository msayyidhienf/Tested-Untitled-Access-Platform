import SiteLayout from '@/components/site-layout';
import { type Game } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

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
    const removeItem = (gameId: number) => {
        router.delete(`/cart/${gameId}`);
    };

    const checkout = () => {
        router.post('/cart/checkout');
    };

    return (
        <>
            <Head title="Cart" />
            <SiteLayout>
            <div className="px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-extrabold">Shopping Cart</h1>
                    <Link href="/store" className="uap-btn uap-btn-outline uap-btn-sm">
                        + Add More Games
                    </Link>
                </div>

                {items.length === 0 ? (
                    <div className="uap-card p-16 text-center">
                        <p className="mb-4" style={{ color: 'var(--uap-text-secondary)' }}>
                            Cart kamu kosong.
                        </p>
                        <Link href="/store" className="uap-btn uap-btn-primary">
                            Browse Store
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        {/* Items */}
                        <div className="flex flex-col gap-2">
                            {items.map((item) => (
                                <div key={item.id} className="uap-card flex items-center justify-between p-5">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="flex h-15 w-20 flex-shrink-0 items-center justify-center overflow-hidden"
                                            style={{ background: 'var(--uap-bg-deep)' }}
                                        >
                                            {item.game.image && (
                                                <img
                                                    src={`/uploads/games/${item.game_id}/${item.game.image}`}
                                                    alt={item.game.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold" style={{ color: 'var(--uap-text-primary)' }}>
                                                {item.game.title}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                {item.game.discount > 0 && (
                                                    <span className="uap-price-discount">-{item.game.discount}%</span>
                                                )}
                                                <span className="uap-price-tag">{formatPrice(itemPrice(item.game))}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => removeItem(item.game_id)} className="uap-btn uap-btn-danger uap-btn-sm">
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="uap-card p-6">
                            <h2 className="uap-section-title">Order Summary</h2>
                            <div className="mb-4 flex flex-col gap-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                                        <span>{item.game.title}</span>
                                        <span style={{ color: 'var(--uap-text-primary)' }}>{formatPrice(itemPrice(item.game))}</span>
                                    </div>
                                ))}
                            </div>
                            <hr className="mb-4" style={{ borderColor: 'var(--uap-border)' }} />
                            <div className="mb-6 flex justify-between" style={{ color: 'var(--uap-text-primary)' }}>
                                <span className="font-bold">Total</span>
                                <span className="text-lg font-extrabold">{formatPrice(total)}</span>
                            </div>
                            <button onClick={checkout} className="uap-btn uap-btn-primary mb-2 w-full">
                                Checkout
                            </button>
                            <Link href="/store" className="uap-btn uap-btn-outline w-full">
                                Lanjut Belanja
                            </Link>
                        </div>
                    </div>
                )}
            </div>
            </SiteLayout>
        </>
    );
}
