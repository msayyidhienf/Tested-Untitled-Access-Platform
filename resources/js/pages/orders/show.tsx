import SiteLayout from '@/components/site-layout';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Printer } from 'lucide-react';

interface OrderItemRow {
    id: number;
    price: string;
    game: { id: number; title: string; image: string | null; genre: string | null } | null;
}

interface OrderRow {
    id: number;
    total: string;
    status: 'pending' | 'paid' | 'cancelled';
    created_at: string;
    items: OrderItemRow[];
}

interface OrderShowProps {
    order: OrderRow;
}

function formatPrice(value: string | number) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

const STATUS_LABEL: Record<OrderRow['status'], { label: string; className: string }> = {
    paid: { label: 'Paid', className: 'uap-tag-green' },
    pending: { label: 'Pending', className: 'uap-tag-warning' },
    cancelled: { label: 'Refunded / Cancelled', className: 'uap-tag-danger' },
};

export default function OrderShow({ order }: OrderShowProps) {
    const { flash } = usePage<SharedData>().props;
    const status = STATUS_LABEL[order.status];

    return (
        <>
            <Head title={`Invoice #${order.id}`} />
            <SiteLayout>
            <div className="px-6 py-8 print:px-0 print:py-0">
                <div className="mx-auto max-w-2xl">
                    {flash?.status && (
                        <div
                            className="mb-6 p-4 print:hidden"
                            style={{ background: 'rgba(46, 160, 67, 0.1)', border: '1px solid var(--uap-accent-green)' }}
                        >
                            <span style={{ color: 'var(--uap-text-primary)' }}>{flash.status}</span>
                        </div>
                    )}

                    <div className="mb-4 flex items-center justify-between print:hidden">
                        <Link href="/orders" className="text-sm" style={{ color: 'var(--uap-text-secondary)' }}>
                            ← Order History
                        </Link>
                        <button onClick={() => window.print()} className="uap-btn uap-btn-outline uap-btn-sm">
                            <Printer size={14} />
                            Print Invoice
                        </button>
                    </div>

                    <div className="uap-card p-8">
                        <div className="mb-6 flex items-start justify-between" style={{ borderBottom: '1px solid var(--uap-border)', paddingBottom: '20px' }}>
                            <div>
                                <img src="/images/logo.png" alt="UAP" className="mb-2 h-8 w-auto" />
                                <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>Untitled Access Platform</p>
                            </div>
                            <div className="text-right">
                                <h1 className="text-xl font-extrabold">Invoice #{order.id}</h1>
                                <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                    {new Date(order.created_at).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                                <span className={`uap-tag ${status.className} mt-2 inline-block`}>{status.label}</span>
                            </div>
                        </div>

                        <div className="mb-6 flex flex-col gap-3">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="h-12 w-20 flex-shrink-0 overflow-hidden" style={{ background: 'var(--uap-bg-deep)' }}>
                                        {item.game?.image && (
                                            <img
                                                src={`/uploads/games/${item.game.id}/${item.game.image}`}
                                                alt={item.game.title}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">{item.game?.title ?? 'Unknown game'}</p>
                                        <p className="text-xs" style={{ color: 'var(--uap-text-dim)' }}>{item.game?.genre}</p>
                                    </div>
                                    <span className="flex-shrink-0 text-sm font-semibold">{formatPrice(item.price)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '1px solid var(--uap-border)' }} className="pt-4">
                            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--uap-text-dim)' }}>
                                <span>Payment method</span>
                                <span style={{ color: 'var(--uap-text-secondary)' }}>Ucash Wallet</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="font-bold">Total Paid</span>
                                <span className="text-xl font-extrabold">{formatPrice(order.total)}</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-xs print:hidden" style={{ color: 'var(--uap-text-dim)' }}>
                        Questions about this order? Visit{' '}
                        <Link href="/support/refund" style={{ color: 'var(--uap-accent)' }} className="hover:underline">
                            Refund Policy
                        </Link>{' '}
                        or{' '}
                        <Link href="/support/contact" style={{ color: 'var(--uap-accent)' }} className="hover:underline">
                            Contact Support
                        </Link>
                        .
                    </p>
                </div>
            </div>
            </SiteLayout>
        </>
    );
}
