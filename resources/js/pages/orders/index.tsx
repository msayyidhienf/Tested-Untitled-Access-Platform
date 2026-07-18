import SiteLayout from '@/components/site-layout';
import { Head, Link } from '@inertiajs/react';

interface OrderRow {
    id: number;
    total: string;
    status: 'pending' | 'paid' | 'cancelled';
    created_at: string;
    items_count: number;
}

interface OrdersIndexProps {
    orders: OrderRow[];
}

function formatPrice(value: string | number) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

const STATUS_LABEL: Record<OrderRow['status'], { label: string; className: string }> = {
    paid: { label: 'Paid', className: 'uap-tag-green' },
    pending: { label: 'Pending', className: 'uap-tag-warning' },
    cancelled: { label: 'Refunded / Cancelled', className: 'uap-tag-danger' },
};

export default function OrdersIndex({ orders }: OrdersIndexProps) {
    return (
        <>
            <Head title="Order History" />
            <SiteLayout>
            <div className="px-6 py-8">
                <h1 className="mb-6 text-2xl font-extrabold">Order History</h1>

                {orders.length === 0 ? (
                    <div className="uap-card p-16 text-center">
                        <p className="mb-4" style={{ color: 'var(--uap-text-secondary)' }}>
                            You haven't made any purchases yet.
                        </p>
                        <Link href="/store" className="uap-btn uap-btn-primary">
                            Browse Store
                        </Link>
                    </div>
                ) : (
                    <div className="uap-card overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--uap-border)', color: 'var(--uap-text-dim)' }} className="text-left text-xs">
                                    <th className="px-4 py-3">Order</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => {
                                    const status = STATUS_LABEL[order.status];
                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--uap-border)' }}>
                                            <td className="px-4 py-3 font-semibold">#{order.id}</td>
                                            <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-4 py-3" style={{ color: 'var(--uap-text-secondary)' }}>
                                                {order.items_count} game{order.items_count !== 1 ? 's' : ''}
                                            </td>
                                            <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`uap-tag ${status.className}`}>{status.label}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link href={`/orders/${order.id}`} className="uap-btn uap-btn-outline uap-btn-sm">
                                                    View Invoice
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            </SiteLayout>
        </>
    );
}
